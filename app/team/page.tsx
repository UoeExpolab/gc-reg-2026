import { FormPageShell } from "@/components/form-page-shell";
import TeamRegistrationForm from "@/components/team-registration-form";

export default function TeamPage() {
  return (
    <FormPageShell
      eyebrow="Registration · 2026"
      title="Register Team"
      description="Add teammates, pick a Challenge track, and tell us about your project."
    >
      <TeamRegistrationForm />
    </FormPageShell>
  );
}
