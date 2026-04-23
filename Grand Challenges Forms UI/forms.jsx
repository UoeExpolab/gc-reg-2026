// ---------- Fake data ----------
const DATA = {
  students: [
    { value: "s1", label: "Aisha Patel", school: "Engineering" },
    { value: "s2", label: "Ben Okafor", school: "Computer Science" },
    { value: "s3", label: "Chloe Williams", school: "Geography" },
    { value: "s4", label: "Dmitri Vasin", school: "Physics" },
    { value: "s5", label: "Elena Rossi", school: "Biosciences" },
    { value: "s6", label: "Finn Harrison", school: "Psychology" },
    { value: "s7", label: "Grace Nakamura", school: "Engineering" },
    { value: "s8", label: "Hamza El-Sayed", school: "Medicine" },
    { value: "s9", label: "Isla Fraser", school: "Classics" },
    { value: "s10", label: "Jamal Adeyemi", school: "Business" },
  ],
  challenges: [
    { value: "sus", label: "Sustainability & Climate", abbr: "SUS", num: "01",
      blurb: "Build for a warming planet — food systems, carbon, circular design." },
    { value: "hea", label: "Health & Wellbeing", abbr: "HEA", num: "02",
      blurb: "Mental health, accessibility, public-health technology, ageing well." },
    { value: "cli", label: "Coastal Futures", abbr: "CLI", num: "03",
      blurb: "Coastal resilience, marine ecology, oceans in the age of change." },
    { value: "ai",  label: "AI & Society", abbr: "AI",  num: "04",
      blurb: "Trustworthy AI, ethics, governance, tools for knowledge work." },
    { value: "her", label: "Heritage Futures", abbr: "HER", num: "05",
      blurb: "Memory, place, archives — designing for deep time." },
  ],
  tables: [
    { n: 1,  zone: "Forum" },        { n: 2,  zone: "Forum" },
    { n: 3,  zone: "Forum" },        { n: 4,  zone: "Forum", reserved: true },
    { n: 5,  zone: "Forum" },        { n: 6,  zone: "Forum" },
    { n: 7,  zone: "Amory" },        { n: 8,  zone: "Amory" },
    { n: 9,  zone: "Amory", reserved: true },
    { n: 10, zone: "Amory" },        { n: 11, zone: "Amory" },
    { n: 12, zone: "Harrison" },     { n: 13, zone: "Harrison" },
    { n: 14, zone: "Harrison" },     { n: 15, zone: "Harrison" },
    { n: 16, zone: "Harrison", reserved: true },
  ],
  kits: [
    { value: "k1", label: "Raspberry Pi sensor kit", sub: "4 boards · temp / humidity / air quality", icon: "Cpu" },
    { value: "k2", label: "Meta Quest 3 VR",          sub: "Headset + controllers · 8 available",     icon: "Eye" },
    { value: "k3", label: "Arduino starter pack",     sub: "Uno + components · 12 available",         icon: "Cpu" },
    { value: "k4", label: "Prusa MK4 3D printer",     sub: "PLA filament included · 2 available",     icon: "Printer" },
    { value: "k5", label: "LiDAR field scanner",      sub: "Handheld · 1 available",                  icon: "Radio" },
    { value: "k6", label: "GoPro Hero 12",            sub: "4K video · 5 available",                  icon: "Camera" },
  ],
  slots: [
    { value: "ts1", day: "Fri 14 Sept", hrs: "09:00–13:00", avail: 8 },
    { value: "ts2", day: "Fri 14 Sept", hrs: "13:00–17:00", avail: 3 },
    { value: "ts3", day: "Sat 15 Sept", hrs: "09:00–13:00", avail: 6 },
    { value: "ts4", day: "Sat 15 Sept", hrs: "13:00–17:00", avail: 0 },
    { value: "ts5", day: "Sun 16 Sept", hrs: "09:00–13:00", avail: 12 },
    { value: "ts6", day: "Sun 16 Sept", hrs: "13:00–17:00", avail: 10 },
  ],
  teams: [
    { value: "team1", label: "The Kelpies",        project: "Urban foraging map", group: "SUS-14", challenge: "Sustainability & Climate" },
    { value: "team2", label: "Neural Narwhals",    project: "AI ethics chatbot",  group: "AI-07",  challenge: "AI & Society" },
    { value: "team3", label: "Tidal",              project: "Rockpool atlas",     group: "CLI-22", challenge: "Coastal Futures" },
    { value: "team4", label: "Thistle & Thorn",    project: "Elder-care companion", group: "HEA-09", challenge: "Health & Wellbeing" },
  ],
};
window.DATA = DATA;

// ---------- Team form (rich roster, editorial) ----------
function TeamForm({ onSubmit, toast, onCancel }) {
  const [roster, setRoster] = React.useState([]);
  const [pick, setPick] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const [challenge, setChallenge] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projectDesc, setProjectDesc] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const challengeObj = DATA.challenges.find(c => c.value === challenge);

  const availableStudents = DATA.students.filter(s => !roster.includes(s.value));

  const addStudent = () => {
    if (!pick) return;
    setRoster([...roster, pick]);
    setPick("");
    setErrors(e => ({ ...e, roster: null }));
  };
  const removeStudent = (v) => setRoster(roster.filter(x => x !== v));

  const validate = () => {
    const e = {};
    if (!teamName.trim()) e.teamName = "Give your team a name.";
    if (roster.length < 2) e.roster = "Add at least 2 teammates.";
    if (!challenge) e.challenge = "Pick a Challenge track.";
    if (!projectName.trim()) e.projectName = "What are you building?";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast({ variant: "danger", title: "Something's missing.", sub: "Check the highlighted fields below." });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const groupNum = `${challengeObj.abbr}-${String(Math.floor(Math.random() * 30) + 10)}`;
      onSubmit({ kind: "team", groupNumber: groupNum, teamName, projectName, challenge: challengeObj.label });
    }, 900);
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="field-row">
        <FormField label="Team name" required error={errors.teamName}>
          <input className={`input${errors.teamName ? " error" : ""}`}
                 value={teamName}
                 onChange={e => { setTeamName(e.target.value); setErrors(x => ({...x, teamName: null})); }}
                 placeholder="The Kelpies"/>
        </FormField>
        <FormField label="Challenge" required
                   help={challengeObj ? <>Group prefix will be <strong>{challengeObj.abbr}</strong></> : "Five tracks, one team."}
                   helpAccent={!!challengeObj}
                   error={errors.challenge}>
          <Select value={challenge}
                  onChange={(v) => { setChallenge(v); setErrors(x => ({...x, challenge: null})); }}
                  options={DATA.challenges.map(c => ({ ...c, hint: c.abbr }))}
                  error={!!errors.challenge}
                  placeholder="Pick a track"/>
        </FormField>
      </div>

      <FormField label={`Teammates (${roster.length})`} required
                 help="The first person you add becomes team lead."
                 error={errors.roster}>
        {roster.length === 0 ? (
          <div className="roster-empty">No teammates yet — add yourself first.</div>
        ) : (
          <div className="roster">
            {roster.map((id, i) => {
              const s = DATA.students.find(x => x.value === id);
              return (
                <div key={id} className={`roster-row${i === 0 ? " lead" : ""}`}>
                  <div className="idx">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <span className="name">{s.label}</span>
                    <span className={`role${i === 0 ? " lead" : ""}`}>{i === 0 ? "Lead" : s.school}</span>
                  </div>
                  <button type="button" className="rm" onClick={() => removeStudent(id)} aria-label="Remove">
                    <I.X size={14}/>
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div style={{display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginTop: 8}}>
          <Select value={pick} onChange={setPick}
                  options={availableStudents}
                  placeholder={availableStudents.length ? "Find a student…" : "Everyone's on the team"}
                  disabled={availableStudents.length === 0}/>
          <Button variant="secondary" disabled={!pick} onClick={addStudent}>
            <I.Plus size={14}/> Add
          </Button>
        </div>
      </FormField>

      <FormField label="Project name" required error={errors.projectName}>
        <input className={`input${errors.projectName ? " error" : ""}`}
               value={projectName}
               onChange={e => { setProjectName(e.target.value); setErrors(x => ({...x, projectName: null})); }}
               placeholder="Urban foraging map"/>
      </FormField>

      <FormField label="Project description" optional
                 help={`${projectDesc.length}/400 · What are you building, and why does it matter?`}>
        <textarea value={projectDesc}
                  maxLength={400}
                  onChange={e => setProjectDesc(e.target.value)}
                  placeholder="A few sentences on what you're making and who it's for…"/>
      </FormField>

      <div className="form-actions">
        <div className="left">
          <Badge variant="outline" dot>Draft · not yet submitted</Badge>
        </div>
        <div className="right">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" loading={submitting} disabled={submitting}>
            {submitting ? "Registering…" : <>Register team <I.ArrowRight size={14}/></>}
          </Button>
        </div>
      </div>
    </form>
  );
}
window.TeamForm = TeamForm;

// ---------- Table form (visual grid picker) ----------
function TableForm({ onSubmit, toast, onCancel }) {
  const [teamId, setTeamId] = React.useState("");
  const [tableN, setTableN] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const team = DATA.teams.find(t => t.value === teamId);
  const zones = [...new Set(DATA.tables.map(t => t.zone))];

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!teamId) e.teamId = "Pick a team.";
    if (!tableN) e.tableN = "Pick an available table.";
    setErrors(e);
    if (Object.keys(e).length) {
      toast({ variant: "danger", title: "Not quite ready.", sub: "Team and table are both required." });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const tbl = DATA.tables.find(t => t.n === tableN);
      onSubmit({
        kind: "table",
        tableName: `Table ${String(tableN).padStart(2, "0")} · ${tbl.zone}`,
        teamName: team.label, groupNumber: team.group
      });
    }, 800);
  };

  return (
    <form onSubmit={submit} noValidate>
      <FormField label="Team" required error={errors.teamId}>
        <Select value={teamId}
                onChange={(v) => { setTeamId(v); setErrors(x => ({...x, teamId: null})); }}
                options={DATA.teams.map(t => ({ ...t, hint: t.group }))}
                error={!!errors.teamId}
                placeholder="Select your team"/>
      </FormField>

      {team && <TeamSummary team={team}/>}

      <FormField label="Choose a table" required
                 help="Tables are first-come, first-served. Dashed tiles are already reserved."
                 error={errors.tableN}>
        {zones.map(zone => (
          <div key={zone} style={{marginBottom: 16}}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--ink-60)", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <I.MapPin size={11}/>{zone}
              <span style={{flex: 1, height: 1, background: "var(--ink-10)"}}/>
            </div>
            <div className="table-grid">
              {DATA.tables.filter(t => t.zone === zone).map(t => (
                <button type="button" key={t.n}
                  className={`table-tile${tableN === t.n ? " selected" : ""}${t.reserved ? " reserved" : ""}`}
                  disabled={t.reserved}
                  onClick={() => { setTableN(t.n); setErrors(x => ({...x, tableN: null})); }}>
                  <div className="tag">{t.reserved ? "Taken" : (tableN === t.n ? "Selected" : `0${t.n}`.slice(-2))}</div>
                  <div className="num">Table {String(t.n).padStart(2, "0")}</div>
                  <div className="loc">{zone} · 6 seats</div>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="legend">
          <span><span className="swatch avail"/>Available</span>
          <span><span className="swatch sel"/>Your choice</span>
          <span><span className="swatch res"/>Reserved</span>
        </div>
      </FormField>

      <div className="form-actions">
        <div className="left">
          {tableN && <Badge variant="gold">Table {String(tableN).padStart(2, "0")} selected</Badge>}
        </div>
        <div className="right">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" loading={submitting} disabled={submitting}>
            {submitting ? "Reserving…" : <>Reserve table <I.ArrowRight size={14}/></>}
          </Button>
        </div>
      </div>
    </form>
  );
}
window.TableForm = TableForm;

// ---------- Kit form (card list + slot tiles) ----------
function KitForm({ onSubmit, toast, onCancel }) {
  const [teamId, setTeamId] = React.useState("");
  const [kits, setKits] = React.useState([]);
  const [slot, setSlot] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const team = DATA.teams.find(t => t.value === teamId);
  const toggleKit = (v) => {
    setKits(ks => ks.includes(v) ? ks.filter(x => x !== v) : [...ks, v]);
    setErrors(x => ({ ...x, kits: null }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!teamId) e.teamId = "Pick a team.";
    if (kits.length === 0) e.kits = "Pick at least one item.";
    if (!slot) e.slot = "Pick a time slot.";
    setErrors(e);
    if (Object.keys(e).length) {
      toast({ variant: "danger", title: "Almost there.", sub: "Check the highlighted fields." });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const slotObj = DATA.slots.find(s => s.value === slot);
      onSubmit({
        kind: "kit",
        kitCount: kits.length,
        slot: `${slotObj.day} · ${slotObj.hrs}`,
        groupNumber: team.group
      });
    }, 800);
  };

  return (
    <form onSubmit={submit} noValidate>
      <FormField label="Team" required error={errors.teamId}>
        <Select value={teamId}
                onChange={(v) => { setTeamId(v); setErrors(x => ({...x, teamId: null})); }}
                options={DATA.teams.map(t => ({ ...t, hint: t.group }))}
                error={!!errors.teamId}
                placeholder="Select your team"/>
      </FormField>

      {team && <TeamSummary team={team}/>}

      <FormField label={`Inventory (${kits.length} selected)`} required
                 help="Tap to add. You can mix and match across categories."
                 error={errors.kits}>
        <div className="kit-list">
          {DATA.kits.map(k => {
            const selected = kits.includes(k.value);
            const Icon = I[k.icon] || I.Package;
            return (
              <div key={k.value} className={`kit-card${selected ? " selected" : ""}`}
                   onClick={() => toggleKit(k.value)}>
                <div className="ico"><Icon size={20}/></div>
                <div className="main">
                  <div className="title">{k.label}</div>
                  <div className="sub">{k.sub}</div>
                </div>
                <div className="check">{selected && <I.Check size={14}/>}</div>
              </div>
            );
          })}
        </div>
      </FormField>

      <FormField label="Time slot" required
                 help={kits.length === 0 ? "Pick items first to see availability." : "Your kit is reserved for the duration of this block."}
                 error={errors.slot}>
        <div className="slots">
          {DATA.slots.map(s => {
            const disabled = kits.length === 0 || s.avail === 0;
            return (
              <button type="button" key={s.value}
                      className={`slot-tile${slot === s.value ? " selected" : ""}`}
                      disabled={disabled}
                      onClick={() => { setSlot(s.value); setErrors(x => ({...x, slot: null})); }}>
                <div className="day">{s.day}</div>
                <div className="hrs">{s.hrs}</div>
                <div className="avail">{s.avail === 0 ? "Full" : `${s.avail} slots open`}</div>
              </button>
            );
          })}
        </div>
      </FormField>

      <div className="form-actions">
        <div className="left">
          {kits.length > 0 && <Badge variant="sprig" dot>{kits.length} item{kits.length > 1 ? "s" : ""} in bundle</Badge>}
        </div>
        <div className="right">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" loading={submitting} disabled={submitting}>
            {submitting ? "Reserving…" : <>Reserve kit <I.ArrowRight size={14}/></>}
          </Button>
        </div>
      </div>
    </form>
  );
}
window.KitForm = KitForm;

// ---------- Success panel ----------
function SuccessPanel({ result, onReturnHome, onRegisterAnother }) {
  const title =
    result.kind === "team"  ? <>Team <em>registered</em></> :
    result.kind === "table" ? <>Table <em>reserved</em></> :
                              <>Kit <em>reserved</em></>;
  const eyebrow =
    result.kind === "team"  ? "Step one · complete" :
    result.kind === "table" ? "Step two · complete" :
                              "Step three · complete";

  return (
    <div className="success-panel">
      <img className="flourish tl" src="assets/botanical-flourish.svg"/>
      <img className="flourish br" src="assets/botanical-flourish.svg"/>
      <div className="tick"><I.Check size={28}/></div>
      <div className="eyebrow">
        <span className="rule"/>{eyebrow}<span className="rule"/>
      </div>
      <h1 className="title">{title}</h1>

      {result.kind === "team" && (<>
        <div className="group-display">
          <span className="k">Group number</span>
          <span className="v">{result.groupNumber}</span>
        </div>
        <p className="sub">
          You'll need this to book a table and reserve kit.
          We've emailed a copy to your team lead.
        </p>
      </>)}

      {result.kind === "table" && (
        <p className="sub">
          <strong>{result.teamName}</strong> <span className="mono">{result.groupNumber}</span> is
          booked into <strong>{result.tableName}</strong> for the duration of Grand Challenges.
        </p>
      )}

      {result.kind === "kit" && (
        <p className="sub">
          <strong>{result.kitCount} item{result.kitCount > 1 ? "s" : ""}</strong> reserved
          for <span className="mono">{result.groupNumber}</span> · {result.slot}.
          Collection is in the Hub, ground floor.
        </p>
      )}

      <div className="actions">
        <Button variant="on-green" onClick={onRegisterAnother}>
          {result.kind === "team" ? <>Reserve a table <I.ArrowRight size={14}/></> :
           result.kind === "table" ? <>Book a kit <I.ArrowRight size={14}/></> :
                                     "Back to overview"}
        </Button>
        <Button variant="outline-green" onClick={onReturnHome}>Overview</Button>
      </div>
    </div>
  );
}
window.SuccessPanel = SuccessPanel;
