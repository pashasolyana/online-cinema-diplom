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
import { ActorService } from './actor.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/auth/pipes/id.validation.pipes';
import { ActorDto } from './dto/actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly ActorService: ActorService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.ActorService.bySlug(slug);
  }

  @Get()
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.ActorService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.ActorService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(201)
  @Auth()
  async create() {
    return this.ActorService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  async updateProfile(@Param('id') id: string, @Body() dto: ActorDto) {
    return this.ActorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.ActorService.delete(id);
  }
}
