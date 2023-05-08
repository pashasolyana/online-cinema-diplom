import { Injectable, NotFoundException } from '@nestjs/common';
import { GenreModel } from './genre.model';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/createGenre.dto';
import { InjectModel } from 'nestjs-typegoose';
import { MovieService } from '../movie/movie.service';
import { ICollection } from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    private readonly movieService: MovieService,
  ) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) {
      const options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
      return this.GenreModel.find(options).sort({ createdAt: 1 }).exec();
    }
    return this.GenreModel.find().sort({ createdAt: 1 }).exec();
  }

  async bySlug(slug: string) {
    const doc = await this.GenreModel.findOne({ slug }).exec();
    if (!doc) {
      throw new NotFoundException('Genre not find');
    }
    return doc;
  }

  async getCollections() {
    const genres = await this.getAll();
    const collections = await Promise.all(
      genres.map(async (genre) => {
        const movieByGenre = await this.movieService.byGenres([genre._id]);
        const result: ICollection = {
          _id: String(genre._id),
          image: movieByGenre[0].bigPoster,
          slug: genre.slug,
          title: genre.name,
        };

        return result;
      }),
    );
    return collections;
  }

  /* Admin place */
  async update(_id: string, dto: CreateGenreDto) {
    const updatedGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
    if (!updatedGenre) {
      throw new NotFoundException('Genre not found');
    }

    return updatedGenre;
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };

    const genre = await this.GenreModel.create(defaultValue);
    return genre._id;
  }

  async getPopular(): Promise<DocumentType<GenreModel>[]> {
    return this.GenreModel.find()
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async delete(_id: string) {
    const deletedGenre = this.GenreModel.deleteOne({ _id: _id }).exec();
    if (!deletedGenre) {
      throw new NotFoundException('Genre not found');
    }
    return deletedGenre;
  }

  async byId(_id) {
    const genre = await this.GenreModel.findById(_id);
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return genre;
  }
}
