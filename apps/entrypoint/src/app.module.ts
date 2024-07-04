import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database';
// import { BlogModule } from 'apps/blog/src/blog.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
