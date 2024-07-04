import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class Exception extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST);
  }
}

export class CommonResponseTimeoutException extends HttpException {
  constructor(timeoutMs: number) {
    super(
      `Cannot respond to this request because timeout has been reached: ${timeoutMs}ms`,
      HttpStatus.REQUEST_TIMEOUT,
    );
  }
}

export class ValidationFailedException extends HttpException {
  constructor(es: ValidationError[]) {
    let text = '';
    es.map((item) => {
      return {
        messages: Object.values(item.constraints).join(', '),
        property: item.property,
        value: item.value,
      };
    }).forEach((item, idx) => {
      text += `Unexpected situation: ${item.property}=${item.value}, validation failed due to following reasons: ${item.messages}`;
      if (idx < es.length - 1) {
        text += `; `;
      }
    });
    super(text, HttpStatus.BAD_REQUEST);
  }
}
