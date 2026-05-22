"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/gc-toaster";
import { generateFormVerificationToken } from "@/lib/utils";

const ChevronDown = () => (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>);
const Check = ({ size = 14 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>);
const Loader = () => (<svg className="spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>);
const ArrowRight = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
const AlertCircle = () => (<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>);
const PackageIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>);

function GCSelect({ value, onChange, options, placeholder = "Select…", disabled, error }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
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

interface InventoryItem { id: string; name: string; total: number; }
interface TimeSlot { id: string; name: string; remainingAvailable?: number; }
interface Team {
  id: string;
  name: string;
  project?: string;
  group?: string;
  challenge?: string[];
}
interface Challenge {
  id: string;
  name: string;
}

function getTeamOptionLabel(team: Team) {
  const group = team.group || team.name;
  return team.project && team.project !== group ? `${group} · ${team.project}` : group;
}

function formatUnitCount(count: number) {
  return `${count} ${count === 1 ? "unit" : "units"} available`;
}

export default function BookingForm() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formToken, setFormToken] = useState(() => generateFormVerificationToken());

  useEffect(() => {
    Promise.all([fetch("/api/teams"), fetch("/api/inventory"), fetch("/api/challenges")])
      .then(async ([rt, ri, rc]) => {
        if (rt.ok) setTeams((await rt.json()).teams || []);
        if (ri.ok) {
          const inventoryData = ((await ri.json()).inventory || []) as InventoryItem[];
          setInventory(
            inventoryData
              .map(item => ({ ...item, total: Number(item.total || 0) }))
              .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
          );
        }
        if (rc.ok) setChallenges((await rc.json()).challenges || []);
        setIsLoadingForm(false);
      }).catch(() => { toast({ variant: "danger", title: "Failed to load data." }); setIsLoadingForm(false); });
  }, []);

  useEffect(() => {
    if (selectedInventoryIds.length === 0) return;
    const id = setTimeout(async () => {
      setIsLoadingSlots(true);
      setSelectedTimeSlotId("");
      setTimeSlots([]);
      try {
        const res = await fetch(`/api/availability?itemIds=${selectedInventoryIds.join(",")}`);
        if (res.ok) setTimeSlots((await res.json()).availableTimeSlots || []);
      } catch { toast({ variant: "danger", title: "Error checking availability." }); }
      finally { setIsLoadingSlots(false); }
    }, 300);
    return () => clearTimeout(id);
  }, [selectedInventoryIds]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const selectedChallengeId = selectedTeam?.challenge?.[0];
  const challengeName = selectedChallengeId
    ? (challenges.find(c => c.id === selectedChallengeId)?.name || "") : "";

  const toggleKit = (id: string) => {
    const next = selectedInventoryIds.includes(id) ? [] : [id];

    setSelectedInventoryIds(next);
    setTimeSlots([]);
    setSelectedTimeSlotId("");
    setErrors(x => ({ ...x, kits: "", slot: "" }));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!selectedTeamId) e.teamId = "Pick a team.";
    if (selectedInventoryIds.length === 0) e.kits = "Pick at least one item.";
    if (!selectedTimeSlotId) e.slot = "Pick a time slot.";
    setErrors(e);
    if (Object.keys(e).filter(k => e[k]).length) {
      toast({ variant: "danger", title: "Almost there.", sub: "Check the highlighted fields." });
      return;
    }
    setSubmitting(true);
    try {
      const requestHeaders = {
        "Content-Type": "application/json",
        "x-form-verification": formToken
      };
      const reservationPayload = {
        teamId: selectedTeamId,
        inventoryIds: selectedInventoryIds,
        timeSlotId: selectedTimeSlotId,
        quantityRequested: 1
      };
      const availabilityRes = await fetch("/api/check-availability", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(reservationPayload),
      });
      const availabilityData = await availabilityRes.json().catch(() => ({}));

      if (!availabilityRes.ok) {
        const message = availabilityData.error || "Unable to verify availability. Please try again.";
        setErrors(x => ({ ...x, slot: message }));
        toast({ variant: "danger", title: "Could not check availability.", sub: message });
        return;
      }

      if (!availabilityData.available) {
        const message = availabilityData.error || "Not enough units available for this time slot.";
        setErrors(x => ({ ...x, slot: message }));
        toast({ variant: "danger", title: "Not enough units available", sub: message });
        return;
      }

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(reservationPayload),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ variant: "success", title: "Kit reserved!", sub: `${selectedInventoryIds.length} item${selectedInventoryIds.length > 1 ? "s" : ""} reserved.` });
        setSelectedTeamId(""); setSelectedInventoryIds([]); setSelectedTimeSlotId(""); setErrors({});
        // Generate new token for next submission
        setFormToken(generateFormVerificationToken());
      } else {
        if (res.status === 409 && data.error) {
          setErrors(x => ({ ...x, slot: data.error }));
        }
        toast({ variant: "danger", title: "Error", sub: data.error || "Failed to reserve kit." });
      }
    } catch {
      toast({ variant: "danger", title: "Network error.", sub: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingForm) return <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-50)" }}><Loader /></div>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Team" required error={errors.teamId}>
        <GCSelect value={selectedTeamId}
                  onChange={v => { setSelectedTeamId(v); setErrors(x => ({ ...x, teamId: "" })); }}
                  options={teams.map(t => ({ value: t.id, label: getTeamOptionLabel(t), hint: t.group }))}
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

      <FormField label="Inventory" required
                 help="Choose one kit item."
                 error={errors.kits}>
        <div className="kit-list">
          {inventory.map(item => {
            const selected = selectedInventoryIds.includes(item.id);
            return (
              <div key={item.id} className={`kit-card${selected ? " selected" : ""}`} onClick={() => toggleKit(item.id)}>
                <div className="ico"><PackageIcon /></div>
                <div className="main">
                  <div className="title">{item.name}</div>
                  <div className="sub">{formatUnitCount(item.total)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </FormField>

      <FormField label="Time slot" required
                 help={selectedInventoryIds.length === 0 ? "Pick items first to see availability." : isLoadingSlots ? "Checking availability…" : "Your kit is reserved for the duration of this block."}
                 error={errors.slot}>
        {isLoadingSlots ? (
          <div style={{ padding: "20px 0", color: "var(--ink-50)" }}><Loader /></div>
        ) : timeSlots.length === 0 && selectedInventoryIds.length > 0 ? (
          <div style={{ color: "var(--ink-50)", fontStyle: "italic", fontSize: 14, padding: "12px 0" }}>No available slots for these items.</div>
        ) : (
          <div className="slots">
            {timeSlots.map(s => (
              <button type="button" key={s.id}
                      className={`slot-tile${selectedTimeSlotId === s.id ? " selected" : ""}`}
                      disabled={selectedInventoryIds.length === 0}
                      onClick={() => { setSelectedTimeSlotId(s.id); setErrors(x => ({ ...x, slot: "" })); }}>
                <div className="day">{s.name}</div>
                <div className="avail">{typeof s.remainingAvailable === "number" ? formatUnitCount(s.remainingAvailable) : "Available"}</div>
              </button>
            ))}
          </div>
        )}
      </FormField>

      <div className="form-actions">
        <div className="left" />
        <div className="right">
          <button type="submit" className="btn btn-primary"
                  disabled={submitting || !selectedTeamId || selectedInventoryIds.length === 0 || !selectedTimeSlotId}>
            {submitting ? <><Loader /> Reserving…</> : <>Reserve kit <ArrowRight /></>}
          </button>
        </div>
      </div>
    </form>
  );
}
