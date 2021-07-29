import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { UserLogin, UserRegister } from './dto';
import { User } from './user.model';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly mailerService: MailService,
  ) {}
  async register(body: UserRegister) {
    if (!this.validateEmail(body.email)) {
      throw new NotAcceptableException('email is not valid');
    }
    const isExist = await this.userModel
      .findOne({ username: body.username })
      .lean();
    if (isExist)
      throw new NotAcceptableException(
        'Username already exists. Please try register another username',
      );
    const activationToken = this.generateActivationToken(body);
    const url = `http://localhost:5000/api/v1/users/activate/${activationToken}`;

    this.mailerService.sendConfirmMail(body.email, body.name, url);
    return 'Account created successfully! please check to activate your account';
  }
  async activateAccount(token: string) {
    let user;
    try {
      user = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
    } catch (error) {
      throw new NotAcceptableException('Invalid activate token provided');
    }
    const { name, email, password, username } = user;

    const check = await this.userModel.findOne({ username });
    if (check) throw new NotAcceptableException('Username already exists!');

    const newUser = new this.userModel({ name, email, password, username });

    await newUser.save();
    return { message: 'Account has been activated' };
  }
  async login(res: Response, body: UserLogin) {
    try {
      const { username, password } = body;
      const user = await this.userModel.findOne({ username });
      if (!user) throw new NotFoundException('This username does not exist.');

      const isMatch = await user.comparePassword(password);

      if (!isMatch) throw new NotAcceptableException('Password is incorrect.');

      const refresh_token = this.generateRefreshToken({
        id: user._id,
        role: user.roles,
      });

      this.setCookie(res, refresh_token);
      return { message: 'Login successfully.' };
    } catch (error) {
      throw error;
    }
  }
  getAccessToken(token: string) {
    try {
      if (!token)
        throw new UnauthorizedException("Haven't token.Please login now!");
      let access_token;
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          throw new UnauthorizedException('Token invalid.Please login now!');

        access_token = this.generateAccessToken({
          id: user.id,
          role: user.roles,
        });
      });
      return { access_token };
    } catch (error) {
      throw error;
    }
  }
  async getInfoUser(id: number) {
    const user = await this.userModel.findById(id).select('-password').lean();
    if (!user) throw new NotFoundException('User not found by id.');
    return user;
  }
  private setCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      path: '/api/v1/users/token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  private validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  generateActivationToken(payload: any) {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
      expiresIn: '5m',
    });
  }
  generateAccessToken(payload: any) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  }
  generateRefreshToken(payload: any) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }
}
