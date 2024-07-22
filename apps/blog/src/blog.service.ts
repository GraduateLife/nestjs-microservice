import { Injectable } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from './objects/blog.dto';

import { BlogIndexRepository, BlogRepository } from './blog.repo';
import {
  PageDto,
  extractPageParameters,
} from '@app/common/pagination/page.dto';
import { BlogEntity } from './objects/blog.entity';
import { FilterQuery } from 'mongoose';
import { IRedis, RedisCli } from '@app/database/useRedis/useRedis.module';

@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogRepository,
    private blogIndexRepository: BlogIndexRepository,
    @RedisCli('abc') private redisCli: IRedis,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const created = await this.blogRepository.createOneByAttributes({
      ...(createBlogDto as BlogEntity),
    });

    await this.blogIndexRepository.indexOneDocWithId(
      created._id.toString(),
      created,
    );
    return created;
  }

  async findAll() {
    return await this.blogRepository.findManyByAttributes({});
  }
  async findManyInPage(pageDto: PageDto, filter: FilterQuery<BlogEntity> = {}) {
    await this.redisCli.set('fo', 'ba');
    const { currentPage, pageSize } = extractPageParameters(pageDto);
    return await this.blogRepository.findManyByAttributesInPage(
      filter,
      currentPage,
      pageSize,
    );
  }

  async findManyNotDeletedByAttributesInPage(
    pageDto: PageDto,
    filter: FilterQuery<BlogEntity> = {},
  ) {
    const { currentPage, pageSize } = extractPageParameters(pageDto);
    return await this.blogRepository.findManyNotDeletedByAttributesInPage(
      filter,
      currentPage,
      pageSize,
    );
  }

  async findManyDeletedByAttributesInPage(
    pageDto: PageDto,
    filter: FilterQuery<BlogEntity> = {},
  ) {
    const { currentPage, pageSize } = extractPageParameters(pageDto);
    return await this.blogRepository.findManyDeletedByAttributesInPage(
      filter,
      currentPage,
      pageSize,
    );
  }

  async findOne(_id: string) {
    return await this.blogRepository.findOneByAttributes({ _id });
  }

  async update(_id: string, updateBlogDto: UpdateBlogDto) {
    const updated = await this.blogRepository.updateOneByAttributes(
      { _id },
      { ...updateBlogDto },
    );
    await this.blogIndexRepository.updateOneDocWithId(
      updated._id.toString(),
      updated,
    );
    return updated;
  }

  async remove(_id: string) {
    return await this.blogRepository.deleteOneByAttributes({ _id });
  }

  // async restore(_id: string) {}
}
