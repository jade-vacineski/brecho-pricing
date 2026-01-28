'use client';

type AdminHeaderProps = {
  onOpenPricing: () => void;
};

export default function AdminHeader({ onOpenPricing }: AdminHeaderProps) {
  return (
    <header className="admin-simple-header">
      <div>
        <span className="tag">Área administrativa</span>
        <h1>Precifica Brechó</h1>
        <p>Olá! Vamos precificar seus produtos com inteligência.</p>
      </div>
      <button type="button" className="primary-bar" onClick={onOpenPricing}>
        + Precificar nova peça
      </button>
    </header>
  );
}
