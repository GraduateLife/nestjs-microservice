import { Module, Type } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';

const url = `mongodb://localhost:27017/`.replace('<password>', 'zyt753951');

// const createEntityCtx = <G>(TGT: Type<G>) => {
//   return SchemaFactory.createForClass<G>(TGT);
// };

// DatabaseModule.forFeature([{ name: BlogEntity.name, schema: BlogSchema }]),

@Module({
  imports: [MongooseModule.forRoot(url)],
  // providers: [DatabaseService],
  // exports: [MongooseModule],
})
export class DatabaseModule {
  static forFeature<G>(toRegister: Type<G> | Type<G>[]) {
    if (!Array.isArray(toRegister)) {
      toRegister = [toRegister];
    }
    const transformed = toRegister.map((entity: Type<G>) => {
      return {
        name: entity.name,
        schema: SchemaFactory.createForClass(entity),
      };
    });
    return MongooseModule.forFeature([...transformed]);
  }
}
