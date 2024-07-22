import { IMethodDecoratorFactory } from '.';
import { PageDto } from '../pagination/page.dto';

export const MixinParameters: IMethodDecoratorFactory =
  (newParameters: any[], composition?: 'shift' | 'push') =>
  (TGT, Key, descriptor) => {
    const original = descriptor.value;
    descriptor.value = function (...args: any) {
      const result = original.apply(this, [...args, ...newParameters]);
      return result;
    };
  };

const l: PageDto = {
  idx: 10,
  siz: 100,
};

class A {
  @MixinParameters([l, { a: 12, b: 45 }])
  greet(...args: any) {
    return args;
  }
}

console.log(new A().greet());
