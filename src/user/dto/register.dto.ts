import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UserRegister {
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/123/, { message: 'password too weak' })
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;
}
