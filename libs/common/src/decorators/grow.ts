// export type Growable = Record<string, MethodDecorator[]>;

import { isNil } from '../types/Object';

export type MethodDecoratorAdder = {
  keys: string[] | '<every>';
  decorators: MethodDecorator[];
};

const propertyGrow_Core = (
  toAdd: MethodDecoratorAdder,
  baseOn: Record<string, MethodDecorator[]>,
  strict: boolean | null,
) => {
  const _base = { ...baseOn };
  const resolved: Record<string, any> = {};
  if (toAdd.keys === '<every>') {
    toAdd.keys = Object.keys(_base);
  }
  for (const k of toAdd.keys) {
    if (!resolved[k]) {
      resolved[k] = [];
    }
    if (!_base[k]) {
      if (strict) {
        throw new Error('unknown property to grow ' + k);
      }
      if (isNil(strict)) {
        continue;
      } else {
        _base[k] = [];
      }
    }
    resolved[k].push(...toAdd.decorators);
  }

  for (const k in _base) {
    if (resolved[k] && _base[k]) _base[k].push(...resolved[k]);
  }
  return _base;
};

export const propertyGrow = (
  toAdd: MethodDecoratorAdder[] | MethodDecoratorAdder,
  baseOn: Record<string, MethodDecorator[]>,
  strict: boolean | null = null,
) => {
  if (!Array.isArray(toAdd)) {
    return propertyGrow_Core(toAdd, baseOn, strict);
  }
  let res: Record<string, any> = {};
  for (const task of toAdd) {
    const tasked = propertyGrow_Core(task, baseOn, strict);
    res = {
      ...res,
      ...tasked,
    };
  }
  return res;
};
