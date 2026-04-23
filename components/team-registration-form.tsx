"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/gc-toaster";

// --- Inline SVG icons ---
const ChevronDown = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
);
const Check = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);
const Loader = () => (
  <svg className="spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
);
const XIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
);
const Plus = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);
const ArrowRight = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);
const AlertCircle = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
);

// --- GC Select component ---
function GCSelect({ value, onChange, options, placeholder = "Select…", disabled, error }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const selected = options.find(o => o.value === value);
  return (
    <div className="select-wrap" ref={ref}>
      <button type="button" className={`select-trigger${open ? " open" : ""}${error ? " error" : ""}`}
              disabled={disabled} onClick={() => setOpen(o => !o)}>
        {selected ? <span>{selected.label}</span> : <span className="placeholder">{placeholder}</span>}
        <ChevronDown />
      </button>
      {open && (
        <div className="menu">
          {options.map(o => (
            <div key={o.value} className={`menu-item${o.value === value ? " selected" : ""}`}
                 onClick={() => { onChange(o.value); setOpen(false); }}>
              <span>{o.label}</span>
              {o.value === value ? <Check size={14} /> : o.hint ? <span className="mono-hint">{o.hint}</span> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- FormField wrapper ---
function FormField({ label, required, optional, help, helpAccent, error, children }: {
  label?: string; required?: boolean; optional?: boolean;
  help?: React.ReactNode; helpAccent?: boolean; error?: string; children: React.ReactNode;
}) {
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
      {error && <div className="field-error"><AlertCircle />{error}</div>}
    </div>
  );
}

export default function TeamRegistrationForm() {
  const [students, setStudents] = useState<{ value: string; label: string }[]>([]);
  const [challenges, setChallenges] = useState<{ id: string; name: string; abbreviation: string }[]>([]);
  const [roster, setRoster] = useState<string[]>([]);
  const [pick, setPick] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/students"), fetch("/api/challenges")]).then(async ([rs, rc]) => {
      if (rs.ok) {
        const d = await rs.json();
        setStudents((d.students || []).map((s: any) => ({ value: s.id, label: s.name })));
      }
      if (rc.ok) {
        const d = await rc.json();
        setChallenges(d.challenges || []);
      }
      setIsLoading(false);
    }).catch(() => { toast({ variant: "danger", title: "Failed to load form data." }); setIsLoading(false); });
  }, []);

  const challengeObj = challenges.find(c => c.id === selectedChallengeId);
  const availableStudents = students.filter(s => !roster.includes(s.value));

  const addStudent = () => {
    if (!pick) return;
    setRoster([...roster, pick]);
    setPick("");
    setErrors(e => ({ ...e, roster: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!teamName.trim()) e.teamName = "Give your team a name.";
    if (roster.length === 0) e.roster = "Add at least one teammate.";
    if (!selectedChallengeId) e.challenge = "Pick a Challenge track.";
    if (!projectName.trim()) e.projectName = "What are you building?";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).filter(k => e[k]).length) {
      toast({ variant: "danger", title: "Something's missing.", sub: "Check the highlighted fields." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, studentIds: roster, challengeId: selectedChallengeId, projectName, projectDescription: projectDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ variant: "success", title: "Team registered!", sub: `Group ${data.groupNumber} created.` });
        setTeamName(""); setRoster([]); setPick(""); setSelectedChallengeId(""); setProjectName(""); setProjectDesc(""); setErrors({});
      } else {
        toast({ variant: "danger", title: "Error", sub: data.error || "Failed to register team." });
      }
    } catch {
      toast({ variant: "danger", title: "Network error.", sub: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-50)" }}><Loader /></div>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-row">
        <FormField label="Team name" required error={errors.teamName}>
          <input className={`input${errors.teamName ? " error" : ""}`}
                 value={teamName}
                 onChange={e => { setTeamName(e.target.value); setErrors(x => ({ ...x, teamName: "" })); }}
                 placeholder="The Kelpies" />
        </FormField>
        <FormField label="Challenge" required
                   help={challengeObj ? <>Group prefix will be <strong>{challengeObj.abbreviation}</strong></> : "Five tracks, one team."}
                   helpAccent={!!challengeObj}
                   error={errors.challenge}>
          <GCSelect value={selectedChallengeId}
                    onChange={v => { setSelectedChallengeId(v); setErrors(x => ({ ...x, challenge: "" })); }}
                    options={challenges.map(c => ({ value: c.id, label: c.name, hint: c.abbreviation }))}
                    error={!!errors.challenge}
                    placeholder="Pick a track" />
        </FormField>
      </div>

      <FormField label={`Team members (${roster.length})`} required help="Select everyone who will be on this team." error={errors.roster}>
        {roster.length === 0 ? (
          <div className="roster-empty">No team members yet — add someone below.</div>
        ) : (
          <div className="roster">
            {roster.map((id, i) => {
              const s = students.find(x => x.value === id);
              return (
                <div key={id} className={`roster-row`}>
                  <div className="idx">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <span className="name">{s?.label}</span>
                  </div>
                  <button type="button" className="rm" onClick={() => setRoster(roster.filter(x => x !== id))} aria-label="Remove">
                    <XIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginTop: 8 }}>
          <GCSelect value={pick} onChange={setPick}
                    options={availableStudents}
                    placeholder={availableStudents.length ? "Find a student…" : "Everyone's on the team"}
                    disabled={availableStudents.length === 0} />
          <button type="button" className="btn btn-secondary" disabled={!pick} onClick={addStudent}>
            <Plus /> Add
          </button>
        </div>
      </FormField>

      <FormField label="Project name" required error={errors.projectName}>
        <input className={`input${errors.projectName ? " error" : ""}`}
               value={projectName}
               onChange={e => { setProjectName(e.target.value); setErrors(x => ({ ...x, projectName: "" })); }}
               placeholder="Urban foraging map" />
      </FormField>

      <FormField label="Project description" optional help={`${projectDesc.length}/400 · What are you building, and why does it matter?`}>
        <textarea value={projectDesc} maxLength={400}
                  onChange={e => setProjectDesc(e.target.value)}
                  placeholder="A few sentences on what you're making and who it's for…" />
      </FormField>

      <div className="form-actions">
        <div className="left">
          <span className="badge badge-outline"><span className="dot" />Draft · not yet submitted</span>
        </div>
        <div className="right">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <><Loader /> Registering…</> : <>Register team <ArrowRight /></>}
          </button>
        </div>
      </div>
    </form>
  );
}
