import { StackPropertyDecorators } from '@app/common/decorators/StackPropertyDecorators';

import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

const referAffinityFromTypeHintName = (TypeHintName: string) => {
  const supposeToBeType = TypeHintName.split(/(?=[A-Z])/).at(-1);
  switch (supposeToBeType) {
    case 'String':
      return String;
    case 'Boolean':
      return Boolean;
    case 'Number':
      return Number;

    default:
      throw 'unknown type hint name: ' + TypeHintName;
  }
};

type TransformFunction = (params: TransformFnParams) => any;
type ValidatorDecorator = (...args: any[]) => PropertyDecorator | void;
type ValidatorSettings = {
  typeHint: (...args: any[]) => PropertyDecorator;
  extraValidators?: ValidatorDecorator[];
  affinity?: boolean | TransformFunction;
};
export const V =
  (
    validatorSettings: ValidatorSettings,
    options: Pick<ApiPropertyOptions, 'example' | 'description'> = {},
  ) =>
  (TGT: object, Key: string) => {
    const {
      typeHint,
      extraValidators = [],
      affinity = false,
    } = validatorSettings;

    if (typeHint.name === 'typeHint') {
      throw new Error(
        `Sorry, this validator decorator is not simple enough to hint the type in dto class: ${TGT.constructor.name} of property: ${Key}`,
      );
    }

    const supposeToBeType = typeHint.name.split(/(?=[A-Z])/).at(-1);

    let TransformPrepare = null;
    if (typeof affinity === 'function') {
      Transform(affinity);
    }
    if (typeof affinity === 'boolean' && affinity === true) {
      TransformPrepare = Transform(({ value }) =>
        referAffinityFromTypeHintName(typeHint.name)(value),
      );
    }

    const toAddApiOptions: ApiPropertyOptions = {
      ...options,
      type: supposeToBeType,
    };
    const toStack = [
      typeHint(),
      ...extraValidators,
      ApiProperty({ ...toAddApiOptions }),
    ];
    // ] as PropertyDecorator[];
    StackPropertyDecorators([...toStack])(TGT, Key);
    if (TransformPrepare) {
      TransformPrepare(TGT, Key);
    }
  };
