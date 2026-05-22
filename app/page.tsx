import Link from "next/link";

const TABS = [
  { href: "/team", value: "01", label: "Register Team" },
  { href: "/kit", value: "02", label: "Book Kit" },
  { href: "/table", value: "03", label: "Reserve Table" },
];

export default function Home() {
  return (
    <main className="form-index">
      <div className="form-index-heading">
        <div className="eyebrow">
          Registration · 2026
        </div>
        <h1>
          Grand <em>Challenges</em>
        </h1>
        <div className="gold-rule" />
      </div>

      <div className="form-index-grid">
        {TABS.map(t => (
          <Link key={t.href} href={t.href} className="form-link-card">
            <span className="marker">{t.value}</span>
            <span className="label">{t.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
