import { Type } from '@nestjs/common';

type D = {
  betweenRows: string;
  betweenKvs: string;
};

export const isNil = (val: any): val is undefined | null => {
  if (val === undefined || val === null) return true;
  return false;
};

export const isPrimitiveBoxType = (metatype: any): boolean => {
  const types: Type<any>[] = [String, Boolean, Number, Array, Object];
  return types.includes(metatype);
};

export const ObjectStringify = (obj: object, delimiters?: Partial<D>) => {
  const { betweenKvs = '=', betweenRows = ', ' } = delimiters ?? {};

  return Object.entries(obj)
    .map(([k, v]) => `${k}${betweenKvs}${v}`)
    .join(betweenRows);
};
