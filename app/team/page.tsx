import { FormPageShell } from "@/components/form-page-shell";
import TeamRegistrationForm from "@/components/team-registration-form";

export default function TeamPage() {
  return (
    <FormPageShell
      eyebrow="Registration · 2026"
      title="Register Team"
    >
      <TeamRegistrationForm />
    </FormPageShell>
  );
}
