import { Injectable } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

import { BlogRepository } from './blog.repo';
import {
  PageDto,
  extractPageParameters,
} from '@app/common/pagination/page.dto';

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogRepository) {}

  async create(createCatDto: CreateBlogDto) {
    return await this.blogRepository.createOne({ ...createCatDto });
  }

  async findAll() {
    return await this.blogRepository.findManyByQuery({});
  }
  async findManyInPage(pageDto: PageDto) {
    const { currentPage, pageSize } = extractPageParameters(pageDto);
    return await this.blogRepository.findManyInPageByQuery(
      {},
      currentPage,
      pageSize,
    );
  }

  async findOne(_id: string) {
    return await this.blogRepository.findOneByQuery({ _id });
  }

  async update(_id: string, updateBlogDto: UpdateBlogDto) {
    return await this.blogRepository.updateOneByQuery(
      { _id },
      { $set: { ...updateBlogDto } },
    );
  }

  async remove(_id: string) {
    return await this.blogRepository.deleteOneByQuery({ _id });
  }
}
