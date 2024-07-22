declare type Scroll<T> = { [key in keyof T]: T[key] };

declare type TupleToUnion<T extends any[]> = T[number];
