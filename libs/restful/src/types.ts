export type IRestful = {
  findAll: any;
  findOne: any;
  create: any;
  update: any;
  remove: any;
};

export type Restful<T> = Record<keyof IRestful, T>;
