import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!!req.user) {
    return !!data ? req.user[data] : req.user;
  }

  const token = req.header('Authorization')
    ? req.header('Authorization')
    : null;
  if (token) {
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return !!data ? decoded[data] : decoded;
  }
});
