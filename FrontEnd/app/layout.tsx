import './globals.css';

export const metadata = {
  title: 'Brechó Pricing',
  description: 'Precificação simples para itens de brechó',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
