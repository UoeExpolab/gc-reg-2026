import Link from "next/link";

const FORM_LINKS = [
  { href: "/team", value: "01", label: "Register Team", hint: "Select a Challenge and add team members." },
  { href: "/kit", value: "02", label: "Book Kit", hint: "Reserve one inventory item for a time slot." },
  { href: "/table", value: "03", label: "Reserve Table", hint: "Choose a table for your registered team." },
];

const CHALLENGES = [
  "Future Food",
  "Mental Health",
  "Social Inequality",
  "Climate and Environment Emergency",
  "Grand Challenges Penryn",
  "Defence, Security and Resilience",
  "Education Innovation",
];

export default function Home() {
  return (
    <main className="form-index home-page">
      <section className="home-intro">
        <div className="form-index-heading">
          <div className="eyebrow">University of Exeter · Grand Challenges</div>
          <h1>
            Grand <em>Challenges</em> 2026
          </h1>
          <div className="gold-rule" />
        </div>
        <p className="home-lede">
          Grand Challenges is a project week where students work in interdisciplinary groups
          to design innovative solutions to real world challenges.
        </p>
      </section>

      <div className="form-index-grid">
        {FORM_LINKS.map(t => (
          <Link key={t.href} href={t.href} className="form-link-card">
            <span className="marker">{t.value}</span>
            <span className="label">{t.label}</span>
            <span className="hint">{t.hint}</span>
          </Link>
        ))}
      </div>

      <section className="landing-section" aria-labelledby="challenges-heading">
        <div className="section-heading">
          <div className="eyebrow">Challenges 2026</div>
          <h2 id="challenges-heading">Challenge topics</h2>
        </div>
        <div className="challenge-grid">
          {CHALLENGES.map(challenge => (
            <span key={challenge} className="challenge-chip">{challenge}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
