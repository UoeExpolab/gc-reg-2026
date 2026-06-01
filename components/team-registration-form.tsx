"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/gc-toaster";
import { API_READ_HEADERS, fetchFormVerificationToken } from "@/lib/utils";

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
function GCSelect({ value, onChange, options, placeholder = "Select…", disabled, error, searchable }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find(o => o.value === value);
  const filteredOptions = searchable && query 
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())) 
    : options;

  return (
    <div className="select-wrap" ref={ref}>
      <button type="button" className={`select-trigger${open ? " open" : ""}${error ? " error" : ""}`}
              disabled={disabled} onClick={() => setOpen(o => !o)}>
        {selected ? <span>{selected.label}</span> : <span className="placeholder">{placeholder}</span>}
        <ChevronDown />
      </button>
      {open && (
        <div className="menu" style={searchable ? { display: 'flex', flexDirection: 'column', padding: 0 } : {}}>
          {searchable && (
            <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
              <input
                type="text"
                autoFocus
                className="input"
                style={{ width: '100%', padding: '6px 10px', minHeight: '32px' }}
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          )}
          <div style={searchable ? { maxHeight: '200px', overflowY: 'auto' } : {}}>
            {filteredOptions.length > 0 ? filteredOptions.map(o => (
              <div key={o.value} className={`menu-item${o.value === value ? " selected" : ""}`}
                   onClick={() => { onChange(o.value); setOpen(false); }}>
                <span>{o.label}</span>
                {o.value === value ? <Check size={14} /> : o.hint ? <span className="mono-hint">{o.hint}</span> : null}
              </div>
            )) : (
              <div className="menu-item" style={{ opacity: 0.5, pointerEvents: 'none' }}>No results</div>
            )}
          </div>
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

type StudentOption = {
  value: string;
  label: string;
  email: string;
  challengeIds: string[];
};

type StudentResponseItem = {
  id: string;
  name: string;
  email?: string;
  challengeIds?: string[];
};

export default function TeamRegistrationForm() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [challenges, setChallenges] = useState<{ id: string; name: string; abbreviation: string; enquiryGroups?: string[] }[]>([]);
  const [roster, setRoster] = useState<string[]>([]);
  const [pick, setPick] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [selectedEnquiryGroup, setSelectedEnquiryGroup] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    groupNumber: string;
    rosterIds: string[];
    printingEmail: string;
  } | null>(null);
  const [printingEmail, setPrintingEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formToken, setFormToken] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/students", { headers: API_READ_HEADERS }),
      fetch("/api/challenges", { headers: API_READ_HEADERS })
    ]).then(async ([rs, rc]) => {
      const token = await fetchFormVerificationToken();
      setFormToken(token);
      if (rs.ok) {
        const d = await rs.json();
        setStudents(((d.students || []) as StudentResponseItem[])
          .map(s => ({
            value: s.id,
            label: s.name,
            email: s.email || "",
            challengeIds: Array.isArray(s.challengeIds) ? s.challengeIds : [],
          }))
          .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" })));
      }
      if (rc.ok) {
        const d = await rc.json();
        setChallenges(d.challenges || []);
      }
      setIsLoading(false);
    }).catch(() => { toast({ variant: "danger", title: "Failed to load form data." }); setIsLoading(false); });
  }, []);

  const challengeObj = challenges.find(c => c.id === selectedChallengeId);
  const studentsForChallenge = selectedChallengeId
    ? students.filter(s => s.challengeIds.includes(selectedChallengeId))
    : [];
  const availableStudents = studentsForChallenge.filter(s => !roster.includes(s.value));

  const addStudent = () => {
    if (!pick) return;
    setRoster([...roster, pick]);
    setPick("");
    setSubmittedData(null);
    setErrors(e => ({ ...e, roster: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (roster.length === 0) e.roster = "Add at least one teammate.";
    if (!selectedChallengeId) e.challenge = "Pick a Challenge track.";
    if (challengeObj?.enquiryGroups && challengeObj.enquiryGroups.length > 0 && !selectedEnquiryGroup) {
      e.enquiryGroup = "Select an enquiry group.";
    }
    if (!printingEmail.trim()) {
      e.printingEmail = "Printing email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(printingEmail.trim())) {
      e.printingEmail = "Enter a valid email address.";
    }
    if (selectedChallengeId && roster.some(id => !studentsForChallenge.some(s => s.value === id))) {
      e.roster = "Only add students linked to this Challenge track.";
    }
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
      const currentFormToken = formToken || await fetchFormVerificationToken();
      if (!formToken) setFormToken(currentFormToken);

      const res = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-form-verification": currentFormToken
        },
        body: JSON.stringify({ 
          studentIds: roster, 
          challengeId: selectedChallengeId,
          printingEmail: printingEmail.trim(),
          ...(selectedEnquiryGroup && { enquiryGroup: selectedEnquiryGroup })
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmittedData({
          groupNumber: data.groupNumber,
          rosterIds: roster,
          printingEmail: printingEmail.trim()
        });
        toast({ variant: "success", title: "Team registered!", sub: `Check your email (and spam folder) for confirmation.` });
        setRoster([]); setPick(""); setSelectedChallengeId(""); setSelectedEnquiryGroup(""); setPrintingEmail(""); setErrors({});
        setFormToken(await fetchFormVerificationToken());
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

  const getPrintUsername = (groupName: string) => {
    const match = groupName.trim().match(/^([A-Za-z]+)\s*(\d+)$/i);
    if (!match) return groupName;
    const prefix = match[1].toUpperCase();
    const num = match[2];
    
    const map: Record<string, string> = {
      "CEE": "Climate",
      "DSR": "Defence",
      "EI": "Education Innovation",
      "FF": "Future Food",
      "MHEW": "Mental Health",
      "SI": "Social Inequality",
      "GCP": "Penryn"
    };
    
    return `${map[prefix] || prefix} ${num}`;
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submittedData && (
        <div className="team-confirmation" role="status" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg-muted)', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div className="k">Team Name</div>
              <div className="v" style={{ fontSize: '1.25rem' }}><strong>{submittedData.groupNumber}</strong></div>
            </div>
            <div>
              <div className="k">Print Details</div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                <div><strong>Username:</strong> {getPrintUsername(submittedData.groupNumber)}</div>
                <div><strong>Password:</strong> Pass</div>
                <div><strong>Email:</strong> {submittedData.printingEmail}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="k" style={{ marginBottom: '8px' }}>Team Members</div>
            <div className="roster" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              {submittedData.rosterIds.map((id, i) => {
                const s = students.find(x => x.value === id);
                return (
                  <div key={id} className="roster-row" style={{ padding: '8px 12px', borderBottom: i < submittedData.rosterIds.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="idx">{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="name"><strong>{s?.label}</strong></span>
                      {s?.email && <span style={{ fontSize: '12px', color: 'var(--ink-50)' }}>{s.email}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!submittedData && (
        <>
          <FormField label="Challenge" required
                 help={challengeObj ? <>Group prefix will be <strong>{challengeObj.abbreviation}</strong></> : undefined}
                 helpAccent={!!challengeObj}
                 error={errors.challenge}>
        <GCSelect value={selectedChallengeId}
                  onChange={v => {
                    setSelectedChallengeId(v);
                    setSelectedEnquiryGroup("");
                    setPick("");
                    setSubmittedData(null);
                    setRoster(current => current.filter(id => students.find(s => s.value === id)?.challengeIds.includes(v)));
                    setErrors(x => ({ ...x, challenge: "", roster: "", enquiryGroup: "" }));
                  }}
                  options={challenges.map(c => ({ value: c.id, label: c.name, hint: c.abbreviation }))}
                  error={!!errors.challenge}
                  placeholder="Pick a track" />
      </FormField>

      {challengeObj?.enquiryGroups && challengeObj.enquiryGroups.length > 0 && (
        <FormField label="Enquiry Group" required error={errors.enquiryGroup}>
          <GCSelect value={selectedEnquiryGroup}
                    onChange={v => {
                      setSelectedEnquiryGroup(v);
                      setErrors(x => ({ ...x, enquiryGroup: "" }));
                    }}
                    options={challengeObj.enquiryGroups.map(g => ({ value: g, label: g }))}
                    error={!!errors.enquiryGroup}
                    placeholder="Select an enquiry group" />
        </FormField>
      )}

      <FormField label="Printing Email" required error={errors.printingEmail} help="This email will be used for printing services.">
        <input 
          type="email" 
          className={`input${errors.printingEmail ? " error" : ""}`} 
          value={printingEmail} 
          onChange={e => {
            setPrintingEmail(e.target.value);
            setErrors(x => ({ ...x, printingEmail: "" }));
          }}
          placeholder="email@example.com"
        />
      </FormField>

      <FormField
        label={`Team members (${roster.length})`}
        required
        help={selectedChallengeId ? "Search is limited to students linked to the selected Challenge track." : "Pick a Challenge before adding students."}
        error={errors.roster}
      >
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
                  <button type="button" className="rm" onClick={() => { setRoster(roster.filter(x => x !== id)); setSubmittedData(null); }} aria-label="Remove">
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
                    placeholder={!selectedChallengeId ? "Pick a challenge first" : availableStudents.length ? "Find a student…" : "No available students for this challenge"}
                    disabled={!selectedChallengeId || availableStudents.length === 0}
                    searchable={true} />
          <button type="button" className="btn btn-secondary" disabled={!pick} onClick={addStudent}>
            <Plus /> Add
          </button>
        </div>
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
        </>
      )}
    </form>
  );
}
