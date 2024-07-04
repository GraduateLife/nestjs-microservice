import { BlogService } from './blog.service';
import { useTemplate } from '@app/restful';
import { BlogView, CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { Body, Param, Query } from '@nestjs/common';
import { PageDto } from '@app/common/pagination/page.dto';

const { RestfulController, ParamMagics } = useTemplate('default');

@RestfulController('/blog', BlogView)
export class BlogController {
  constructor(private blogService: BlogService) {}

  async create(@Body() CREATE_DTO: CreateBlogDto) {
    return await this.blogService.create(CREATE_DTO);
  }

  findAll(@Query() LIST_DTO: PageDto) {
    return this.blogService.findManyInPage(LIST_DTO);
  }

  findOne(@Param(ParamMagics.id) id: any) {
    return this.blogService.findOne(id);
  }

  update(@Param(ParamMagics.id) id: any, @Body() UPDATE_DTO: UpdateBlogDto) {
    return this.blogService.update(id, UPDATE_DTO);
  }

  remove(@Param(ParamMagics.id) id: string) {
    return this.blogService.remove(id);
  }
}
