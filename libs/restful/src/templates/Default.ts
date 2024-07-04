import { Delete, Get, Patch, Post, SerializeOptions } from '@nestjs/common';

export const DefaultRestfulStyle = {
  findAll: [Get()],
  findOne: [Get(':id')],
  create: [Post(), SerializeOptions({ groups: ['create'] })],
  update: [Patch(':id'), SerializeOptions({ groups: ['update'] })],
  remove: [Delete(':id')],
  // restore: [Patch('/restore')],
};

export enum DefaultParamMagics {
  id = 'id',
}

export const DefaultValidationGroup = ['create', 'update'];
