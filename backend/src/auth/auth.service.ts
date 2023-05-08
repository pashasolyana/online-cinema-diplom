import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { hash, genSalt, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.createTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({ email: dto.email });
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }
    const salt = await genSalt(10);
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });
    const tokens = await this.createTokenPair(String(newUser._id));
    await newUser.save();
    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  async createTokenPair(userId: string) {
    const data = { _id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });
    return { accessToken, refreshToken };
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  async getNewToken({ refreshToken }: RefreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException('Please sign in');
    }
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.UserModel.findById(result._id);
    const tokens = await this.createTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }
}
