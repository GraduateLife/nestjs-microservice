import { RestfulDto } from '@app/restful/decorators/RestfulDto.decorator';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

// @RestfulDto({ toBeLocate: 'query' })
export class PageDto {
  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsNumber()
  // @IsOptional()
  idx: number = 1;

  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsNumber()
  @IsOptional()
  siz: number = 10;
}

export const extractPageParameters = (pageDto: PageDto) => {
  return {
    currentPage: pageDto.idx,
    pageSize: pageDto.siz,
  };
};
