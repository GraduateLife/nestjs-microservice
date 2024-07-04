/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type } from '@nestjs/common';

export type IClassDecoratorFactory = (
  ...args: any
) => (TGT: Type<any>) => Type<any>;

export type ClassDecoratorFactory<T> = (
  args: T,
) => (TGT: Type<any>) => Type<any>;

export type IMethodDecoratorFactory = (
  ...args: any
) => (TGT: object, Key: string, descriptor: PropertyDescriptor) => void;

export type MethodDecoratorFactory<T> = (
  args: T,
) => (TGT: object, Key: string, descriptor: PropertyDescriptor) => void;

export type PropertyDecoratorFactory<T> = (
  args: T,
) => (TGT: Type<any>, Key: string | symbol) => void;

export type ParameterDecoratorFactory<T> = (
  args: T,
) => (TGT: Type<any>, Key: string | symbol, Index: number) => void;

/**
 * @remarks AccessorDecorator can only be used on `either getter or setter`, else will cause compile errors
 */
export type SetterDecoratorFactory<T> = MethodDecoratorFactory<T>;

const ClassLogger = (logger: (x: any) => void) => {
  return function (target: Type<any>) {
    logger(target.name);
    return target;
  };
};

const MethodLogger: MethodDecoratorFactory<(x: any) => void> =
  (logger) => (TGT, Key, descriptor) => {
    const original = descriptor.value;
    logger(`calling '${Key}' of instance of ${TGT.constructor.name}` + '\n');
    descriptor.value = function (...args: any) {
      const _args = Array.from(args) as any[];

      const x = _args.length === 0 ? '$NIL' : _args.join(',');
      logger('parameters: ' + x + '\n');
      const result = original.call(this, ...args);
      logger('returns: ' + result);
      return result;
    };
  };

const PropertyLogger = (logger: (x: any) => void) => {
  return (TGT: object, key: string) => {
    let value: any;
    const getter = function () {
      logger(
        `getting property '${key}' in instance of ${TGT.constructor.name}: ${value}`,
      );
      return value;
    };
    const setter = function (newVal: typeof value) {
      value = newVal;
    };
    Object.defineProperty(TGT, key, {
      get: getter,
      set: setter,
    });
  };
};

const SetterLogger: SetterDecoratorFactory<(x: any) => void> =
  (logger) => (target, key, descriptor) => {
    // const originalGet = descriptor.get;
    const originalSet = descriptor.set;

    //   descriptor.get = function (...rags){
    //   logger(`getting property '${key}' in instance of ${target.constructor.name} by accessor`)
    //   originalGet!.call(this);
    // };
    if (!originalSet) {
      throw new Error(
        'cannot apply setter decorator because this is not a setter method',
      );
    }
    descriptor.set = function (newVal) {
      logger(
        `setting property '${key}' in instance of ${target.constructor.name}: ${newVal} by accessor`,
      );
      originalSet.call(this, newVal);
    };
  };

// @ClassLogger(console.log)
class A {
  // @PropertyLogger(console.log)
  age = 53;

  /**
   * @remarks Decorators cannot be applied to multiple get/set accessors of the same name.ts(1207),
   * but you do can put a setter decorator to a getter
   */
  // @SetterLogger(console.log)
  get AGE() {
    return this.age;
  }

  // @SetterLogger(console.log)
  set AGE(newAge: number) {
    this.age = newAge;
  }

  // @MethodLogger(console.log)
  greet(a, b) {
    return a + b;
  }
}
