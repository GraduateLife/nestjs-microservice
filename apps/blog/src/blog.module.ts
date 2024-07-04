import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { DatabaseModule } from '@app/database';
import { BlogEntity } from './entities/blog.entity';
import { BlogRepository } from './blog.repo';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature(BlogEntity)],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
})
export class BlogModule {}
