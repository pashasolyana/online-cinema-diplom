import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
  ) {}

  async byId(_id) {
    const user = await this.UserModel.findById(_id, { password: 0 });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id);
    const isSameUser = await this.UserModel.findOne({ email: dto.email });

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new BadRequestException('Email already exists');
    }

    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }

    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin == false) {
      user.isAdmin = dto.isAdmin;
    }
    await user.save();
    return;
  }

  async getCount() {
    return this.UserModel.find().count().exec();
  }

  async deleteUser(_id: string) {
    return this.UserModel.deleteOne({ _id: _id }).exec();
  }

  async getAll(searchTerm?: string) {
    if (searchTerm) {
      const options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      };
      return this.UserModel.find(options)
        .select('-password -updatedAt -__v')
        .sort({ createdAt: 1 })
        .exec();
    }
    return this.UserModel.find()
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 1 })
      .exec();
  }

  async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
    const { _id, favorites } = user;
    return await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
        ? favorites.filter((id) => String(id) !== String(movieId))
        : [...favorites, movieId],
    }).exec();
  }

  async getFavoritesMovies(_id: Types.ObjectId) {
    return this.UserModel.findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: { path: 'genres' },
      })
      .exec()
      .then((data) => data.favorites);
  }
}
