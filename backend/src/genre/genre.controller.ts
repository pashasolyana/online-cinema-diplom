import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/auth/pipes/id.validation.pipes';
import { CreateGenreDto } from './dto/createGenre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug);
  }

  @Get('collections')
  async getCount() {
    return this.genreService.getCollections();
  }

  @Get('/popular')
  async getPopular() {
    return this.genreService.getPopular();
  }

  @Get()
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(201)
  @Auth()
  async create() {
    return this.genreService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  async updateProfile(@Param('id') id: string, @Body() dto: CreateGenreDto) {
    return this.genreService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.delete(id);
  }
}
