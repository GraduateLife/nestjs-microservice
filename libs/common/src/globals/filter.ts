import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { XRequest, XHeaders } from '../xrequest';

@Catch(HttpException)
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const request = XRequest.getReqFromCxt(host);
    const response = XRequest.getResFromCxt(host);
    const status = exception.getStatus();

    const _now = Number(XRequest.getReqHeader(request, XHeaders.X_REQUEST_AT));
    const now = Date.now();
    response.status(status).json({
      status: 'rejected',
      code: status,
      message: exception.message,
      path_at: request.url,
      req_at: _now,
      res_at: now,
      res_takes: `${now - _now}ms`,
    });
  }
}
