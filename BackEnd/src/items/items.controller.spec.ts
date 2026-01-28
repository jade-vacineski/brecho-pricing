import { Test } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService],
    }).compile();

    controller = moduleRef.get(ItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
