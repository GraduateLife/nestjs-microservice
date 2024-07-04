import {
  AbstractRepository,
  EntityManager,
} from '@app/database/abstracts/abstract.repo';
import { BlogEntity } from './entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';

export class BlogRepository extends AbstractRepository<BlogEntity> {
  constructor(@InjectModel(BlogEntity.name) blogEm: EntityManager<BlogEntity>) {
    super(blogEm);
  }
}
