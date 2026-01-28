'use client';

import { useEffect, useMemo, useState } from 'react';

import AdminHeader from './components/AdminHeader';
import AdminKpis from './components/AdminKpis';
import AdminTable from './components/AdminTable';
import EmptyState from './components/EmptyState';
import PricingModal from './components/PricingModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const categoryLabels: Record<string, string> = {
  CLOTHING: 'Roupas',
  FOOTWEAR: 'Calçados',
  ACCESSORY: 'Acessórios',
  BAGS: 'Bolsas',
};

const conditionLabels: Record<string, string> = {
  NEW: 'Novo',
  PREOWNED: 'Seminovo',
  USED: 'Usado',
};

type ApiItem = {
  id: number;
  name: string;
  category?: string;
  condition?: string;
  base_price: number | string;
  suggested_price: number | string;
};

type TableItem = {
  name: string;
  category: string;
  condition: string;
  cost: string;
  suggested: string;
  margin: string;
};

export default function AdminPage() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [items, setItems] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Faça login para ver os produtos.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Erro ao carregar itens.');
        }
        const data = (await response.json()) as ApiItem[];
        const mapped = data.map((item) => {
          const base = Number(item.base_price) || 0;
          const suggested = Number(item.suggested_price) || 0;
          const margin = suggested - base;
          return {
            name: item.name,
            category: categoryLabels[item.category ?? ''] ?? '—',
            condition: conditionLabels[item.condition ?? ''] ?? '—',
            cost: formatMoney(base),
            suggested: formatMoney(suggested),
            margin: formatMoney(margin),
          };
        });
        setItems(mapped);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao carregar itens.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const kpis = useMemo(() => {
    const total = items.length;
    const profit = items.reduce((sum, item) => {
      const cost = Number(item.cost.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      const suggested =
        Number(item.suggested.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      return sum + (suggested - cost);
    }, 0);
    return [
      { label: 'Disponíveis', value: String(total) },
      { label: 'Vendidos', value: '0' },
      { label: 'Lucro estimado', value: formatMoney(profit) },
    ];
  }, [items]);

  return (
    <main className="admin-simple">
      <div className="admin-simple-shell">
        <AdminHeader onOpenPricing={() => setIsPricingOpen(true)} />
        <AdminKpis kpis={kpis} />
        {loading && <div className="badge">Carregando itens...</div>}
        {error && <div className="badge">{error}</div>}
        {!loading && !error && items.length > 0 && <AdminTable items={items} />}
        {!loading && !error && items.length === 0 && <EmptyState />}
      </div>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />
    </main>
  );
}
