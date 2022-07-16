import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationPipe } from '@shared/pipes/validation.pipe';
import { UserLogin, UserRegister } from './dto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() userRegister: UserRegister) {
    return await this.userService.register(userRegister);
  }

  @Get('activate/:token')
  activateAccount(@Param('token') token: string) {
    return this.userService.activateAccount(token);
  }
  @Get('token')
  getAccessToken(@Req() req: Request) {
    const token = req.cookies.refresh_token;
    return this.userService.getAccessToken(token);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Res() res: Response, @Body() userLogin: UserLogin) {
    const result = await this.userService.login(res, userLogin);
    res.status(200).json(result);
  }
  @Get('info')
  getInfoUser(@User('id') uid: number) {
    return this.userService.getInfoUser(uid);
  }
  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('refresh_token', { path: '/api/v1/users/token' });
    res.status(200).json({ message: 'Logged out!' });
  }
}
