import { Page } from '@app/common/pagination/types';
import { DataType } from '@app/common/types';
import {
  ClassSerializerInterceptor,
  Type,
  PlainLiteralObject,
  ClassSerializerContextOptions,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export class RestfulSerializer extends ClassSerializerInterceptor {
  constructor(private outputClass: Type<any>) {
    super(new Reflector());
  }
  serialize(
    response: any,
    options: ClassTransformOptions,
  ): PlainLiteralObject | PlainLiteralObject[] {
    console.log('going to RestfulSerializer');
    if (options.groups) {
      console.log('in restful part, resp is ', response);
      console.log('options is', options);
      const res = plainToInstance(this.outputClass, response, {
        excludeExtraneousValues: true,
        ...options,
      });

      if (DataType(response) === '$$PAGE') {
        const mapped = response.page_data.map((item) =>
          plainToInstance(this.outputClass, item, {
            excludeExtraneousValues: true,
            ...options,
          }),
        );
        return {
          page_data: mapped,
          page_meta: response.page_meta,
        };
      }

      // if (response._id) {
      //   console.log(response._id);
      //   res._id = response._id.toString();
      // }
      console.log('output', res);

      return res;
    }
    console.log('no group');
    console.log(response);
    const res = super.transformToPlain(response, options);

    return res;
    // return instanceToPlain(response, { strategy: 'excludeAll', ...options });
  }
}
