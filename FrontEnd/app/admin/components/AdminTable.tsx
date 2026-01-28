type Item = {
  name: string;
  category: string;
  condition: string;
  cost: string;
  suggested: string;
  margin: string;
};

type AdminTableProps = {
  items: Item[];
};

export default function AdminTable({ items }: AdminTableProps) {
  return (
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
  );
}
