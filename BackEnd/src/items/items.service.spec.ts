import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ItemsService],
    }).compile();

    service = moduleRef.get(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
