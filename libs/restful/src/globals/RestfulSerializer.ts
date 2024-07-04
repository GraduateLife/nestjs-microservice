import { Page } from '@app/common/pagination/types';
import { DataType } from '@app/common/types';
import {
  ClassSerializerInterceptor,
  Type,
  PlainLiteralObject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';

export class RestfulSerializer extends ClassSerializerInterceptor {
  constructor(private outputClass: Type<any>) {
    super(new Reflector());
  }
  serialize(
    response: any,
    options: ClassTransformOptions,
  ): PlainLiteralObject | PlainLiteralObject[] {
    if (options.groups) {
      const res = plainToInstance(this.outputClass, response, {
        excludeExtraneousValues: true,
        ...options,
      });

      return res;
    }

    const res = super.transformToPlain(this.prepare(response), options);

    return res;
    // return instanceToPlain(response, { strategy: 'excludeAll', ...options });
  }
  private prepare(response: any) {
    if (DataType(response) === '$$OBJECT') {
      const r: object = response;
      if (isMongoDbResObject(r)) {
        return MongodbResStringify(r);
      }
    }
    if (DataType(response) === '$$PAGE') {
      const r: Page = response;
      const stringified = r.page_data.map((pageItem) =>
        MongodbResStringify(pageItem),
      );

      const togo: Page = {
        page_data: stringified,
        page_meta: r.page_meta,
      };
      return togo;
    }
  }
}

const isMongoDbResObject = (response: PlainLiteralObject) => {
  return response._id && response._id instanceof mongoose.Types.ObjectId;
};
const MongodbResStringify = (response: PlainLiteralObject) => {
  if (response._doc) {
    response = response._doc;
  }
  return {
    ...response,
    _id: response._id.toString(),
  };
};
