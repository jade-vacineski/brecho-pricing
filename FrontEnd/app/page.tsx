'use client';

import { useEffect, useRef, useState } from 'react';

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

  const CategoryOptions = [
    { value: 'CLOTHING', label: 'Roupas' },
    { value: 'FOOTWEAR', label: 'Calçados' },
    { value: 'ACCESSORY', label: 'Acessórios' },
    { value: 'BAGS', label: 'Bolsas' },
  ];

  const ConditionOptions = [
    { value: 'NEW', label: 'Novo' },
    { value: 'PREOWNED', label: 'Seminovo' },
    { value: 'USED', label: 'Usado' },
  ];

  const GenderOptions = [
    { value: 'FEMALE', label: 'Feminino' },
    { value: 'MALE', label: 'Masculino' },
    { value: 'OTHER', label: 'Outro' },
  ];

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
              <CustomSelect
                id="category"
                value={category}
                options={CategoryOptions}
                onChange={setCategory}
              />
            </div>

            <div className="field">
              <label htmlFor="condition">Condição</label>
              <CustomSelect
                id="condition"
                value={condition}
                options={ConditionOptions}
                onChange={setCondition}
              />
            </div>

            <div className="field">
              <label htmlFor="gender">Gênero</label>
              <CustomSelect
                id="gender"
                value={gender}
                options={GenderOptions}
                onChange={setGender}
              />
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

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

function CustomSelect({ id, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="select" ref={rootRef}>
      <button
        id={id}
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="select-value">{selected?.label ?? 'Selecione'}</span>
        <span className="select-caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="select-menu" role="listbox" aria-labelledby={id}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`select-option${option.value === value ? ' active' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
