import { ArgumentsHost, ExecutionContext } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

/**
 * STUB potentially fragile code
 * because functions to get or set specified headers are not defined here
 * factory function maybe used in future
 */

export type ExpressRequest = Request;
export type ExpressResponse = Response;
export type ExpressNext = NextFunction;

export enum XHeaders {
  X_REQUEST_AT = 'X-Request-At',
  X_RESPONSE_AT = 'X-Response-At',
}

class ExpressHttpHelper {
  static setReqHeader(
    req: ExpressRequest,
    headerName: string,
    content: string,
  ): ExpressRequest {
    req.headers[headerName] = content;
    return req;
  }
  static getReqHeader(req: ExpressRequest, headerName: string): string {
    const toGet = req.headers[headerName];
    if (!toGet) throw new Error('Not exist header');
    return toGet as string;
  }

  static setResHeader(
    res: ExpressResponse,
    headerName: string,
    content: string,
  ): ExpressResponse {
    res.setHeader(headerName, content);
    return res;
  }
  static getResHeader(res: ExpressResponse, headerName: string): string {
    const toGet = res.get(headerName);
    if (!toGet) throw new Error('Not exist header');
    return toGet;
  }

  //   static getReqFromHost(ctx: ArgumentsHost): Request {
  //     return ctx.switchToHttp().getRequest();
  //   }
  //   static getResFromHost(ctx: ArgumentsHost): Response {
  //     return ctx.switchToHttp().getResponse();
  //   }

  static getReqFromCxt(ctx: ExecutionContext | ArgumentsHost): Request {
    return ctx.switchToHttp().getRequest();
  }
  static getResFromCxt(ctx: ExecutionContext | ArgumentsHost): Response {
    return ctx.switchToHttp().getResponse();
  }
}

export class XRequest extends ExpressHttpHelper {}
