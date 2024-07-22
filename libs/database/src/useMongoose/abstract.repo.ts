import mongoose, {
  FilterQuery,
  Model,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractEntityKeys, type AbstractEntity } from './abstract.entity';

import { DatabaseQueryNotHitException } from '@app/database/exceptions';
import {
  createPage,
  createPageMetadata,
  getMaxPossiblePageIndex,
} from '@app/common/pagination';
import { Page } from '@app/common/pagination/types';
import { ObjectStringify } from '@app/common/types/Object';
import { Exception } from '@app/common/exceptions';

// const $pageSize = 10;
// const $defaultUsePage = true;

// await this.entityManager
//   .find(
//     { $text: { $search: 'text that you want to search for' } },
//     { score: { $meta: 'textScore' } },
//   )
//   .sort({ score: { $meta: 'textScore' } });

interface CanPerformCurd<TEntity extends AbstractEntity> {
  createOneByAttributes: (...args: any) => Promise<TEntity>;
  findOneByAttributes: (...args: any) => Promise<TEntity>;
  updateOneByAttributes: (...args: any) => Promise<TEntity>;
  deleteOneByAttributes: (...args: any) => Promise<TEntity>;
}

interface CanPerformBulkCurd<TEntity extends AbstractEntity> {
  findManyByAttributes: (...args: any) => Promise<TEntity[]>;
}

interface CanPerformPagination<TEntity extends AbstractEntity> {
  findEntityCountByAttributes: (...args: any) => Promise<number>;
  findManyAfterSkipCertainAmountByAttributes: (
    ...args: any
  ) => Promise<TEntity[]>;
  findManyByAttributesInPage: (...args: any) => Promise<Page>;
}

interface CanPerformSoftDelete<TEntity extends AbstractEntity> {
  useDeleteFlag: boolean;
  setUseDeleteFlag: (...args: any) => void;
  restoreOneByAttributes: (...args: any) => Promise<TEntity>;
  findManyNotDeletedByAttributesInPage: (...args: any) => Promise<Page>;
  findManyDeletedByAttributesInPage: (...args: any) => Promise<Page>;
}

export type EntityManager<TEntity extends AbstractEntity> = Model<TEntity>;

type SortingObject = { [key: string]: SortOrder };

/**
 * @warning must override constructor to inject entityManager(by @InjectModel(SomeEntity.name))
 */
export class MongooseAbstractRepository<TEntity extends AbstractEntity>
  implements
    CanPerformCurd<TEntity>,
    CanPerformBulkCurd<TEntity>,
    CanPerformPagination<TEntity>,
    CanPerformSoftDelete<TEntity>
{
  constructor(
    protected entityManager: EntityManager<TEntity>,
    private sorting: SortingObject = {
      createdAt: -1,
      updatedAt: -1,
      deletedAt: -1,
    },
    private useDeleteFlag = true,
  ) {}

  protected extendSorting(toExtend: SortingObject) {
    this.sorting = { ...this.sorting, ...toExtend };
  }

  protected setUseDeleteFlag(willUseDeleteFlag: boolean) {
    this.useDeleteFlag = willUseDeleteFlag;
  }

  async createOneByAttributes(
    attrs: Omit<TEntity, AbstractEntityKeys>,
  ): Promise<TEntity> {
    const toCreate = new this.entityManager({
      ...attrs,
      _id: new Types.ObjectId(),
      createdAt: new Date(),
    });
    const res = (await toCreate.save()).toJSON() as TEntity;
    return res;
  }

  /**
   * @throws NotFoundException
   */
  async findOneByAttributes(query: FilterQuery<TEntity>): Promise<TEntity> {
    const toFind = (await this.entityManager
      .findOne(query)
      .lean(true)) as TEntity;
    if (toFind) {
      return toFind;
    }

    throw new DatabaseQueryNotHitException(ObjectStringify(query));
  }

  /**
   * @throws NotFoundException
   */
  async findManyByAttributes(
    query: FilterQuery<TEntity>,
    sorting = this.sorting,
  ): Promise<TEntity[]> {
    const toFinds = (await this.entityManager
      .find(query)
      .sort(sorting)
      .lean(true)) as TEntity[];
    if (toFinds) {
      return toFinds;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(query));
  }

  /**
   * @throws NotFoundException
   */
  async findManyByAttributesInPage(
    query: FilterQuery<TEntity>,
    currentPage: number,
    pageSize: number,
    sorting = this.sorting,
  ): Promise<Page> {
    const all = await this.findEntityCountByAttributes(query);
    const maxPageIndex = getMaxPossiblePageIndex(all, pageSize);
    if (currentPage > maxPageIndex) {
      currentPage = maxPageIndex;
    }

    const toFinds = await this.findManyAfterSkipCertainAmountByAttributes(
      query,
      pageSize,
      (currentPage - 1) * pageSize,
      sorting,
    );

    const toCreatePageMetaData = createPageMetadata(all, pageSize, currentPage);

    return createPage(toFinds, toCreatePageMetaData);
  }
  async findManyNotDeletedByAttributesInPage(
    query: FilterQuery<TEntity>,
    currentPage: number,
    pageSize: number,
    sorting = this.sorting,
  ) {
    return await this.findManyByAttributesInPage(
      { ...query, deletedAt: { $not: { $lt: Date.now() } } },
      currentPage,
      pageSize,
      sorting,
    );
  }
  async findManyDeletedByAttributesInPage(
    query: FilterQuery<TEntity>,
    currentPage: number,
    pageSize: number,
    sorting = this.sorting,
  ) {
    return await this.findManyByAttributesInPage(
      { ...query, deletedAt: { $lt: Date.now() } },
      currentPage,
      pageSize,
      sorting,
    );
  }

  /**
   * @throws NotFoundException
   */
  async updateOneByAttributes(
    selectQuery: FilterQuery<TEntity>,
    updateQuery: UpdateQuery<TEntity>,
  ): Promise<TEntity> {
    const toUpdate = (await this.entityManager
      .findOneAndUpdate(
        selectQuery,
        { $set: { ...updateQuery, updatedAt: new Date() } },
        {
          new: true,
        },
      )
      .lean(true)) as TEntity;
    if (toUpdate) {
      return toUpdate;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(selectQuery));
  }

  /**
   * @throws NotFoundException
   */
  async deleteOneByAttributes(query: FilterQuery<TEntity>): Promise<TEntity> {
    let toFind: TEntity;
    if (this.useDeleteFlag === false) {
      toFind = (await this.entityManager
        .findOneAndDelete(query)
        .lean(true)) as TEntity;
    }
    toFind = await this.updateOneByAttributes(query, { deletedAt: new Date() });

    if (toFind) {
      return toFind;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(query));
  }

  async restoreOneByAttributes(query: FilterQuery<TEntity>): Promise<TEntity> {
    if (this.useDeleteFlag === false)
      throw new Exception(
        'This entity cannot be restored since it did not enable delete flag option',
      );
    return await this.updateOneByAttributes(query, {
      $unset: { deletedAt: undefined },
    });
  }

  async findEntityCountByAttributes(
    query: FilterQuery<TEntity>,
  ): Promise<number> {
    return await this.entityManager.countDocuments(query);
  }

  async findManyAfterSkipCertainAmountByAttributes(
    attrs: FilterQuery<TEntity>,
    toFindCount: number,
    afterSkip: number,
    sorting = this.sorting,
  ): Promise<TEntity[]> {
    const toFinds = await this.entityManager
      .find(attrs)
      .limit(toFindCount)
      .skip(afterSkip)
      .sort(sorting);

    if (toFinds) {
      return toFinds;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(attrs));
  }
}
