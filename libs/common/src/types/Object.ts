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

export const ObjectPickProperties = (
  obj: Record<string, any>,
  keys: string[],
): Record<string, any> => {
  const res = {};
  for (const key of keys) {
    if (!obj[key])
      throw new Error(`property ${key} does not exist on original object`);
    res[key] = obj[key];
  }
  return res;
};

export const ObjectPropertyAddPrefix = (
  obj: Record<string, any>,
  prefix: string,
): Record<string, any> => {
  const res = {};
  for (const key of Object.keys(obj)) {
    res[prefix + key] = obj[key];
  }
  return res;
};

export const ObjectPropertyUnset = (
  obj: Record<string, any>,
  keys: string[],
): Record<string, any> => {
  for (const key of keys) {
    if (obj[key]) delete obj[key];
  }
  return { ...obj };
};
