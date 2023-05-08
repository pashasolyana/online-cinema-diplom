import { IsString } from 'class-validator';
export class RefreshToken {
  @IsString({
    message: 'Refresh token it is a string',
  })
  refreshToken: string;
}
