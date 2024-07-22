import { AbstractEntity } from '@app/database/useMongoose/abstract.entity';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

export enum BlogStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PUBLISHED = 'PUBLISHED',
}

export interface AuthorCanChangeFields {
  title: string;
  description: string;
  content: string;
  coverImgUrl: string;
  tags: string[];
  authorId: string;
}

export interface EditorCanChangeFields {
  status: BlogStatus;
}

export interface MachineFields {
  commentCount: number;
  viewCount: number;
  shareCount: number;
  publishedAt: Date;
}

@Schema({ collection: 'blog', versionKey: false })
export class BlogEntity
  extends AbstractEntity
  implements AuthorCanChangeFields, EditorCanChangeFields, MachineFields
{
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  authorId: string;

  @Prop()
  description: string;

  @Prop()
  coverImgUrl: string;

  @Prop({ type: String, enum: BlogStatus, default: BlogStatus.SUBMITTED })
  status: BlogStatus;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  shareCount: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ types: SchemaTypes.Date })
  publishedAt: Date;
}

export type IBlog = typeof BlogEntity.prototype;
