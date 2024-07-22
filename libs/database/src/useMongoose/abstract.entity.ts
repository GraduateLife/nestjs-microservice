import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractEntity {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ types: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ types: SchemaTypes.Date })
  updatedAt: Date;

  @Prop({ types: SchemaTypes.Date })
  deletedAt: Date;
}

export type AbstractEntityKeys =
  | '_id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'isDeleted';
