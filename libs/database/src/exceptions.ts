import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseQueryNotHitException extends HttpException {
  constructor(queryString: string) {
    if (queryString === '') {
      queryString = '$FIND_ALL';
    }
    super(
      'Cannot find entity' + ' by following query: ' + queryString,
      HttpStatus.NOT_FOUND,
    );
  }
}
