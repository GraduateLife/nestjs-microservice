import { RestfulDto } from '@app/restful/decorators/RestfulDto.decorator';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  AuthorCanChangeFields,
  BlogStatus,
  EditorCanChangeFields,
} from './blog.entity';
import { PartialType } from '@nestjs/swagger';
import { V } from '@app/common/validators/v.decorator';
import { PageDto } from '@app/common/pagination/page.dto';

// const { Methods } = useTemplate('default');

@RestfulDto({
  toBeLocated: 'body',
  toBeValidatedInGroups: ['createOne'],
  toUseTemplate: 'default',
})
export class CreateBlogDto implements AuthorCanChangeFields {
  @V(
    {
      typeHint: IsString,
      extraValidators: [MinLength(1)],
    },
    { description: 'the cover url of the blog' },
  )
  coverImgUrl: string;

  @V(
    {
      typeHint: IsString,
      extraValidators: [MinLength(1)],
    },
    { description: 'the title of the blog' },
  )
  title: string;

  @V(
    {
      typeHint: IsString,
    },
    { description: 'the description of the blog' },
  )
  content: string;

  @V(
    {
      typeHint: IsString,
      extraValidators: [MinLength(1)],
    },
    { description: 'the description of the blog' },
  )
  description: string;

  @V(
    {
      typeHint: IsString,
    },
    { description: 'the author id of the blog' },
  )
  authorId: string;

  @V(
    {
      typeHint: IsArray,
      extraValidators: [IsString({ each: true })],
    },
    { description: 'the tag ids of the blog' },
  )
  tags: string[];
}

@RestfulDto({
  toBeLocated: 'body',
  toBeValidatedInGroups: ['updateOne'],
  toUseTemplate: 'default',
})
export class UpdateBlogDto
  extends PartialType(CreateBlogDto)
  implements EditorCanChangeFields
{
  @V(
    {
      typeHint: IsString,
      extraValidators: [IsOptional(), IsEnum(BlogStatus)],
    },
    { description: 'the status of the blog, default is submitted' },
  )
  status: BlogStatus;
}

@RestfulDto({
  toBeLocated: 'query',
  toBeValidatedInGroups: ['findMany'],
  toUseTemplate: 'default',
})
export class ListBlogDto extends PageDto {}
