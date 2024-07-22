import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repo';
import { DatabaseModule } from '@app/database';
import { BlogEntity } from './objects/blog.entity';

describe('BlogController', () => {
  let appController: BlogController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DatabaseModule.forFeature(BlogEntity)],
      controllers: [BlogController],
      providers: [BlogService, BlogRepository],
    }).compile();

    appController = app.get(BlogController);
  });

  describe('root', () => {
    it('should greet', () => {
      expect(appController.greet()).toBe('Hello from blog');
    });
  });
});
