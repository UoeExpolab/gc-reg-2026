import { FormPageShell } from "@/components/form-page-shell";
import TableReservationForm from "@/components/table-reservation-form";

export const dynamic = "force-dynamic";

export default function TablePage() {
  return (
    <FormPageShell
      eyebrow="Registration · 2026"
      title="Reserve Table"
    >
      <TableReservationForm />
    </FormPageShell>
  );
}
