import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogEntity } from './objects/blog.entity';
import { BlogIndexRepository, BlogRepository } from './blog.repo';
import { DatabaseModule } from '@app/database';
import { useElasticModule } from '@app/database/useElasticSearch/useElasticSearch.module';
import { useRedisModule } from '@app/database/useRedis/useRedis.module';

const url = `mongodb://localhost:27017/ddd`.replace('<password>', 'zyt753951');
@Module({
  imports: [
    DatabaseModule.use('mongoose').forRoot(url, 'ttt'),
    DatabaseModule.use('mongoose').forFeature(BlogEntity, 'ttt'),
    useElasticModule.forRoot('http://localhost:9200'),
    useRedisModule.forRoot('abc', { port: 6379, host: '192.168.56.10' }),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, BlogIndexRepository],
})
export class BlogModule {}
