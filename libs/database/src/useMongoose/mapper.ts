import { Exception } from '@app/common/exceptions';
import { Page } from '@app/common/pagination/types';
import { DataType } from '@app/common/types';

import {
  ValidationPipe,
  PipeTransform,
  ClassSerializerInterceptor,
  PlainLiteralObject,
} from '@nestjs/common';

import mongoose from 'mongoose';

export const isObjectId = (val: string) => mongoose.isValidObjectId(val);

// const solveMongodbOutput = (val: any) => {
//   if (Object.keys(val).length > 0 && val._id) {
//     return { ...val, _id: val._id.toString() };
//   }
//   if (Array.isArray(val)) {
//     return val.map((item) => {
//       const parsed = {
//         ...item._doc,
//         _id: item._doc._id.buffer.toString('hex'),
//       };

//       return parsed;
//     });
//   }

//   throw 'no match of mongo output';
// };

export class ValidateObjectIdPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  async transform(value: any) {
    console.log('going to ValidateObjectIdPipe');

    //real type transform and validation (actually value limitations) is performed by class-validator bundle

    if (typeof value === 'string') {
      if (!isObjectId(value))
        throw new Exception(
          `value should be a valid objectId but received: ${value}`,
        );
    }

    return value;
  }
}

export class MongooseSerializer extends ClassSerializerInterceptor {
  override serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject>,
    // options: ClassSerializerContextOptions,
  ): PlainLiteralObject | Array<PlainLiteralObject> {
    console.log('going to MongodbSerializer');
    const res = this.preflight(response);
    console.log(res);
    return res;
  }

  private preflight(response: any) {
    if (DataType(response) === '$$OBJECT' && response._id) {
      console.log('this contains mongodb object');
      return {
        ...response,
        _id: response._id.toString(),
      };
    }
    if (DataType(response) === '$$PAGE' && Array.isArray(response.page_data)) {
      console.log('this contains mongodb array');
      const r: Page = response;
      // const stringified = [...solveMongodbOutput(response.page_data)];
      const stringified = response.page_data.map((item) => {
        const parsed = {
          ...item._doc,
          _id: item._doc._id.buffer.toString('hex'),
        };

        return parsed;
      });

      const togo: Page = {
        page_data: stringified,
        page_meta: r.page_meta,
      };
      return togo;
    }

    return response;
  }
}
