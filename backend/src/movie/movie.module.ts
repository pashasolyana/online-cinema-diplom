import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MovieModel,
        schemaOptions: {
          collection: 'Movie',
        },
      },
    ]),
  ],
})
export class MovieModule {}
