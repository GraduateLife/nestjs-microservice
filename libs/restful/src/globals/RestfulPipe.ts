import { Exception, ValidationFailedException } from '@app/common/exceptions';
import {
  ValidationPipe,
  PipeTransform,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// import { ListDto } from '@app/common/dto/list.dto';

import {
  getRestfulDtoMetadata,
  isRestfulDto,
  isSupposedToBeRestfulDto,
  isValidRestfulDto,
} from '../decorators/RestfulDto.decorator';

import { referRequestArgument } from '@app/common/globals/pipe';

import { isPrimitiveBoxType } from '@app/common/types/Object';

// in pipe { metatype: [Function: Object], type: 'param', data: '$ID' }

// console.log(mongoose.isValidObjectId('6674373938803ad23e28b84d'));

//FIXME Function useDtoClass is confusing because it actually didn't do anything
/**
 * why not just let user to enter where they want the dtos to be located?
 * {
 * param:[]<=fallback String
 * body:[] <=fallback Object(may be throw is better)
 * query:[] <=fallback Object(may be throw is better)
 * }
 * since pipe has no idea with request method,
 */

// const DefaultProvideDtos: Restful<Type<any>> = {
//   findAll: ListDto,
//   findOne: String,
//   create: CreateBlogDto,
//   update: String,
//   remove: String,
// };

// const useDtoClass = (
//   argumentMetadata: ArgumentMetadata,
//   provideDtos: Restful<Type<any>>,
// ) => {
//   const { dtoLocation, dtoCapturedAsKey } =
//     referRequestArgument(argumentMetadata);
//   if (dtoLocation === 'query') {
//     return PageDto;
//   }

//   // if (dtoCapturedAsKey === 'FIND_ID' && dtoLocation === 'param') {
//   //   return provideDtos.findOne;
//   // }
//   // if (dtoCapturedAsKey === 'DELETE_ID' && dtoLocation === 'param') {
//   //   return provideDtos.remove;
//   // }
//   if (dtoLocation === 'param') {
//     return String;
//   }
//   // if (dtoLocation === 'body') {
//   //   return provideDtos.create;
//   // }

//   // return Object;

//   function* GET_ONE() {
//     yield UpdateBlogDto;
//     yield String;
//     return;
//   }
//   const xx = GET_ONE();
//   return xx.next().value;

//   throw 2;

//   return BlogDto;
// };

export class RestfulValidationPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  constructor(private callOriginalPipe: boolean) {
    super({
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      validationError: { target: false },
      // transformOptions: {
      //   exposeDefaultValues: true,
      // },
    });
  }

  async transform(value: any, argumentMetadata: ArgumentMetadata) {
    const { dtoLocation, dtoClass, dtoCapturedAsKey } =
      referRequestArgument(argumentMetadata);
    console.log('in pipe', argumentMetadata);
    console.log('to validate value', value);
    if (this.callOriginalPipe) {
      //call super.transform to forbidUnknownValues and forbidNonWhitelisted, enable original validation workflow via this
      try {
        await super.transform(value, argumentMetadata);
      } catch (error) {
        //this part is wired because we are actually catch a error which is loaded in filter for just making message nicer, you know
        throw new Exception(error.response.message.join('; '));
      }
    }

    if (!dtoClass || isPrimitiveBoxType(dtoClass)) {
      console.log('it is not a class');

      return value;
    }

    //TODO check restful dto

    if (!isSupposedToBeRestfulDto(dtoClass)) {
      // instanced = plainToInstance(dtoClass, value);
      console.log('is normal dto');
      return plainToInstance(dtoClass, value);
    }
    if (!isValidRestfulDto(dtoClass)) {
      throw new Error('bad dto of Class: ' + dtoClass);
    }

    const { toBeValidatedInGroups } = getRestfulDtoMetadata(dtoClass);
    console.log('is good dto');

    const instanced = plainToInstance(dtoClass, value, {
      groups: [...toBeValidatedInGroups],
    });

    console.log('instanced', instanced);

    console.log('waiting to validate', dtoClass?.toString());

    const errors = await validate(instanced);
    if (errors.length > 0) {
      console.log('validation failed');
      console.log('validation result', instanced);

      throw new ValidationFailedException(errors);
    }
    console.log('final output', instanced);
    return instanced;
  }
}
