import { Exception, ValidationFailedException } from '@app/common/exceptions';
import {
  ValidationPipe,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// import { ListDto } from '@app/common/dto/list.dto';

import {
  getRestfulDtoMetadata,
  isSupposedToBeRestfulDto,
  isValidRestfulDto,
} from '../decorators/RestfulDto.decorator';

import { referRequestArgument } from '@app/common/globals/pipe';

import { isPrimitiveBoxType } from '@app/common/types/Object';

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

    if (!dtoClass || isPrimitiveBoxType(dtoClass)) {
      console.log('it is not a class');

      return value;
    }

    if (!isSupposedToBeRestfulDto(dtoClass)) {
      // instanced = plainToInstance(dtoClass, value);
      console.log('is normal dto');

      const instanced = plainToInstance(dtoClass, value);
      const errors = await validate(instanced);
      if (errors.length > 0) {
        console.log('validation failed');
        console.log('validation result', instanced);

        throw new ValidationFailedException(errors);
      }
      await this.callOriginal(instanced, argumentMetadata);
      return instanced;
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
    await this.callOriginal(instanced, argumentMetadata);
    console.log('final output', instanced);
    return instanced;
  }

  private async callOriginal(value: any, argumentMetadata: ArgumentMetadata) {
    if (this.callOriginalPipe) {
      //call super.transform to forbidUnknownValues and forbidNonWhitelisted, enable original validation workflow via this
      try {
        await super.transform(value, argumentMetadata);
      } catch (error) {
        //this part is wired because we are actually catch a error which is loaded in filter for just making message nicer, you know

        throw new Exception(error.response.message.join('; '));
      }
    }
  }
}
