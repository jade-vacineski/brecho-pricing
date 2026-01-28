'use client';

import { useState } from 'react';

import PriceCalculator from '../components/PriceCalculator';

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
        <header className="admin-simple-header">
          <div>
            <span className="tag">Área administrativa</span>
            <h1>Precifica Brechó</h1>
            <p>Olá! Vamos precificar seus produtos com inteligência.</p>
          </div>
        </header>

        <button
          type="button"
          className="primary-bar"
          onClick={() => setIsPricingOpen(true)}
        >
          + Precificar nova peça
        </button>

        <section className="admin-simple-kpis">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="card simple-kpi">
              <div className="simple-kpi-value">{kpi.value}</div>
              <div className="simple-kpi-label">{kpi.label}</div>
            </article>
          ))}
        </section>

        <section className="card simple-table">
          <header className="simple-table-header">
            <h2>Produtos</h2>
            <div className="filters">
              <span className="chip active">Todos</span>
              <span className="chip">Roupas</span>
              <span className="chip">Calçados</span>
              <span className="chip">Bolsas</span>
            </div>
          </header>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Condição</th>
                  <th>Custo</th>
                  <th>Preço sugerido</th>
                  <th>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.condition}</td>
                    <td>{item.cost}</td>
                    <td>{item.suggested}</td>
                    <td className="profit">{item.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card empty-state">
          <div className="empty-icon">◻︎</div>
          <h3>Ainda não há produtos</h3>
          <p>
            Comece cadastrando sua primeira peça para receber uma precificação
            inteligente.
          </p>
        </section>
      </div>

      {isPricingOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsPricingOpen(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <span className="tag">Precificação</span>
                <h2>Nova peça</h2>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => setIsPricingOpen(false)}
              >
                Fechar
              </button>
            </header>
            <PriceCalculator variant="compact" />
          </div>
        </div>
      )}
    </main>
  );
}
