'use client';

import PriceCalculator from '../../components/PriceCalculator';

type PricingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <span className="tag">Precificação</span>
            <h2>Nova peça</h2>
          </div>
          <button type="button" className="secondary" onClick={onClose}>
            Fechar
          </button>
        </header>
        <PriceCalculator variant="compact" />
      </div>
    </div>
  );
}
