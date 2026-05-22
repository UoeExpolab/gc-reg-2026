import Link from "next/link";

const TABS = [
  { href: "/team", value: "01", label: "Register Team", description: "Add teammates, pick a Challenge track, and tell us about your project." },
  { href: "/table", value: "02", label: "Reserve Table", description: "Claim a workspace for the duration of the hackathon. Dashed tiles are already taken." },
  { href: "/kit", value: "03", label: "Book Kit", description: "Borrow hardware from the Grand Challenges inventory and pick a collection slot." },
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
            <span className="hint">{t.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
