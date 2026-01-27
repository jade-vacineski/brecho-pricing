'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function Page() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('CLOTHING');
  const [condition, setCondition] = useState('USED');
  const [gender, setGender] = useState('OTHER');
  const [basePrice, setBasePrice] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<number | null>(null);
  const [aiRationale, setAiRationale] = useState('');
  const [aiUsed, setAiUsed] = useState<boolean | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <main>
      <div className="container">
        <section className="brand">
          <span className="badge">Precificação inteligente</span>
          <h1>SecondPrice</h1>
          <p>
            Gere um preço sugerido pela IA usando custo de compra, condição,
            categoria e marca. Minimalista, direto e fácil de ajustar.
          </p>
          <div className="card summary">
            <div>
              <div className="price">
                {aiUsed === true && aiSuggestedPrice !== null
                  ? formatMoney(aiSuggestedPrice)
                  : '—'}
              </div>
              <div>
                Preço sugerido
                {aiUsed === true ? ' (IA)' : ''}
              </div>
            </div>
            {aiUsed === true && aiRationale && (
              <div className="rationale">{aiRationale}</div>
            )}
          </div>
        </section>

        <section className="card">
          <form className="form">
            <div className="field">
              <label htmlFor="name">Nome do item</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Vestido midi"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="description">Descrição</label>
              <input
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tecido, cor, detalhes relevantes"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="brand">Marca</label>
              <input
                id="brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="Ex.: Zara"
                autoComplete="organization"
              />
            </div>

            <div className="field">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="CLOTHING">Roupas</option>
                <option value="FOOTWEAR">Calçados</option>
                <option value="ACCESSORY">Acessórios</option>
                <option value="BAGS">Bolsas</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="condition">Condição</label>
              <select
                id="condition"
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
              >
                <option value="NEW">Novo</option>
                <option value="PREOWNED">Seminovo</option>
                <option value="USED">Usado</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="gender">Gênero</label>
              <select
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="FEMALE">Feminino</option>
                <option value="MALE">Masculino</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="base">Custo de compra</label>
              <input
                id="base"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
                placeholder="R$ 0,00"
                autoComplete="off"
              />
            </div>

            <div className="actions">
              <button
                type="button"
                disabled={status === 'saving'}
                onClick={async () => {
                  setStatus('idle');
                  setStatusMessage('');
                  if (!name.trim() || !description.trim()) {
                    setStatus('error');
                    setStatusMessage('Preencha nome e descrição.');
                    return;
                  }
                  const base = Number(basePrice);
                  if (Number.isNaN(base) || base <= 0) {
                    setStatus('error');
                    setStatusMessage('Informe um custo válido maior que zero.');
                    return;
                  }
                  try {
                    setStatus('saving');
                    const response = await fetch(`${API_URL}/items`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim(),
                        brand: brand.trim() || undefined,
                        category,
                        condition,
                        gender,
                        basePrice: base,
                      }),
                    });
                    if (!response.ok) {
                      const text = await response.text();
                      throw new Error(text || 'Erro ao salvar.');
                    }
                    const data = await response.json();
                    if (typeof data?.suggestedPrice === 'number') {
                      setAiSuggestedPrice(data.suggestedPrice);
                    }
                    if (typeof data?.aiRationale === 'string') {
                      setAiRationale(data.aiRationale);
                    } else {
                      setAiRationale('');
                    }
                    setAiUsed(typeof data?.aiUsed === 'boolean' ? data.aiUsed : null);
                    setStatus('success');
                    setStatusMessage('Item salvo com sucesso.');
                  } catch (error) {
                    setStatus('error');
                    setStatusMessage(
                      error instanceof Error ? error.message : 'Erro ao salvar.',
                    );
                  } finally {
                    setTimeout(() => setStatus('idle'), 1500);
                  }
                }}
              >
                {status === 'saving' ? 'Salvando...' : 'Salvar item'}
              </button>
              <button
                type="button"
                className="secondary"
                disabled={isSimulating}
                onClick={async () => {
                  setStatus('idle');
                  setStatusMessage('');
                  if (!name.trim() || !description.trim()) {
                    setStatus('error');
                    setStatusMessage('Preencha nome e descrição.');
                    return;
                  }
                  const base = Number(basePrice);
                  if (Number.isNaN(base) || base <= 0) {
                    setStatus('error');
                    setStatusMessage('Informe um custo válido maior que zero.');
                    return;
                  }
                  try {
                    setIsSimulating(true);
                    const response = await fetch(`${API_URL}/items/price`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim(),
                        brand: brand.trim() || undefined,
                        category,
                        condition,
                        gender,
                        basePrice: base,
                      }),
                    });
                    if (!response.ok) {
                      const text = await response.text();
                      throw new Error(text || 'Erro ao simular.');
                    }
                    const data = await response.json();
                    if (typeof data?.suggestedPrice === 'number') {
                      setAiSuggestedPrice(data.suggestedPrice);
                    }
                    if (typeof data?.aiRationale === 'string') {
                      setAiRationale(data.aiRationale);
                    } else {
                      setAiRationale('');
                    }
                    setAiUsed(typeof data?.aiUsed === 'boolean' ? data.aiUsed : null);
                    setStatus('success');
                    setStatusMessage('Preço simulado com sucesso.');
                  } catch (error) {
                    setStatus('error');
                    setStatusMessage(
                      error instanceof Error ? error.message : 'Erro ao simular.',
                    );
                  } finally {
                    setIsSimulating(false);
                    setTimeout(() => setStatus('idle'), 1500);
                  }
                }}
              >
                {isSimulating ? 'Simulando...' : 'Simular preço'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setName('');
                  setDescription('');
                  setBrand('');
                  setCategory('CLOTHING');
                  setCondition('USED');
                  setGender('OTHER');
                  setBasePrice('');
                  setAiSuggestedPrice(null);
                  setAiRationale('');
                  setAiUsed(null);
                  setStatus('idle');
                  setStatusMessage('');
                }}
              >
                Limpar
              </button>
            </div>
            {status !== 'idle' && (
              <div
                className="badge"
                style={{
                  borderColor: status === 'error' ? '#e08f8f' : undefined,
                  color: status === 'error' ? '#a13e3e' : undefined,
                }}
              >
                {statusMessage || (status === 'saving' ? 'Salvando...' : '')}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
