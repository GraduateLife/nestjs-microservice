import { Type } from '@nestjs/common';
import 'reflect-metadata';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParameterNames(func) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}

const PARAMETER_NAMES_METADATA_TOKEN =
  'parameter_names_metadata_token' as const;

export class XReflect {
  // static getPropertyMetadata() {
  //   return Reflect.getMetadata();
  // }

  static setMethodMetadata = (
    target: Type<any>,
    methodName: string,
    metadataKey: string,
    toSet: any,
  ) => {
    if (!target.prototype[methodName]) {
      throw new Error(
        `There is no method called: ${methodName} in class ${target.name}`,
      );
    }
    Reflect.defineMetadata(metadataKey, toSet, target.prototype, methodName);
  };
  static getMethodMetadata = (
    target: Type<any>,
    methodName: string,
    metadataKey: string,
    allowUndefined: boolean = false,
  ) => {
    if (!target.prototype[methodName]) {
      throw new Error(
        `There is no method called: ${methodName} in class ${target.name}`,
      );
    }
    const res = Reflect.getMetadata(metadataKey, target.prototype, methodName);
    if (res === undefined && !allowUndefined) {
      throw new Error(
        `The method '${methodName}' in class ${target.name} does not contain any metadata associates with metadata key: ${metadataKey}`,
      );
    }
    return res;
  };
  private static injectParameterNamesAsMetadata = (
    target: Type<any>,
    methodName: string,
  ) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      methodName,
    );
    const original = descriptor.value;
    // const names = getFunctionParameterNames(original);

    const names = getParameterNames(original);
    XReflect.setMethodMetadata(
      target,
      methodName,
      PARAMETER_NAMES_METADATA_TOKEN,
      names,
    );
  };
  static getParameterNames(target: Type<any>, methodName: string) {
    const result = Reflect.hasMetadata(
      PARAMETER_NAMES_METADATA_TOKEN,
      target,
      methodName,
    );
    if (!result) {
      XReflect.injectParameterNamesAsMetadata(target, methodName);
    }
    return XReflect.getMethodMetadata(
      target,
      methodName,
      PARAMETER_NAMES_METADATA_TOKEN,
    );
  }

  static getHattedMetadata(target: Type<any>, metadataKey?: string): any {
    if (!metadataKey) {
      return Reflect.getMetadataKeys(target);
    }
    return Reflect.getMetadata(metadataKey, target);
  }

  static traverseClassMetadata(target: Type<any>) {
    const res = {
      CLASS: [],
    };
    const c = Reflect.getMetadataKeys(target);
    res.CLASS.push(...c);

    for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
      if (methodName === 'constructor') continue;
      const x = Reflect.getMetadataKeys(target.prototype, methodName);
      if (x) {
        if (!res[methodName]) {
          res[methodName] = [];
        }
        res[methodName].push(...x);
      }
    }
    return res;
  }
}
