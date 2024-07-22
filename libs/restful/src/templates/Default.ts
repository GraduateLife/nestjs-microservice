import { Delete, Get, Patch, Post, SerializeOptions } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export type IDefaultTemplate = Record<keyof typeof DefaultRestfulStyle, any>;

export const DefaultRestfulStyle = {
  findMany: [
    Get(),
    SerializeOptions({ groups: ['findMany'] }),
    ApiOperation({
      summary: `This method can be used to find all records of this endpoint`,
    }),
    ApiOkResponse({
      description: 'returns all records in array',
    }),
    ApiNotFoundResponse({
      description: 'throws when cannot find any records in this endpoint',
    }),
  ],
  findOne: [
    Get(':id'),
    SerializeOptions({ groups: ['findOne'] }),
    ApiOperation({
      summary: `This method can be used to find a record of corresponding id in this endpoint`,
    }),
    ApiOkResponse({
      description:
        'The method returns the record of corresponding id of this endpoint',
    }),
    ApiNotFoundResponse({
      description:
        'throws when cannot find the record of corresponding id in this endpoint',
    }),
    ApiBadRequestResponse({ description: 'throws when id is not valid' }),
  ],
  createOne: [
    Post(),
    SerializeOptions({ groups: ['createOne'] }),
    ApiOperation({
      summary: `This method can be used to create a new record in this endpoint`,
    }),
    ApiCreatedResponse({
      description: 'returns the record created in this endpoint',
    }),
    ApiNotFoundResponse({
      description:
        'throws when cannot find the record of corresponding id in this endpoint',
    }),
    ApiBadRequestResponse({
      description: 'throws when field in post body is not valid',
    }),
  ],
  updateOne: [
    Patch(':id'),
    SerializeOptions({ groups: ['updateOne'] }),
    ApiOperation({
      summary: `This method can be used to update a record of corresponding id in this endpoint`,
    }),
    ApiOkResponse({
      description: 'returns the record updated in this endpoint',
    }),
    ApiNotFoundResponse({
      description:
        'throws when cannot find the record of corresponding id in this endpoint',
    }),
    ApiBadRequestResponse({
      description: 'throws when field in post body is not valid',
    }),
  ],
  deleteOne: [
    Delete(':id'),
    SerializeOptions({ groups: ['deleteOne'] }),
    ApiOperation({
      summary: `This method can be used to delete a record of corresponding id in this endpoint`,
    }),
    ApiResponse({
      status: 204,
      description: 'returns the record deleted in this endpoint',
    }),
    ApiNotFoundResponse({
      description:
        'throws when cannot find the record of corresponding id in this endpoint',
    }),
    ApiBadRequestResponse({
      description: 'throws when field in post body is not valid',
    }),
  ],
  // restore: [Patch('/restore')],
};

export enum DefaultParamMagics {
  id = 'id',
}

export const Methods = Object.keys(DefaultRestfulStyle);
