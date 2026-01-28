'use client';

import { useState } from 'react';

import AdminHeader from './components/AdminHeader';
import AdminKpis from './components/AdminKpis';
import AdminTable from './components/AdminTable';
import EmptyState from './components/EmptyState';
import PricingModal from './components/PricingModal';

const kpis = [
  { label: 'Disponíveis', value: '128' },
  { label: 'Vendidos', value: '56' },
  { label: 'Lucro estimado', value: 'R$ 18.420' },
];

const items = [
  {
    name: 'Vestido midi florido',
    category: 'Roupas',
    condition: 'Seminovo',
    cost: 'R$ 38',
    suggested: 'R$ 149',
    margin: 'R$ 111',
    status: 'Em exposição',
  },
  {
    name: 'Tênis couro branco',
    category: 'Calçados',
    condition: 'Usado',
    cost: 'R$ 52',
    suggested: 'R$ 189',
    margin: 'R$ 137',
    status: 'Alta demanda',
  },
  {
    name: 'Bolsa estruturada',
    category: 'Bolsas',
    condition: 'Novo',
    cost: 'R$ 110',
    suggested: 'R$ 320',
    margin: 'R$ 210',
    status: 'Chegando',
  },
  {
    name: 'Camisa linho oversized',
    category: 'Roupas',
    condition: 'Seminovo',
    cost: 'R$ 44',
    suggested: 'R$ 159',
    margin: 'R$ 115',
    status: 'Em exposição',
  },
  {
    name: 'Jaqueta jeans premium',
    category: 'Roupas',
    condition: 'Usado',
    cost: 'R$ 78',
    suggested: 'R$ 229',
    margin: 'R$ 151',
    status: 'Alta demanda',
  },
];

export default function AdminPage() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <main className="admin-simple">
      <div className="admin-simple-shell">
        <AdminHeader onOpenPricing={() => setIsPricingOpen(true)} />
        <AdminKpis kpis={kpis} />
        <AdminTable items={items} />
        <EmptyState />
      </div>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />
    </main>
  );
}
