import { FormPageShell } from "@/components/form-page-shell";
import BookingForm from "@/components/booking-form";

export default function KitPage() {
  return (
    <FormPageShell
      eyebrow="Registration · 2026"
      title="Book Kit"
    >
      <BookingForm />
    </FormPageShell>
  );
}
