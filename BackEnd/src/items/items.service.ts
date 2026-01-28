import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { db } from '../database/knex';
import { CreateItemDto } from './dto/create-item.dto';
import { Condition } from './enums/condition';
import { Gender } from './enums/gender';
import { ProductCategory } from './enums/product-category';

@Injectable()
export class ItemsService {
  private roundToTwo(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private async getAiSuggestedPrice(input: {
    name: string;
    description: string;
    brand?: string;
    category?: ProductCategory;
    condition?: Condition;
    gender?: Gender;
    basePrice: number;
  }): Promise<{ suggestedPrice: number; rationale: string }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }
    const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
    const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
    const projectId = process.env.OPENAI_PROJECT_ID;
    const orgId = process.env.OPENAI_ORG_ID;

    const body = {
      model,
      instructions:
        'Você é um especialista em precificação de brechó. Sugira um preço em BRL considerando custo de compra, condição, categoria, marca e descrição. Retorne apenas o JSON conforme o esquema.',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                `Nome: ${input.name}`,
                `Descrição: ${input.description}`,
                `Marca: ${input.brand ?? 'não informada'}`,
                `Categoria: ${input.category ?? 'não informada'}`,
                `Condição: ${input.condition ?? 'não informada'}`,
                `Gênero: ${input.gender ?? 'não informado'}`,
                `Custo de compra (BRL): ${input.basePrice}`,
                'Responda com um preço sugerido numérico em BRL.',
              ].join('\n'),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'pricing_response',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              suggestedPrice: { type: 'number' },
              rationale: { type: 'string' },
            },
            required: ['suggestedPrice', 'rationale'],
          },
        },
      },
    };

    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(projectId ? { 'OpenAI-Project': projectId } : {}),
        ...(orgId ? { 'OpenAI-Organization': orgId } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      output?: Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
      }>;
      output_text?: string;
    };

    const outputItem = data.output?.find((item) => item.type === 'message');
    const contentText = outputItem?.content?.find(
      (item) => item.type === 'output_text',
    )?.text;
    const raw = contentText ?? data.output_text;
    if (!raw) {
      throw new Error('Empty OpenAI response');
    }

    const parsed = JSON.parse(raw) as {
      suggestedPrice: number;
      rationale: string;
    };

    if (!Number.isFinite(parsed.suggestedPrice)) {
      throw new Error('Invalid suggestedPrice from OpenAI');
    }

    return {
      suggestedPrice: this.roundToTwo(parsed.suggestedPrice),
      rationale: parsed.rationale,
    };
  }

  async create(dto: CreateItemDto) {
    const basePrice = dto.basePrice ?? 0;
    if (!basePrice) {
      throw new BadRequestException('basePrice é obrigatório');
    }
    if (!dto.description) {
      throw new BadRequestException('description é obrigatório');
    }
    let suggestedPrice = 0;
    let aiRationale: string | null = null;
    let aiUsed = false;
    let aiError: string | null = null;

    try {
      const aiResult = await this.getAiSuggestedPrice({
        name: dto.name,
        description: dto.description,
        brand: dto.brand,
        category: dto.category,
        condition: dto.condition,
        gender: dto.gender,
        basePrice,
      });
      suggestedPrice = aiResult.suggestedPrice;
      aiRationale = aiResult.rationale;
      aiUsed = true;
    } catch (error) {
      aiError = error instanceof Error ? error.message : 'AI error';
      throw new ServiceUnavailableException({
        message: 'Falha ao gerar preço com IA',
        detail: aiError,
      });
    }

    const [id] = await db('items').insert({
      name: dto.name,
      description: dto.description,
      brand: dto.brand,
      category: dto.category,
      condition: dto.condition,
      gender: dto.gender,
      base_price: basePrice,
      suggested_price: suggestedPrice,
      ai_rationale: aiRationale,
    });

    return { id, ...dto, suggestedPrice, aiRationale, aiUsed, aiError };
  }

  async priceOnly(dto: CreateItemDto) {
    const basePrice = dto.basePrice ?? 0;
    if (!basePrice) {
      throw new BadRequestException('basePrice é obrigatório');
    }
    if (!dto.description) {
      throw new BadRequestException('description é obrigatório');
    }

    let suggestedPrice = 0;
    let aiRationale: string | null = null;
    let aiUsed = false;
    let aiError: string | null = null;

    try {
      const aiResult = await this.getAiSuggestedPrice({
        name: dto.name,
        description: dto.description,
        brand: dto.brand,
        category: dto.category,
        condition: dto.condition,
        gender: dto.gender,
        basePrice,
      });
      suggestedPrice = aiResult.suggestedPrice;
      aiRationale = aiResult.rationale;
      aiUsed = true;
    } catch (error) {
      aiError = error instanceof Error ? error.message : 'AI error';
      throw new ServiceUnavailableException({
        message: 'Falha ao gerar preço com IA',
        detail: aiError,
      });
    }

    return { ...dto, suggestedPrice, aiRationale, aiUsed, aiError };
  }

  async findAll() {
    return db('items').select('*').orderBy('created_at', 'desc');
  }

  async findById(id: number) {
    return db('items').where({ id }).first();
  }
}
