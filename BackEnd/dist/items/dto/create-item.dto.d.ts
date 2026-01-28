import { ProductCategory } from '../enums/product-category';
import { Condition } from '../enums/condition';
import { Gender } from '../enums/gender';
export declare class CreateItemDto {
    name: string;
    description: string;
    category?: ProductCategory;
    condition?: Condition;
    gender?: Gender;
    brand?: string;
    basePrice?: number;
}
