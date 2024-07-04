import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { type AbstractEntity } from './abstract.entity';

import { DatabaseQueryNotHitException } from '@app/database/exceptions';
import {
  createPage,
  createPageMetadata,
  getMaxPossiblePageIndex,
} from '@app/common/pagination';
import { Page } from '@app/common/pagination/types';
import { ObjectStringify } from '@app/common/types/Object';

// const $pageSize = 10;
// const $defaultUsePage = true;

export interface DbOperateAble<TEntity extends AbstractEntity> {
  createOne: (attrs: Omit<TEntity, '_id'>) => Promise<TEntity>;
  findOneByQuery: (query: FilterQuery<TEntity>) => Promise<TEntity>;
  findManyByQuery: (query: FilterQuery<TEntity>) => Promise<TEntity[]>;
  updateOneByQuery: (
    selectQuery: FilterQuery<TEntity>,
    updateQuery: UpdateQuery<TEntity>,
  ) => Promise<TEntity>;
  deleteOneByQuery: (query: FilterQuery<TEntity>) => Promise<TEntity>;
}

export type EntityManager<TEntity extends AbstractEntity> = Model<TEntity>;

/**
 * @warning must override constructor to inject entityManager(by @InjectModel(SomeEntity.name))
 */
export class AbstractRepository<TEntity extends AbstractEntity>
  implements DbOperateAble<TEntity>
{
  constructor(protected entityManager: EntityManager<TEntity>) {}

  async createOne(attrs: Omit<TEntity, '_id'>): Promise<TEntity> {
    const toCreate = new this.entityManager({
      ...attrs,
      _id: new Types.ObjectId(),
    });
    const res = (await toCreate.save()).toJSON() as TEntity;
    return res;
  }

  /**
   * @throws NotFoundException
   */
  async findOneByQuery(query: FilterQuery<TEntity>): Promise<TEntity> {
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
  async findManyByQuery(query: FilterQuery<TEntity>): Promise<TEntity[]> {
    const toFinds = (await this.entityManager
      .find(query)
      .lean(true)) as TEntity[];
    if (toFinds) {
      return toFinds;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(query));
  }

  /**
   * @throws NotFoundException
   */
  async findManyInPageByQuery(
    query: FilterQuery<TEntity>,
    currentPage: number,
    pageSize: number,
  ): Promise<Page> {
    // if (currentPage < 1) {
    //   throw new Exception(
    //     `Unexpected page index, expected to have minimum page index: 1, but request for page index: ${currentPage}`,
    //   );
    // }
    // if (!currentPage && $defaultUsePage) {
    //   currentPage = 1;
    // }
    // if (!pageSize) {
    //   pageSize = $pageSize;
    // }
    const all = await this.countByQuery(query);
    const maxPageIndex = getMaxPossiblePageIndex(all, pageSize);
    if (currentPage > maxPageIndex) {
      currentPage = maxPageIndex;
    }
    const toFinds = (await this.entityManager
      .find(query)
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize)) as TEntity[];

    if (toFinds) {
      const toCreatePageMetaData = createPageMetadata(
        all,
        pageSize,
        currentPage,
      );

      return createPage(toFinds, toCreatePageMetaData);
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(query));
  }

  /**
   * @throws NotFoundException
   */
  async updateOneByQuery(
    selectQuery: FilterQuery<TEntity>,
    updateQuery: UpdateQuery<TEntity>,
  ): Promise<TEntity> {
    const toUpdate = (await this.entityManager
      .findOneAndUpdate(selectQuery, updateQuery, { new: true })
      .lean(true)) as TEntity;
    if (toUpdate) {
      return toUpdate;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(selectQuery));
  }

  /**
   * @throws NotFoundException
   */
  async deleteOneByQuery(query: FilterQuery<TEntity>): Promise<TEntity> {
    const toFind = (await this.entityManager
      .findOneAndDelete(query)
      .lean(true)) as TEntity;
    if (toFind) {
      return toFind;
    }
    throw new DatabaseQueryNotHitException(ObjectStringify(query));
  }

  async countByQuery(query: FilterQuery<TEntity>): Promise<number> {
    return await this.entityManager.countDocuments(query);
  }
}
