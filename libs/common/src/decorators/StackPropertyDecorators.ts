export const StackPropertyDecorators = (workSheet: PropertyDecorator[]) => {
  return (TGT: object, key: string | symbol) => {
    workSheet.forEach((d) => {
      return d(TGT, key);
    });
  };
};
