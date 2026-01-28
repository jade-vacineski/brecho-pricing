import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../enums/product-category';
import { Condition } from '../enums/condition';
import { Gender } from '../enums/gender';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  @IsEnum(Condition)
  condition?: Condition;

  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  basePrice?: number;
}
