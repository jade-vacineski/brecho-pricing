import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.service.create(dto);
  }

  @Post('price')
  price(@Body() dto: CreateItemDto) {
    return this.service.priceOnly(dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.service.findById(id);

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    return item;
  }
}
