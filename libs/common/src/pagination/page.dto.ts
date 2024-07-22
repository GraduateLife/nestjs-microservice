import { RestfulDto } from '@app/restful/decorators/RestfulDto.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

// @RestfulDto({ toBeLocate: 'query' })
export class PageDto {
  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsInt()
  @ApiProperty()
  // @IsOptional()
  idx: number = 1;

  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsInt()
  @ApiProperty()
  siz: number = 10;
}

export const extractPageParameters = (pageDto: PageDto) => {
  return {
    currentPage: pageDto.idx,
    pageSize: pageDto.siz,
  };
};
