import { RestfulDto } from '@app/restful/decorators/RestfulDto.decorator';
import { PartialType } from '@nestjs/mapped-types';
import { Expose, Exclude } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

@RestfulDto({
  toBeLocated: 'body',
  toBeValidatedInGroups: ['create'],
  toUseTemplate: 'default',
})
export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  password: string;

  @IsNumber()
  @Min(0.01)
  price: number;
}

@RestfulDto({
  toBeLocated: 'body',
  toBeValidatedInGroups: ['update'],
  toUseTemplate: 'default',
})
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class BlogView {
  @Expose({ groups: ['create', 'update'] })
  _id: string;

  @Expose({ groups: ['create', 'update'] })
  title: string;

  @Expose({ groups: ['update'] })
  price: number;

  @Exclude()
  password: string;
}
