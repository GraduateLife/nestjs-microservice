import { isObject } from 'class-validator';
import { Exception } from '../exceptions';
import { isPageMetadata, isPage } from '../pagination/types';
import { isNil } from './Object';
import { isLiteral } from './Primitives';

export const DataType = (val: any) => {
  if (isNil(val)) return '$$NIL';
  if (Array.isArray(val)) {
    if (val.length === 0) return '$$EMPTY_ARRAY';
    return '$$ARRAY';
  }
  if (isObject(val)) {
    if (Object.keys(val).length === 0) return '$$EMPTY_OBJECT';
    if (isPageMetadata(val)) return '$$PAGE_METADATA';
    if (isPage(val)) return '$$PAGE';
    return '$$OBJECT';
  }

  if (isLiteral(val)) return '$$LITERAL';
  throw new Exception('unknown data type');
};
