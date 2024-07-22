import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  IsNotEmpty,
  isString,
  IsString,
} from 'class-validator';
import { StackPropertyDecorators } from '../decorators/StackPropertyDecorators';

export function IsMatchPhone(
  locales?: MobilePhoneLocale | MobilePhoneLocale[],
  options?: IsMobilePhoneOptions,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [locales || 'any', options],
      validator: {
        validate: (value: any, args: ValidationArguments): boolean =>
          isMatchPhone(value, args.constraints[0], args.constraints[1]),
        defaultMessage: (_args: ValidationArguments) =>
          '$property must be a phone number,eg: +86.12345678901',
      },
    });
  };
}

export const IsNotEmptyString = () =>
  StackPropertyDecorators([IsNotEmpty(), IsString()]);
