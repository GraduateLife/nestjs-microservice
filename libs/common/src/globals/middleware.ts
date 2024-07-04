import {
  ExpressNext,
  ExpressRequest,
  ExpressResponse,
  XRequest,
  XHeaders,
} from '../xrequest';

export function CommonSetRequestAtMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNext,
) {
  req = XRequest.setReqHeader(
    req,
    XHeaders.X_REQUEST_AT,
    Date.now().toString(),
  );
  next();
}
