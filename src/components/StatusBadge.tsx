import { type EncounterStatus, statusLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const styles: Record<EncounterStatus, string> = {
  agendado: "bg-info/10 text-info border-info/20",
  produzido: "bg-primary/10 text-primary border-primary/20",
  pago: "bg-success/15 text-success border-success/25",
  parcial: "bg-warning/15 text-warning-foreground border-warning/30",
  glosado: "bg-destructive/10 text-destructive border-destructive/25",
};

export function StatusBadge({ status }: { status: EncounterStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
