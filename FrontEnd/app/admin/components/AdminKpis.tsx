type Kpi = {
  label: string;
  value: string;
};

type AdminKpisProps = {
  kpis: Kpi[];
};

export default function AdminKpis({ kpis }: AdminKpisProps) {
  return (
    <section className="admin-simple-kpis">
      {kpis.map((kpi) => (
        <article key={kpi.label} className="card simple-kpi">
          <div className="simple-kpi-value">{kpi.value}</div>
          <div className="simple-kpi-label">{kpi.label}</div>
        </article>
      ))}
    </section>
  );
}
