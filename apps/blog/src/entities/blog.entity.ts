import { AbstractEntity } from '@app/database/abstracts/abstract.entity';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BlogEntity extends AbstractEntity {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  password: string;
}
