import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { UpdateMovieDto } from './update.movie.dto';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
  ) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) {
      const options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
      return this.MovieModel.find(options)
        .select(' -updatedAt -__v')
        .sort({ createdAt: 1 })
        .populate('actors genres')
        .exec();
    }
    return this.MovieModel.find()
      .select(' -updatedAt -__v')
      .sort({ createdAt: 1 })
      .populate('actors genres')
      .exec();
  }

  async byId(_id: string) {
    const doc = await this.MovieModel.findById(_id);
    if (!doc) {
      throw new NotFoundException('Movie not found');
    }
    return doc;
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };
    const actor = await this.MovieModel.create(defaultValue);
    return actor._id;
  }

  async update(_id: string, dto: UpdateMovieDto) {
    const updatedMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
    if (!updatedMovie) {
      throw new NotFoundException('Genre not found');
    }

    return updatedMovie;
  }

  async updateCountOpened(slug: string) {
    const updatedMovie = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      {
        new: true,
      },
    ).exec();
    if (!updatedMovie) {
      throw new NotFoundException('Genre not found');
    }

    return updatedMovie;
  }

  async delete(_id: string) {
    const deletedGenre = this.MovieModel.deleteOne({ _id: _id }).exec();
    if (!deletedGenre) {
      throw new NotFoundException('Actor not found');
    }
    return deletedGenre;
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec();
    if (!doc) {
      throw new NotFoundException('Movie not find');
    }
    return doc;
  }

  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.find({ actors: actorId }).exec();
    if (!doc) {
      throw new NotFoundException('Movie not find');
    }
    return doc;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const doc = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec();
    if (!doc) {
      throw new NotFoundException('Movie not find');
    }
    return doc;
  }

  async getMostPopular() {
    const doc = await this.MovieModel.find({
      countOpened: { $gt: 0 },
    })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec();
    if (!doc) {
      throw new NotFoundException('Movie not find');
    }
    return doc;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(
      id,
      {
        rating: newRating,
      },
      {
        new: true,
      },
    );
  }
}
