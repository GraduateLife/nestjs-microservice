import { BlogService } from './blog.service';
import { useTemplate } from '@app/restful';
import { CreateBlogDto, UpdateBlogDto } from './objects/blog.dto';
import { Body, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { PageDto } from '@app/common/pagination/page.dto';
import { IDefaultTemplate } from '@app/restful/templates/Default';
import { BlogView } from './objects/blog.view';
import { ApiOkResponse } from '@nestjs/swagger';
import { useMongoose } from '@app/database/useMongoose';

const { RestfulController, ParamMagics } = useTemplate('default');
const { MongooseSerializer, ValidateObjectIdPipe } = useMongoose();

@UseInterceptors(MongooseSerializer)
@RestfulController('blog', BlogView, {
  findMany: [
    // SkipViewSerialization(),
    ApiOkResponse({ description: 'This method returns blogs in page' }),
  ],
})
export class BlogController implements IDefaultTemplate {
  constructor(private blogService: BlogService) {}

  createOne(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }
  @Get('/deleted')
  findDeleted(@Query() pageDto: PageDto) {
    return this.blogService.findManyDeletedByAttributesInPage(
      pageDto,
      // isDeleted: true,
    );
  }
  @Get('/not-deleted')
  findNotDeleted(@Query() pageDto: PageDto) {
    return this.blogService.findManyNotDeletedByAttributesInPage(pageDto);
  }

  findMany(@Query() pageDto: PageDto) {
    return this.blogService.findManyInPage(pageDto);
  }

  findOne(@Param(ParamMagics.id, ValidateObjectIdPipe) id: string) {
    return this.blogService.findOne(id);
  }

  updateOne(
    @Param(ParamMagics.id, ValidateObjectIdPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  deleteOne(@Param(ParamMagics.id, ValidateObjectIdPipe) id: string) {
    return this.blogService.remove(id);
  }
}
