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

const BENEFITS = [
  "Meet like-minded students from across disciplines.",
  "Develop teamwork, presentation, and project planning skills.",
  "Apply your knowledge to global issues and real-world briefs.",
  "Create work with the potential to make a practical impact.",
];

const VIDEO_LINKS = [
  "Showcase Video 2023",
  "Grand Challenges Week 2023 Montage Video",
];

export default function Home() {
  return (
    <main className="form-index home-page">
      <section className="home-intro">
        <div>
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
          <div className="home-meta">
            <span>1-5 June 2026</span>
            <span>Sign-ups are now closed</span>
            <span>Linked to the UN Sustainable Development Goals</span>
          </div>
        </div>
        <div className="home-highlight" aria-label="Grand Challenges award and Strategy 2030 highlights">
          <div className="home-flourish" />
          <div>
            <span className="badge badge-gold">We are winners</span>
            <h2>Collaborative Award for Teaching Excellence</h2>
            <p>
              The Grand Challenges team are winners of a Collaborative Award for Teaching
              Excellence, recognising the programme&apos;s teaching impact.
            </p>
          </div>
          <div>
            <span className="badge badge-sprig">Strategy 2030</span>
            <p>
              By completing Grand Challenges, students contribute to the University of Exeter&apos;s
              Strategy 2030 goals.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="forms-heading">
        <div className="section-heading">
          <div className="eyebrow">Forms</div>
          <h2 id="forms-heading">Manage your Grand Challenges setup</h2>
        </div>
        <div className="form-index-grid">
          {FORM_LINKS.map(t => (
            <Link key={t.href} href={t.href} className="form-link-card">
              <span className="marker">{t.value}</span>
              <span className="label">{t.label}</span>
              <span className="hint">{t.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section landing-grid" aria-label="Programme information">
        <article className="info-panel">
          <div className="eyebrow">What is Grand Challenges?</div>
          <p>
            Top academics and invited speakers share their views and help students apply their
            skills and knowledge to a real-life problem.
          </p>
        </article>
        <article className="info-panel">
          <div className="eyebrow">Benefits</div>
          <ul>
            {BENEFITS.map(benefit => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </article>
        <article className="info-panel">
          <div className="eyebrow">GreenComp</div>
          <p>
            Grand Challenges helps students develop sustainable thinking, self-awareness, and
            experiential learning in line with the GreenComp framework.
          </p>
        </article>
        <article className="info-panel quote-panel">
          <div className="eyebrow">Student testimonial</div>
          <blockquote>
            &quot;I met so many new people and we quickly became friends through working together.&quot;
          </blockquote>
        </article>
      </section>

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

      <section className="landing-section landing-grid compact" aria-label="Past projects and media">
        <article className="info-panel">
          <div className="eyebrow">Past Projects</div>
          <p>
            Previous projects have explored Climate and Environment Emergency, Future Food,
            Mental Health, Social Inequality, and Grand Challenges Penryn.
          </p>
        </article>
        <article className="info-panel">
          <div className="eyebrow">Gallery</div>
          <p>
            In 2023, 70 student groups across five challenges showcased their outputs on
            Forum Street after presenting to their challenge groups.
          </p>
        </article>
        <article className="info-panel">
          <div className="eyebrow">Videos</div>
          <div className="video-links">
            {VIDEO_LINKS.map(video => (
              <span key={video}>{video}</span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
