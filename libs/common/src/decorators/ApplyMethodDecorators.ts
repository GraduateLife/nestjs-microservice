import { Type } from '@nestjs/common';

import { ClassDecoratorFactory } from '.';
import { isNil } from '../types/Object';

export const ApplyMethodDecorators: ClassDecoratorFactory<
  Record<string, MethodDecorator[]>
> = (decorators) => (TGT) => {
  for (const [k, v] of Object.entries(decorators)) {
    if (isNil(v)) continue;
    const desc = findAndBindMethodDescriptor(TGT, k);

    v.forEach((d) => d(TGT.prototype, k, desc));
  }

  return TGT;
};
/**
 * @description this function binds this pointer to current class instead of its parents
 */
const findAndBindMethodDescriptor = (
  TGT: Type<any>,
  MethodName: string,
): PropertyDescriptor => {
  let desc = Object.getOwnPropertyDescriptor(TGT.prototype, MethodName);

  while (!desc) {
    const ancestor = Object.getPrototypeOf(TGT.prototype).constructor;
    const ancestorDesc = Object.getOwnPropertyDescriptor(
      ancestor.prototype,
      MethodName,
    );

    Object.defineProperty(TGT.prototype, MethodName, {
      ...ancestorDesc,
      value(...yargs: any[]) {
        return ancestorDesc.value.apply(this, yargs);
      },
    });
    desc = Object.getOwnPropertyDescriptor(TGT.prototype, MethodName);
  }
  return desc;
};
