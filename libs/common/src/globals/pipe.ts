import {
  ArgumentMetadata,
  PipeTransform,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Exception, ValidationFailedException } from '../exceptions';
// import { ValidationError, ValidatorOptions } from 'class-validator';

// export interface ValidationPipeOptions extends ValidatorOptions {
//   transform?: boolean;
//   disableErrorMessages?: boolean;
//   exceptionFactory?: (errors: ValidationError[]) => any;
// }

// { metatype: [class ListDto], type: 'query', data: undefined }
// { metatype: [class CreateBlogDto], type: 'body', data: undefined }
// { metatype: [class ListDto], type: 'query', data: undefined }
// { metatype: [Function: String], type: 'param', data: 'id' }

/**
 * @remarks just rename original argumentMetadata properties to make more sense
 * @remarks dtoClass: metatype,
   @remarks dtoLocation: type,
   @remarks dtoCapturedAsKey: data,
 */
export const referRequestArgument = (argumentMetadata: ArgumentMetadata) => {
  const { metatype, type, data } = argumentMetadata;
  return {
    dtoClass: metatype,
    dtoLocation: type,
    dtoCapturedAsKey: data,
  };
};

export class CommonValidationPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  constructor(public callOriginalPipe: boolean = false) {
    super({
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      validationError: { target: false },
    });
  }
  async transform(value: any, argumentMetadata: ArgumentMetadata) {
    const { metatype, ...rest } = argumentMetadata;
    if (this.callOriginalPipe) {
      //call super.transform to forbidUnknownValues and forbidNonWhitelisted, enable original validation workflow via this
      try {
        await super.transform(value, { metatype, ...rest });
      } catch (error) {
        //this part is wired because we are actually catch a error which is loaded in filter for just making message nicer, you know
        throw new Exception(error.response.message.join('; '));
      }
    }
    //real type transform and validation (actually value limitations) is performed by class-validator bundle
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new ValidationFailedException(errors);
    }

    return object;
  }

  protected toValidate(metatype: any): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
