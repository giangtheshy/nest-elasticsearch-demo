import { IsNotEmpty } from 'class-validator';
export class UserLogin {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
