import {
  MongooseAbstractRepository,
  EntityManager,
} from '@app/database/useMongoose/abstract.repo';
import { BlogEntity } from './objects/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ElasticsearchAbstractRepository } from '@app/database/useElasticSearch/abstract.repo';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class BlogRepository extends MongooseAbstractRepository<BlogEntity> {
  constructor(
    @InjectModel(BlogEntity.name, 'ttt')
    blogEm: EntityManager<BlogEntity>,
  ) {
    super(blogEm);
    super.extendSorting({ title: 1 });
  }
}

@Injectable()
export class BlogIndexRepository extends ElasticsearchAbstractRepository {
  constructor(ess: ElasticsearchService) {
    super(ess, {
      idColumnIndicator: '_id',
      indexName: 'blog_idx',
      indexActivateOnFields: ['title'],
    });
  }
}
