import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8, {
    message: 'Password lengtn must be at least 8 characters',
  })
  password: string;
}
