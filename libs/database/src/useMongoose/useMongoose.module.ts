import { DynamicModule, Type } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';

export class useMongooseModule {
  static forRoot(url: string, connectionName?: string) {
    if (connectionName) {
      return MongooseModule.forRoot(url, { connectionName });
    }
    return MongooseModule.forRoot(url);
  }
  static forFeature<G>(
    toRegister: Type<G> | Type<G>[],
    connectionName?: string,
  ): DynamicModule {
    if (!Array.isArray(toRegister)) {
      toRegister = [toRegister];
    }
    const transformed = toRegister.map((entity: Type<G>) => {
      return {
        name: entity.name,
        schema: SchemaFactory.createForClass(entity),
      };
    });
    return MongooseModule.forFeature([...transformed], connectionName);
  }
}
