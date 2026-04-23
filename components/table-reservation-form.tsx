"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/gc-toaster";

const ChevronDown = () => (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>);
const Check = ({ size = 14 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>);
const Loader = () => (<svg className="spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>);
const MapPin = () => (<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const ArrowRight = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
const AlertCircle = () => (<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>);

function GCSelect({ value, onChange, options, placeholder = "Select…", disabled, error }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string; reserved?: boolean }[];
  placeholder?: string; disabled?: boolean; error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
            <div key={o.value} className={`menu-item${o.reserved ? " reserved" : ""}${o.value === value ? " selected" : ""}`}
                 onClick={() => { if ((o as any).reserved) return; onChange(o.value); setOpen(false); }}>
              <span>{o.label}</span>
              {(o as any).reserved ? <span className="mono-hint">reserved</span>
                : o.value === value ? <Check size={14} /> : o.hint ? <span className="mono-hint">{o.hint}</span> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({ label, required, help, error, children }: {
  label?: string; required?: boolean; help?: React.ReactNode; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="field">
      {label && <label className="lbl"><span>{label}{required && <span className="req">*</span>}</span></label>}
      {children}
      {help && !error && <div className="field-help">{help}</div>}
      {error && <div className="field-error"><AlertCircle />{error}</div>}
    </div>
  );
}

export default function TableReservationForm() {
  const [teams, setTeams] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/teams"), fetch("/api/tables"), fetch("/api/challenges")])
      .then(async ([rt, rtbl, rc]) => {
        if (rt.ok) setTeams((await rt.json()).teams || []);
        if (rtbl.ok) setTables((await rtbl.json()).tables || []);
        if (rc.ok) setChallenges((await rc.json()).challenges || []);
        setIsLoading(false);
      }).catch(() => { toast({ variant: "danger", title: "Failed to load data." }); setIsLoading(false); });
  }, []);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const challengeName = selectedTeam?.challenge?.[0]
    ? (challenges.find(c => c.id === selectedTeam.challenge[0])?.name || "")
    : "";

  // Group tables by name prefix for zone display (if Name starts with number, zone is unknown)
  const zones = [...new Set(tables.map(t => (t.name?.match(/^[^0-9]*/)?.[0]?.trim()) || "General"))];

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!selectedTeamId) e.teamId = "Pick a team.";
    if (!selectedTableId) e.tableN = "Pick an available table.";
    setErrors(e);
    if (Object.keys(e).filter(k => e[k]).length) {
      toast({ variant: "danger", title: "Not quite ready.", sub: "Team and table are both required." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/table-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: selectedTeamId, tableId: selectedTableId }),
      });
      const data = await res.json();
      if (res.ok) {
        const tableName = tables.find(t => t.id === selectedTableId)?.name;
        toast({ variant: "success", title: "Table reserved!", sub: tableName });
        setSelectedTeamId(""); setSelectedTableId(""); setErrors({});
      } else {
        toast({ variant: "danger", title: "Error", sub: data.error || "Failed to reserve table." });
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
      <FormField label="Team" required error={errors.teamId}>
        <GCSelect value={selectedTeamId}
                  onChange={v => { setSelectedTeamId(v); setErrors(x => ({ ...x, teamId: "" })); }}
                  options={teams.map(t => ({ value: t.id, label: t.name, hint: t.group }))}
                  error={!!errors.teamId}
                  placeholder="Select your team" />
      </FormField>

      {selectedTeam && (
        <div className="summary">
          <div><div className="k">Project</div><div className="v">{selectedTeam.project || "—"}</div></div>
          <div><div className="k">Group</div><div className="v mono">{selectedTeam.group || "—"}</div></div>
          <div className="cell-full"><div className="k">Challenge</div><div className="v">{challengeName || "—"}</div></div>
        </div>
      )}

      <FormField label="Choose a table" required
                 help="Tables are first-come, first-served. Dashed tiles are already reserved."
                 error={errors.tableN}>
        {tables.length === 0 ? (
          <div style={{ color: "var(--ink-50)", fontStyle: "italic", fontSize: 14 }}>No tables found.</div>
        ) : (
          <>
            <div className="table-grid">
              {tables.map(t => (
                <button type="button" key={t.id}
                  className={`table-tile${selectedTableId === t.id ? " selected" : ""}${t.reserved ? " reserved" : ""}`}
                  disabled={t.reserved}
                  onClick={() => { setSelectedTableId(t.id); setErrors(x => ({ ...x, tableN: "" })); }}>
                  <div className="tag">{t.reserved ? "Taken" : selectedTableId === t.id ? "Selected" : ""}</div>
                  <div className="num">{t.name}</div>
                  <div className="loc">6 seats</div>
                </button>
              ))}
            </div>
            <div className="legend">
              <span><span className="swatch avail" />Available</span>
              <span><span className="swatch sel" />Your choice</span>
              <span><span className="swatch res" />Reserved</span>
            </div>
          </>
        )}
      </FormField>

      <div className="form-actions">
        <div className="left">
          {selectedTableId && <span className="badge badge-gold">{tables.find(t => t.id === selectedTableId)?.name} selected</span>}
        </div>
        <div className="right">
          <button type="submit" className="btn btn-primary" disabled={submitting || !selectedTeamId || !selectedTableId}>
            {submitting ? <><Loader /> Reserving…</> : <>Reserve table <ArrowRight /></>}
          </button>
        </div>
      </div>
    </form>
  );
}
