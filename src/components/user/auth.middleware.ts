import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization');
      if (!token)
        throw new HttpException('Token not found .', HttpStatus.FORBIDDEN);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error)
          throw new HttpException('Token invalid', HttpStatus.FORBIDDEN);

        // @ts-ignore
        req.user = user;
        next();
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
