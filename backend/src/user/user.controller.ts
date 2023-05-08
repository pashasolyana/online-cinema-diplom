import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IdValidationPipe } from 'src/auth/pipes/id.validation.pipes';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.usersService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(_id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorites(
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User() user: UserModel,
  ) {
    return this.usersService.toggleFavorite(movieId, user);
  }

  @Get('profile/favorites')
  @HttpCode(200)
  @Auth()
  async getFavorties(@User('_id') _id: Types.ObjectId) {
    return this.usersService.getFavoritesMovies(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('count')
  @Auth('admin')
  async getCount() {
    return this.usersService.getCount();
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.usersService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.byId(id);
  }
}
