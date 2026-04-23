"use client";
import { useState } from "react";
import TeamRegistrationForm from "@/components/team-registration-form";
import TableReservationForm from "@/components/table-reservation-form";
import BookingForm from "@/components/booking-form";

const TABS = [
  { value: "team",  label: "Register Team",  description: "Add teammates, pick a Challenge track, and tell us about your project." },
  { value: "table", label: "Reserve Table",  description: "Claim a workspace for the duration of the hackathon. Dashed tiles are already taken." },
  { value: "kit",   label: "Book Kit",       description: "Borrow hardware from the Grand Challenges inventory and pick a collection slot." },
];

export default function Home() {
  const [flow, setFlow] = useState("team");
  const active = TABS.find(t => t.value === flow)!;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px 96px" }}>
      {/* Page heading */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--exeter-sprig)", marginBottom: 10 }}>
          Registration · 2026
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 52px)", lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 600, margin: 0, color: "var(--ink)" }}>
          Grand <em style={{ fontStyle: "italic", color: "var(--exeter-sprig)", fontWeight: 500 }}>Challenges</em>
        </h1>
        <div style={{ width: 44, height: 2, background: "var(--exeter-gold)", marginTop: 18 }} />
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 0, borderBottom: "2px solid var(--ink-10)" }}>
        {TABS.map(t => (
          <button key={t.value} type="button"
            onClick={() => setFlow(t.value)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 24px", fontFamily: "var(--font-sans)",
              fontSize: 14, fontWeight: 600,
              color: flow === t.value ? "var(--exeter-green)" : "var(--ink-60)",
              borderBottom: flow === t.value ? "2px solid var(--exeter-green)" : "2px solid transparent",
              marginBottom: -2, transition: "all 150ms",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="form-card" style={{ marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <div className="head">
          <div className="eyebrow"><span className="dash" />{active.label}</div>
          <h2>{active.label}</h2>
          <p>{active.description}</p>
        </div>
        <div className="body">
          {flow === "team"  && <TeamRegistrationForm />}
          {flow === "table" && <TableReservationForm />}
          {flow === "kit"   && <BookingForm />}
        </div>
      </div>
    </main>
  );
}
