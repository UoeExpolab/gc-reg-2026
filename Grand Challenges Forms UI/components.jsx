// Icons — Lucide-style SVGs, 1.5 stroke
const I = {
  Check: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  X: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  ChevronDown: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  Loader: (p) => <svg xmlns="http://www.w3.org/2000/svg" className="spin" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>,
  User: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Users: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Plus: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Trash: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>,
  ArrowRight: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  ArrowLeft: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  AlertCircle: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  Calendar: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  MapPin: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Package: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  Cpu: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M20 9h2M20 14h2M2 9h2M2 14h2"/></svg>,
  Eye: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Printer: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Radio: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  Camera: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Sliders: (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>,
};
window.I = I;

// ---------- Button ----------
function Button({ variant = "primary", block, size, loading, disabled, children, type, ...rest }) {
  const cls = `btn btn-${variant}${block ? " block" : ""}${size === "lg" ? " lg" : ""}`;
  return (
    <button type={type || "button"} className={cls} disabled={disabled || loading} {...rest}>
      {loading && <I.Loader />}
      {children}
    </button>
  );
}
window.Button = Button;

// ---------- Badge ----------
function Badge({ variant = "default", dot, children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && <span className="dot"/>}
      {children}
    </span>
  );
}
window.Badge = Badge;

// ---------- FormField ----------
function FormField({ label, required, optional, help, helpAccent, error, children }) {
  return (
    <div className="field">
      {label && (
        <label className="lbl">
          <span>{label}{required && <span className="req">*</span>}</span>
          {optional && <span className="opt">Optional</span>}
        </label>
      )}
      {children}
      {help && !error && <div className={`field-help${helpAccent ? " accent" : ""}`}>{help}</div>}
      {error && <div className="field-error"><I.AlertCircle size={13}/>{error}</div>}
    </div>
  );
}
window.FormField = FormField;

// ---------- Select ----------
function Select({ value, onChange, options, placeholder = "Select…", disabled, error, renderOption }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const selected = options.find(o => o.value === value);
  return (
    <div className="select-wrap" ref={ref}>
      <button type="button" className={`select-trigger${open ? " open" : ""}${error ? " error" : ""}`} disabled={disabled} onClick={() => setOpen(o => !o)}>
        {selected ? <span>{selected.label}</span> : <span className="placeholder">{placeholder}</span>}
        <I.ChevronDown />
      </button>
      {open && (
        <div className="menu">
          {options.map(o => (
            <div key={o.value}
                 className={`menu-item${o.value === value ? " selected" : ""}${o.reserved ? " reserved" : ""}`}
                 onClick={() => { if (o.reserved) return; onChange(o.value); setOpen(false); }}>
              {renderOption ? renderOption(o) : <span>{o.label}</span>}
              {o.reserved ? <span className="mono-hint">reserved</span>
                : o.value === value ? <I.Check size={14}/> : (o.hint && <span className="mono-hint">{o.hint}</span>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
window.Select = Select;

// ---------- TopBar ----------
function TopBar({ onHome, active, onNav, liveRegs }) {
  return (
    <header className="topbar">
      <div className="mark" onClick={onHome}>
        <span className="uoe">University of Exeter</span>
        <span className="pipe">/</span>
        <span className="prog">Grand Challenges · 2026</span>
      </div>
      <div className="spacer"/>
      <nav className="nav">
        <a onClick={(e) => { e.preventDefault(); onNav("landing"); }} href="#"
           style={active === "landing" ? {color: "var(--exeter-gold)"} : {}}>Overview</a>
        <a onClick={(e) => { e.preventDefault(); onNav("register"); }} href="#"
           style={active === "register" ? {color: "var(--exeter-gold)"} : {}}>Register</a>
        <a href="#">Programme</a>
        <a href="#">Help</a>
      </nav>
      <span className="pill">
        <span className="dot"/>
        Live · {liveRegs} teams
      </span>
    </header>
  );
}
window.TopBar = TopBar;

// ---------- Team summary ----------
function TeamSummary({ team }) {
  if (!team) return null;
  return (
    <div className="summary">
      <div><div className="k">Project</div><div className="v">{team.project}</div></div>
      <div><div className="k">Group</div><div className="v mono">{team.group}</div></div>
      <div className="cell-full"><div className="k">Challenge</div><div className="v">{team.challenge}</div></div>
    </div>
  );
}
window.TeamSummary = TeamSummary;

// ---------- Toasts ----------
function ToastStack({ toasts, onClose }) {
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.variant || "info"}`} onClick={() => onClose(t.id)}>
          <div className="bar"/>
          <div style={{flex: 1}}>
            <div className="title">{t.title}</div>
            {t.sub && <div className="sub">{t.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
window.ToastStack = ToastStack;

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer">
      <div className="inner">
        <div className="brand">
          Grand Challenges
          <small>University of Exeter · 2026</small>
        </div>
        <div className="links">
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Accessibility</a>
          <a href="mailto:grandchallenges@exeter.ac.uk">grandchallenges@exeter.ac.uk</a>
        </div>
        <div className="fine">© 2026</div>
      </div>
    </footer>
  );
}
window.Footer = Footer;

// ---------- Stepper (aside) ----------
function Stepper({ items, active, onPick }) {
  const activeIdx = items.findIndex(it => it.value === active);
  return (
    <ol className="steps">
      {items.map((it, i) => {
        const state = i < activeIdx ? "done" : i === activeIdx ? "active" : "";
        return (
          <li key={it.value} className={state} onClick={() => onPick(it.value)}>
            <div className="marker">{state === "done" ? <I.Check size={12}/> : String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className="label">{it.label}</div>
              <div className="hint">{it.hint}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
window.Stepper = Stepper;
