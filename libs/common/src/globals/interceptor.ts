import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { CommonResponseTimeoutException } from '../exceptions';
import { DataType } from '../types';
import { XRequest, XHeaders } from '../xrequest';

//FIXME go to config
const timeoutMs = 4000;

@Injectable()
export class CommonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = XRequest.getReqFromCxt(context);
    const res = XRequest.getResFromCxt(context);

    const _now = Number(XRequest.getReqHeader(req, XHeaders.X_REQUEST_AT));
    const now = Date.now();
    XRequest.setResHeader(res, XHeaders.X_RESPONSE_AT, now.toString());
    return next.handle().pipe(
      map((value) => {
        return {
          status: 'resolved',
          data_type: DataType(value),
          data: value,
          req_at: _now,
          res_at: now,
          res_takes: `${now - _now}ms`,
        };
      }),
      timeout(timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new CommonResponseTimeoutException(timeoutMs),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}

// new ObjectId('66865013f013d8bcca4270c7');
// const id = new mongoose.Types.ObjectId('66865013f013d8bcca4270c7');
// console.log(id instanceof mongoose.Types.ObjectId);
// console.log(id.toString());
