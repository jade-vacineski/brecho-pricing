import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
export declare class ItemsController {
    private readonly service;
    constructor(service: ItemsService);
    create(dto: CreateItemDto): Promise<{
        suggestedPrice: number;
        aiRationale: string;
        aiUsed: boolean;
        aiError: null;
        name: string;
        description: string;
        category?: import("./enums/product-category").ProductCategory;
        condition?: import("./enums/condition").Condition;
        gender?: import("./enums/gender").Gender;
        brand?: string;
        basePrice?: number;
        id: number;
    }>;
    price(dto: CreateItemDto): Promise<{
        suggestedPrice: number;
        aiRationale: string;
        aiUsed: boolean;
        aiError: null;
        name: string;
        description: string;
        category?: import("./enums/product-category").ProductCategory;
        condition?: import("./enums/condition").Condition;
        gender?: import("./enums/gender").Gender;
        brand?: string;
        basePrice?: number;
    }>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
}
