import { CreateItemDto } from './dto/create-item.dto';
import { Condition } from './enums/condition';
import { Gender } from './enums/gender';
import { ProductCategory } from './enums/product-category';
export declare class ItemsService {
    private roundToTwo;
    private getAiSuggestedPrice;
    create(dto: CreateItemDto): Promise<{
        suggestedPrice: number;
        aiRationale: string;
        aiUsed: boolean;
        aiError: null;
        name: string;
        description: string;
        category?: ProductCategory;
        condition?: Condition;
        gender?: Gender;
        brand?: string;
        basePrice?: number;
        id: number;
    }>;
    priceOnly(dto: CreateItemDto): Promise<{
        suggestedPrice: number;
        aiRationale: string;
        aiUsed: boolean;
        aiError: null;
        name: string;
        description: string;
        category?: ProductCategory;
        condition?: Condition;
        gender?: Gender;
        brand?: string;
        basePrice?: number;
    }>;
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any>;
}
