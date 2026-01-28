"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("../database/knex");
let ItemsService = class ItemsService {
    roundToTwo(value) {
        return Math.round(value * 100) / 100;
    }
    async getAiSuggestedPrice(input) {
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
            instructions: 'Você é um especialista em precificação de brechó. Sugira um preço em BRL considerando custo de compra, condição, categoria, marca e descrição. Retorne apenas o JSON conforme o esquema.',
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
        const data = (await response.json());
        const outputItem = data.output?.find((item) => item.type === 'message');
        const contentText = outputItem?.content?.find((item) => item.type === 'output_text')?.text;
        const raw = contentText ?? data.output_text;
        if (!raw) {
            throw new Error('Empty OpenAI response');
        }
        const parsed = JSON.parse(raw);
        if (!Number.isFinite(parsed.suggestedPrice)) {
            throw new Error('Invalid suggestedPrice from OpenAI');
        }
        return {
            suggestedPrice: this.roundToTwo(parsed.suggestedPrice),
            rationale: parsed.rationale,
        };
    }
    async create(dto) {
        const basePrice = dto.basePrice ?? 0;
        if (!basePrice) {
            throw new common_1.BadRequestException('basePrice é obrigatório');
        }
        if (!dto.description) {
            throw new common_1.BadRequestException('description é obrigatório');
        }
        let suggestedPrice = 0;
        let aiRationale = null;
        let aiUsed = false;
        let aiError = null;
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
        }
        catch (error) {
            aiError = error instanceof Error ? error.message : 'AI error';
            throw new common_1.ServiceUnavailableException({
                message: 'Falha ao gerar preço com IA',
                detail: aiError,
            });
        }
        const [id] = await (0, knex_1.db)('items').insert({
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
    async priceOnly(dto) {
        const basePrice = dto.basePrice ?? 0;
        if (!basePrice) {
            throw new common_1.BadRequestException('basePrice é obrigatório');
        }
        if (!dto.description) {
            throw new common_1.BadRequestException('description é obrigatório');
        }
        let suggestedPrice = 0;
        let aiRationale = null;
        let aiUsed = false;
        let aiError = null;
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
        }
        catch (error) {
            aiError = error instanceof Error ? error.message : 'AI error';
            throw new common_1.ServiceUnavailableException({
                message: 'Falha ao gerar preço com IA',
                detail: aiError,
            });
        }
        return { ...dto, suggestedPrice, aiRationale, aiUsed, aiError };
    }
    async findAll() {
        return (0, knex_1.db)('items').select('*').orderBy('created_at', 'desc');
    }
    async findById(id) {
        return (0, knex_1.db)('items').where({ id }).first();
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)()
], ItemsService);
//# sourceMappingURL=items.service.js.map