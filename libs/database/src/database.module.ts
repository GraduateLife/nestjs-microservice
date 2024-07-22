import { Module } from '@nestjs/common';

import { useMongooseModule } from './useMongoose/useMongoose.module';

type DatabaseNames = 'mongoose';

@Module({})
export class DatabaseModule {
  static use(subModuleName: DatabaseNames) {
    switch (subModuleName) {
      case 'mongoose':
        return useMongooseModule;

        break;

      default:
        break;
    }
  }
}
