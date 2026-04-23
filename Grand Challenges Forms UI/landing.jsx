// ---------- Landing page ----------
function Landing({ onRegister, onPickFlow }) {
  return (
    <>
      <section className="landing-hero">
        <img className="sprig-bg tr" src="assets/sprig.svg"/>
        <img className="sprig-bg bl" src="assets/sprig.svg"/>
        <div className="inner">
          <div>
            <div className="hero-eyebrow">
              <span className="rule"/>
              Registration · 14–16 September 2026
            </div>
            <h1 className="hero-display">
              Grand<br/>
              Challenges<span className="amp">,</span> <span className="accent">Exeter</span>.
            </h1>
            <p className="hero-lede">
              A three-day interdisciplinary hackathon where undergraduate teams
              take on <em>real-world problems</em> — sustainability, health, coastal futures,
              AI &amp; society, heritage.
            </p>
            <div className="hero-meta">
              <div className="item">
                <div className="k">When</div>
                <div className="v">Fri 14 – Sun 16 Sept<small>Streatham Campus</small></div>
              </div>
              <div className="item">
                <div className="k">Who</div>
                <div className="v">Undergraduates<small>Any discipline · teams of 3–5</small></div>
              </div>
              <div className="item">
                <div className="k">Prize pool</div>
                <div className="v">£12,000<small>Plus mentorship and residency</small></div>
              </div>
            </div>
          </div>

          <aside className="hero-index">
            <div className="label">Register in three steps</div>
            <ol>
              <li onClick={() => onPickFlow("team")}>
                <span className="num">01</span>
                <span className="name">Register a team</span>
                <span className="arrow"><I.ArrowRight size={16}/></span>
              </li>
              <li onClick={() => onPickFlow("table")}>
                <span className="num">02</span>
                <span className="name">Reserve a table</span>
                <span className="arrow"><I.ArrowRight size={16}/></span>
              </li>
              <li onClick={() => onPickFlow("kit")}>
                <span className="num">03</span>
                <span className="name">Book a kit</span>
                <span className="arrow"><I.ArrowRight size={16}/></span>
              </li>
            </ol>
            <div style={{marginTop: 24}}>
              <Button variant="on-green" block onClick={() => onRegister("team")}>
                Start registration <I.ArrowRight size={14}/>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="landing-body">
        <div className="section-head">
          <h2>Five <em>Challenges</em>. One weekend.</h2>
          <div className="meta">2026 · Five tracks</div>
        </div>
        <div className="challenges">
          {DATA.challenges.map((c) => (
            <div key={c.value} className="challenge" onClick={() => onRegister("team")}>
              <div className="num">{c.num}</div>
              <div className="abbr">{c.abbr}</div>
              <h3>{c.label}</h3>
              <p>{c.blurb}</p>
              <div className="foot">
                <span>Open track</span>
                <span className="count">Join →</span>
              </div>
            </div>
          ))}
          <div className="challenge" style={{background: "var(--exeter-green)", color: "var(--on-green)"}}>
            <div className="num" style={{color: "var(--exeter-gold)", opacity: 0.8}}>06</div>
            <div className="abbr" style={{color: "var(--exeter-gold)"}}>WILD</div>
            <h3 style={{color: "var(--on-green)"}}>Your own brief</h3>
            <p style={{color: "var(--on-green-70)"}}>Propose a wildcard problem during registration. Mentors will help you shape it.</p>
            <div className="foot" style={{borderTopColor: "var(--on-green-15)", color: "var(--on-green-70)"}}>
              <span>Self-directed</span>
              <span className="count" style={{color: "var(--exeter-gold)"}}>Describe it →</span>
            </div>
          </div>
        </div>

        <div className="programme">
          <div className="intro">
            <div className="eyebrow">Programme at a glance</div>
            <h2>Three days, one brief.</h2>
            <div className="gold-rule"/>
            <p>
              Registration closes midnight 12 Sept. Teams ship a working prototype
              and a five-minute pitch. Judges announce at 17:00 on Sunday.
            </p>
          </div>
          <div className="timeline">
            <div className="tl-row gold">
              <div className="when">Fri 09:00</div><div className="dot"/>
              <div className="what"><div className="title">Kick-off &amp; keynote</div><div className="sub">Forum · Vice-Chancellor opens the weekend.</div></div>
            </div>
            <div className="tl-row">
              <div className="when">Fri 11:00</div><div className="dot"/>
              <div className="what"><div className="title">Team formation &amp; briefing</div><div className="sub">Meet your Challenge track leads. Claim tables.</div></div>
            </div>
            <div className="tl-row">
              <div className="when">Fri 14:00</div><div className="dot"/>
              <div className="what"><div className="title">Kit collection opens</div><div className="sub">Sensors, VR, printers. First-come, first-served.</div></div>
            </div>
            <div className="tl-row">
              <div className="when">Sat · all day</div><div className="dot"/>
              <div className="what"><div className="title">Build</div><div className="sub">Mentors on the floor 09:00–22:00. Hot drinks throughout.</div></div>
            </div>
            <div className="tl-row gold">
              <div className="when">Sun 14:00</div><div className="dot"/>
              <div className="what"><div className="title">Submissions close</div><div className="sub">Lock your prototype and upload your pitch deck.</div></div>
            </div>
            <div className="tl-row gold">
              <div className="when">Sun 17:00</div><div className="dot"/>
              <div className="what"><div className="title">Showcase &amp; awards</div><div className="sub">Public demo, judging, and the 2026 cohort photo.</div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
window.Landing = Landing;

// ---------- Registration shell (two-column with stepper) ----------
function RegistrationShell({ flow, onFlow, onSubmit, toast, onCancel }) {
  const items = [
    { value: "team",  label: "Register team",  hint: "Teammates, Challenge, project" },
    { value: "table", label: "Reserve table",  hint: "Claim a workspace" },
    { value: "kit",   label: "Book kit",       hint: "Hardware & time slot" },
  ];
  const active = items.find(i => i.value === flow);
  const eyebrow = flow === "team" ? "Step one" : flow === "table" ? "Step two" : "Step three";

  return (
    <main className="reg-wrap">
      <aside className="reg-aside">
        <div className="eyebrow">Registration · 2026</div>
        <h1>Start with your <em>team</em>.</h1>
        <div className="gold-rule"/>
        <p className="lede">
          Three short steps. You can save any step and return — your
          group number unlocks the next one.
        </p>
        <Stepper items={items} active={flow} onPick={onFlow}/>
        <div className="reg-help">
          <div className="h">Stuck on something?</div>
          <p>
            Find an organiser in the Hub or email <a href="mailto:grandchallenges@exeter.ac.uk">grandchallenges@exeter.ac.uk</a>.
          </p>
        </div>
      </aside>

      <div className="reg-main">
        <div className="form-card">
          <div className="head">
            <div className="eyebrow"><span className="dash"/>{eyebrow}</div>
            <h2>{active.label}</h2>
            <p>
              {flow === "team"  && "Add your teammates, pick a Challenge, and tell us about your project. Your group number is assigned automatically."}
              {flow === "table" && "Claim a workspace for the duration of the hackathon. Dashed tiles are already taken."}
              {flow === "kit"   && "Borrow hardware from the Grand Challenges inventory. Pick the slot that suits your build."}
            </p>
          </div>
          <div className="body">
            {flow === "team"  && <TeamForm  onSubmit={onSubmit} toast={toast} onCancel={onCancel}/>}
            {flow === "table" && <TableForm onSubmit={onSubmit} toast={toast} onCancel={onCancel}/>}
            {flow === "kit"   && <KitForm   onSubmit={onSubmit} toast={toast} onCancel={onCancel}/>}
          </div>
        </div>
      </div>
    </main>
  );
}
window.RegistrationShell = RegistrationShell;
