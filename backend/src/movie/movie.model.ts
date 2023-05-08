import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/actor.model';
import { GenreModel } from 'src/genre/genre.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MovieModel extends Base {}

export class Parameters {
  @prop()
  year: string;

  @prop()
  duration: string;

  @prop()
  country: string;
}

export class MovieModel extends TimeStamps {
  @prop()
  poster: string;

  @prop()
  bigPoster: string;

  @prop()
  title: string;

  @prop({ unique: true })
  slug: string;

  @prop()
  videoUrl: string;

  @prop({ default: 4 })
  rating?: number;

  @prop({ default: 0 })
  countOpened: number;

  @prop()
  parameters?: Parameters;

  @prop({ ref: () => GenreModel })
  genres: Ref<GenreModel>[];

  @prop({ ref: () => ActorModel })
  actors: Ref<ActorModel>[];
}
