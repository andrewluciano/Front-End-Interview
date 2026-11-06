import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  formatBRL,
  formatMoneyInput,
  maskMoneyInput,
  parseBRL,
  type EncounterStatus,
  statusLabels,
} from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronsUpDown,
  Search,
  Plus,
  Trash2,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  clearPendingOpenEncounter,
  takePendingOpenEncounter,
} from "@/lib/open-encounter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/app/trabalho")({
  component: Trabalho,
  head: () => ({ meta: [{ title: "Meu trabalho — Fatura Viva" }] }),
});

const filters: ("todos" | EncounterStatus)[] = [
  "todos",
  "agendado",
  "produzido",
  "pago",
  "parcial",
  "glosado",
];

type ApiEncontroStatus =
  | "agendado"
  | "produzido"
  | "pago"
  | "glosado_total"
  | "glosado_parcialmente";

type ApiEncontro = {
  id: string;
  status: ApiEncontroStatus;
  nome_paciente?: string | null;
  convenio_utilizado?: string | null;
  numero_guia_convenio?: string | null;
  nome_procedimento?: string | null;
  observacoes?: string | null;
  data_encontro?: string | null;
  data_evento?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  updated_at?: string | null;
  tipo_encontro?: string | null;
};

function isExtratoPagamento(e: ApiEncontro) {
  return (
    typeof e.tipo_encontro === "string" &&
    e.tipo_encontro.trim().toLowerCase() === "extrato-pagamento"
  );
}

type ApiPendencyItem = {
  encontro_id: string;
  status: ApiEncontroStatus;
  reasons: string[];
  missing_fields: string[];
  suggested_next_status?: ApiEncontroStatus | null;
};

function mapStatus(status: ApiEncontroStatus): EncounterStatus {
  if (status === "glosado_total") return "glosado";
  if (status === "glosado_parcialmente") return "parcial";
  return status;
}

const apiStatusLabels: Record<ApiEncontroStatus, string> = {
  agendado: statusLabels.agendado,
  produzido: statusLabels.produzido,
  pago: statusLabels.pago,
  glosado_total: "Glosado total",
  glosado_parcialmente: "Glosado parcial",
};

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t).toISOString().slice(0, 10);
}

function Trabalho() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("todos");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [newEncounterOpen, setNewEncounterOpen] = useState(false);
  const [patientPickerOpen, setPatientPickerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState<{
    total: number;
    done: number;
  } | null>(null);
  const [apiPatients, setApiPatients] = useState<string[]>([]);
  const [apiEncontros, setApiEncontros] = useState<ApiEncontro[]>([]);
  const [pendencyByEncontroId, setPendencyByEncontroId] = useState<
    Record<string, ApiPendencyItem>
  >({});
  const [editPendency, setEditPendency] = useState<ApiPendencyItem | null>(
    null,
  );
  const [pendingOpenEncontroId, setPendingOpenEncontroId] = useState<
    string | null
  >(null);
  const [createdPatients, setCreatedPatients] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    patient: "",
    procedure: "",
    payer: "",
    guide: "",
    date: "",
    value: "",
    paid: "",
    status: "agendado" as ApiEncontroStatus,
  });
  const [originalEditStatus, setOriginalEditStatus] =
    useState<ApiEncontroStatus>("agendado");

  const [form, setForm] = useState({
    patient: "",
    procedure: "",
    payer: "",
    guide: "",
    date: "",
    value: "",
    paid: "",
    notes: "",
  });
  const [patientQuery, setPatientQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const readErrorMessage = async (res: Response): Promise<string> => {
    if (res.status === 401) return "Sessão expirada. Faça login novamente.";
    try {
      const data = (await res.json()) as unknown;
      if (data && typeof data === "object" && "detail" in data) {
        const detail = (data as Record<string, unknown>).detail;
        if (typeof detail === "string") return detail;
      }
      return JSON.stringify(data);
    } catch {
      try {
        return await res.text();
      } catch {
        return "Erro ao processar a requisição.";
      }
    }
  };

  const refreshEncontros = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const res = await fetch("/api/encontros", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = (await res.json()) as unknown;
    if (Array.isArray(data))
      setApiEncontros(
        (data as ApiEncontro[]).filter((e) => !isExtratoPagamento(e)),
      );
  };

  const refreshPatients = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const res = await fetch("/api/pacientes", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = (await res.json()) as unknown;
    if (Array.isArray(data))
      setApiPatients(data.filter((s) => typeof s === "string"));
  };

  const refreshPendencias = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const res = await fetch("/api/pendencias", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = (await res.json()) as unknown;
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as any).items)
    )
      return;
    const items = (data as any).items as ApiPendencyItem[];
    const map: Record<string, ApiPendencyItem> = {};
    for (const it of items) {
      if (
        it &&
        typeof it === "object" &&
        typeof (it as any).encontro_id === "string"
      ) {
        map[(it as any).encontro_id] = it;
      }
    }
    setPendencyByEncontroId(map);
  };

  useEffect(() => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;

    refreshPatients().catch(() => {});
    refreshEncontros().catch(() => {});
    refreshPendencias().catch(() => {});
  }, []);

  useEffect(() => {
    const onPatientsChanged = () => {
      refreshPatients().catch(() => {});
    };
    const onEncontrosChanged = () => {
      refreshEncontros().catch(() => {});
      refreshPendencias().catch(() => {});
    };
    const onPendenciasChanged = () => {
      refreshPendencias().catch(() => {});
    };

    window.addEventListener("fv:patients-changed", onPatientsChanged);
    window.addEventListener("fv:encontros-changed", onEncontrosChanged);
    window.addEventListener("fv:pendencias-changed", onPendenciasChanged);
    return () => {
      window.removeEventListener("fv:patients-changed", onPatientsChanged);
      window.removeEventListener("fv:encontros-changed", onEncontrosChanged);
      window.removeEventListener("fv:pendencias-changed", onPendenciasChanged);
    };
  }, []);

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as any;
      const encontroId = detail?.encontroId;
      if (typeof encontroId === "string" && encontroId) {
        if (detail?.pendency)
          setEditPendency(detail.pendency as ApiPendencyItem);
        setPendingOpenEncontroId(encontroId);
        clearPendingOpenEncounter();
      }
    };
    window.addEventListener("fv:open-encontro", handler as EventListener);
    return () =>
      window.removeEventListener("fv:open-encontro", handler as EventListener);
  }, []);

  useEffect(() => {
    const pending = takePendingOpenEncounter();
    if (!pending?.encontroId) return;
    if (pending.pendency) setEditPendency(pending.pendency as ApiPendencyItem);
    setPendingOpenEncontroId(pending.encontroId);
  }, []);

  useEffect(() => {
    if (!pendingOpenEncontroId) return;
    const found = apiEncontros.find((e) => e.id === pendingOpenEncontroId);
    if (!found) {
      refreshEncontros().catch(() => {});
      return;
    }
    if (!editPendency) {
      const p = pendencyByEncontroId[pendingOpenEncontroId];
      if (p) setEditPendency(p);
    }
    openEdit(pendingOpenEncontroId);
    setPendingOpenEncontroId(null);
  }, [apiEncontros, editPendency, pendencyByEncontroId, pendingOpenEncontroId]);

  const patientNames = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of apiPatients) {
      const key = p.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(p.trim());
    }
    for (const name of createdPatients) {
      const key = name.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(name.trim());
    }
    return out.sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
    );
  }, [apiPatients, createdPatients]);

  const addPatient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreatedPatients((prev) => {
      const key = trimmed.toLowerCase();
      if (prev.some((p) => p.trim().toLowerCase() === key)) return prev;
      return [...prev, trimmed];
    });
  };

  const patientQueryTrimmed = patientQuery.trim();
  const filteredPatientNames = useMemo(() => {
    if (!patientQueryTrimmed) return patientNames.slice(0, 8);
    const q = patientQueryTrimmed.toLowerCase();
    return patientNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [patientNames, patientQueryTrimmed]);

  const hasExactPatientMatch = useMemo(() => {
    if (!patientQueryTrimmed) return false;
    const q = patientQueryTrimmed.toLowerCase();
    return patientNames.some((n) => n.toLowerCase() === q);
  }, [patientNames, patientQueryTrimmed]);

  const list = useMemo(() => {
    const normalized = apiEncontros.map((e) => {
      const dateStr = e.data_encontro || e.data_evento || "";
      return {
        id: e.id,
        patient: e.nome_paciente ?? "Paciente",
        procedure: e.nome_procedimento ?? "Procedimento",
        payer: e.convenio_utilizado ?? "—",
        guide: e.numero_guia_convenio ?? "",
        date: dateStr,
        value: Number(e.valor_receber ?? 0),
        paid: Number(e.valor_recebido ?? 0),
        status: mapStatus(e.status),
      };
    });

    let from = dateFrom.trim();
    let to = dateTo.trim();
    if (from && to && from > to) {
      const tmp = from;
      from = to;
      to = tmp;
    }

    return normalized.filter(
      (e) =>
        (filter === "todos" || e.status === filter) &&
        (!from && !to
          ? true
          : (() => {
              const key = toDateInputValue(e.date);
              if (!key) return false;
              if (from && key < from) return false;
              if (to && key > to) return false;
              return true;
            })()) &&
        (q === "" ||
          e.patient.toLowerCase().includes(q.toLowerCase()) ||
          e.procedure.toLowerCase().includes(q.toLowerCase()) ||
          e.payer.toLowerCase().includes(q.toLowerCase()) ||
          e.guide.toLowerCase().includes(q.toLowerCase())),
    );
  }, [apiEncontros, dateFrom, dateTo, filter, q]);

  const canSave = useMemo(
    () =>
      form.patient.trim().length > 0 &&
      form.procedure.trim().length > 0 &&
      form.payer.trim().length > 0 &&
      form.date.trim().length > 0 &&
      form.value.trim().length > 0,
    [form.date, form.payer, form.patient, form.procedure, form.value],
  );

  const editRequiresPaid =
    editForm.status === "pago" ||
    editForm.status === "glosado_total" ||
    editForm.status === "glosado_parcialmente";
  const editPaidAmount = editForm.paid.trim() ? parseBRL(editForm.paid) : 0;
  const editPaidValid = !editRequiresPaid || editPaidAmount > 0;

  const openEdit = (id: string) => {
    const item = apiEncontros.find((e) => e.id === id);
    if (!item) return;
    setEditingId(id);
    setOriginalEditStatus(item.status);
    setEditForm({
      patient: item.nome_paciente ?? "",
      procedure: item.nome_procedimento ?? "",
      payer: item.convenio_utilizado ?? "",
      guide: item.numero_guia_convenio ?? "",
      date: toDateInputValue(item.data_encontro ?? item.data_evento ?? null),
      value:
        item.valor_receber != null ? formatMoneyInput(item.valor_receber) : "",
      paid:
        item.valor_recebido != null
          ? formatMoneyInput(item.valor_recebido)
          : "",
      status: item.status,
    });
    setEditOpen(true);
  };

  const selectedForDelete = useMemo(() => {
    if (!deleteId) return null;
    return apiEncontros.find((e) => e.id === deleteId) ?? null;
  }, [apiEncontros, deleteId]);

  const deleteProgressText = useMemo(() => {
    if (!deleteProgress) return "";
    return `Excluindo ${deleteProgress.done} de ${deleteProgress.total}...`;
  }, [deleteProgress]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Meu trabalho
          </h1>
          <p className="text-muted-foreground text-sm">
            {list.length} Consultas/Procedimentos · suas pendências em destaque
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            disabled={apiEncontros.length === 0}
            onClick={() => setDeleteAllOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Excluir todos
          </Button>
          <Button
            className="bg-gradient-primary shadow-elegant"
            onClick={() => {
              setForm({
                patient: "",
                procedure: "",
                payer: "",
                guide: "",
                date: "",
                value: "",
                paid: "",
                notes: "",
              });
              setPatientPickerOpen(false);
              setPatientQuery("");
              setNewEncounterOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Novo procedimento/consulta
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar paciente ou procedimento..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="min-w-0">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
              />
            </div>
            <div className="min-w-0">
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth whitespace-nowrap",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-accent",
              )}
            >
              {f === "todos" ? "Todos" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {list.map((e) => (
          <Card
            key={e.id}
            className="p-4 shadow-elegant cursor-pointer"
            onClick={() => openEdit(e.id)}
          >
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{e.patient}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {e.procedure}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {e.payer}
                  {e.guide ? ` · Guia ${e.guide}` : ""}
                  {" · "}
                  {e.date ? new Date(e.date).toLocaleDateString("pt-BR") : "—"}
                </div>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setDeleteId(e.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="font-semibold tabular-nums">
                  {formatBRL(e.value)}
                </div>
                <div className="mt-1">
                  <StatusBadge status={e.status} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block shadow-elegant overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Paciente</th>
              <th className="text-left px-4 py-3 font-medium">Procedimento</th>
              <th className="text-left px-4 py-3 font-medium">Convênio</th>
              <th className="text-left px-4 py-3 font-medium">Guia</th>
              <th className="text-left px-4 py-3 font-medium">Data</th>
              <th className="text-right px-4 py-3 font-medium">Valor</th>
              <th className="text-right px-4 py-3 font-medium">Pago</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr
                key={e.id}
                className="border-t border-border hover:bg-muted/30 transition-smooth cursor-pointer"
                onClick={() => openEdit(e.id)}
              >
                <td className="px-4 py-3 font-medium">{e.patient}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {e.procedure}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.payer}</td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {e.guide || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {e.date ? new Date(e.date).toLocaleDateString("pt-BR") : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatBRL(e.value)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {formatBRL(e.paid)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setDeleteId(e.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (deleting) return;
          if (!open) setDeleteId(null);
          setDeleteProgress(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Consulta/Procedimento</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && deleteProgressText ? deleteProgressText : null}
              {!deleting
                ? selectedForDelete
                  ? `Esta Consulta/Procedimento de ${selectedForDelete.nome_paciente ?? "Paciente"} será removida e não poderá ser recuperada.`
                  : "Esta Consulta/Procedimento será removida e não poderá ser recuperada."
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting || !deleteId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async (ev) => {
                ev.preventDefault();
                if (!deleteId || deleting) return;
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  return;
                }

                setDeleteProgress({ total: 1, done: 0 });
                setDeleting(true);
                try {
                  const res = await fetch(`/api/encontros/${deleteId}`, {
                    method: "DELETE",
                    headers: {
                      accept: "application/json",
                      authorization: `Bearer ${token}`,
                    },
                  });
                  if (!res.ok) {
                    toast.error("Falha ao excluir", {
                      description: await readErrorMessage(res),
                    });
                    return;
                  }

                  setDeleteProgress({ total: 1, done: 1 });
                  setApiEncontros((prev) =>
                    prev.filter((e) => e.id !== deleteId),
                  );
                  if (editingId === deleteId) setEditOpen(false);
                  toast.success("Consulta/Procedimento excluído");
                  setDeleteId(null);
                } finally {
                  setDeleting(false);
                  setDeleteProgress(null);
                }
              }}
            >
              {deleting && deleteProgress
                ? `Excluindo (${deleteProgress.done}/${deleteProgress.total})`
                : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteAllOpen}
        onOpenChange={(open) => {
          if (deleting) return;
          setDeleteAllOpen(open);
          if (!open) setDeleteProgress(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir todas as Consultas/Procedimentos</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && deleteProgressText ? deleteProgressText : null}
              {!deleting
                ? "Todas as Consultas/Procedimentos serão removidas e não poderão ser recuperadas."
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting || apiEncontros.length === 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async (ev) => {
                ev.preventDefault();
                if (deleting || apiEncontros.length === 0) return;
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  return;
                }

                const idsToDelete = apiEncontros.map((e) => e.id);
                setDeleteProgress({ total: idsToDelete.length, done: 0 });
                setDeleting(true);
                try {
                  let done = 0;
                  for (const id of idsToDelete) {
                    const res = await fetch(`/api/encontros/${id}`, {
                      method: "DELETE",
                      headers: {
                        accept: "application/json",
                        authorization: `Bearer ${token}`,
                      },
                    });

                    if (!res.ok) {
                      toast.error("Falha ao excluir", {
                        description: await readErrorMessage(res),
                      });
                      await refreshEncontros();
                      return;
                    }

                    done += 1;
                    setDeleteProgress({ total: idsToDelete.length, done });
                    setApiEncontros((prev) => prev.filter((e) => e.id !== id));
                    if (editingId === id) setEditOpen(false);
                  }

                  const deleted = idsToDelete.length;
                  setApiEncontros([]);
                  setEditOpen(false);
                  toast.success("Consultas/Procedimentos excluídos", {
                    description:
                      deleted != null ? `${deleted} removidos` : undefined,
                  });
                  setDeleteAllOpen(false);
                } finally {
                  setDeleting(false);
                  setDeleteProgress(null);
                }
              }}
            >
              {deleting && deleteProgress
                ? `Excluindo (${deleteProgress.done}/${deleteProgress.total})`
                : "Excluir todos"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={newEncounterOpen} onOpenChange={setNewEncounterOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Novo procedimento/consulta</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Paciente</Label>
              <Popover
                open={patientPickerOpen}
                onOpenChange={(open) => {
                  setPatientPickerOpen(open);
                  if (open) setPatientQuery(form.patient);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={patientPickerOpen}
                    className="w-full justify-between font-normal"
                  >
                    <span
                      className={cn(
                        "truncate",
                        !form.patient && "text-muted-foreground",
                      )}
                    >
                      {form.patient ? form.patient : "Selecione um paciente"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Buscar paciente..."
                      value={patientQuery}
                      onValueChange={(value) => setPatientQuery(value)}
                    />
                    <CommandList>
                      {filteredPatientNames.length === 0 &&
                      !patientQueryTrimmed ? (
                        <CommandEmpty>Nenhum paciente disponível.</CommandEmpty>
                      ) : null}

                      {filteredPatientNames.length === 0 &&
                      patientQueryTrimmed ? (
                        <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
                      ) : null}

                      {filteredPatientNames.length > 0 ? (
                        <CommandGroup>
                          {filteredPatientNames.map((name) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={() => {
                                setForm((s) => ({ ...s, patient: name }));
                                setPatientPickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.patient === name
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <span className="truncate">{name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : null}

                      {patientQueryTrimmed && !hasExactPatientMatch ? (
                        <CommandGroup>
                          <CommandItem
                            value={`__add__${patientQueryTrimmed}`}
                            onSelect={() => {
                              addPatient(patientQueryTrimmed);
                              setForm((s) => ({
                                ...s,
                                patient: patientQueryTrimmed,
                              }));
                              toast.success("Paciente adicionado", {
                                description: patientQueryTrimmed,
                              });
                              setPatientPickerOpen(false);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Adicionar “{patientQueryTrimmed}”
                          </CommandItem>
                        </CommandGroup>
                      ) : null}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="enc-date">Data</Label>
                <Input
                  id="enc-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, date: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="enc-value">Valor</Label>
                <Input
                  id="enc-value"
                  value={form.value}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      value: maskMoneyInput(e.target.value),
                    }))
                  }
                  placeholder="Ex: 450,00"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="enc-procedure">Procedimento</Label>
                <Input
                  id="enc-procedure"
                  value={form.procedure}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, procedure: e.target.value }))
                  }
                  placeholder="Ex: Consulta Cardiológica"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="enc-payer">Convênio</Label>
                <Input
                  id="enc-payer"
                  value={form.payer}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, payer: e.target.value }))
                  }
                  placeholder="Ex: Unimed"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="enc-guide">Número da guia do convênio</Label>
              <Input
                id="enc-guide"
                value={form.guide}
                onChange={(e) =>
                  setForm((s) => ({ ...s, guide: e.target.value }))
                }
                placeholder="Ex: 1234567890"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="enc-paid">Pago</Label>
              <Input
                id="enc-paid"
                value={form.paid}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    paid: maskMoneyInput(e.target.value),
                  }))
                }
                placeholder="Ex: 0,00"
                inputMode="decimal"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="enc-notes">Observações</Label>
              <Textarea
                id="enc-notes"
                value={form.notes}
                onChange={(e) =>
                  setForm((s) => ({ ...s, notes: e.target.value }))
                }
                placeholder="Procedimentos, convênio, anexos..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setNewEncounterOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={!canSave || saving}
              onClick={async () => {
                if (saving) return;
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  return;
                }

                setSaving(true);
                try {
                  const payload = {
                    nome_paciente: form.patient.trim(),
                    nome_procedimento: form.procedure.trim(),
                    convenio_utilizado: form.payer.trim(),
                    numero_guia_convenio: form.guide.trim() || null,
                    observacoes: form.notes.trim() || null,
                    data_encontro: form.date
                      ? new Date(form.date).toISOString()
                      : null,
                    valor_receber: parseBRL(form.value),
                    valor_recebido: parseBRL(form.paid) || null,
                  };

                  const res = await fetch("/api/encontros", {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "content-type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  });

                  if (!res.ok) {
                    toast.error("Falha ao criar Consulta/Procedimento");
                    return;
                  }

                  const created = (await res.json()) as ApiEncontro;
                  setApiEncontros((prev) => [created, ...prev]);
                  toast.success("Consulta/Procedimento criado", {
                    description: `${payload.nome_paciente} • ${new Date(payload.data_encontro || Date.now()).toLocaleDateString("pt-BR")}`,
                  });
                  setNewEncounterOpen(false);
                } finally {
                  setSaving(false);
                }
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setEditingId(null);
            setEditPendency(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Editar Consulta/Procedimento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {editPendency && editingId === editPendency.encontro_id ? (
              <Alert className="border-warning/40 bg-warning/10 text-foreground">
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <AlertTitle>Pendência: o que fazer</AlertTitle>
                  <AlertDescription>
                    {editPendency.reasons?.length ? (
                      <p>{editPendency.reasons.join(" · ")}</p>
                    ) : (
                      <p>Revise esta Consulta/Procedimento.</p>
                    )}
                    {editPendency.missing_fields?.length ? (
                      <p className="mt-1">
                        Preencha: {editPendency.missing_fields.join(", ")}
                      </p>
                    ) : null}
                  </AlertDescription>
                </div>
              </Alert>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="edit-patient">Paciente</Label>
              <Input
                id="edit-patient"
                value={editForm.patient}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, patient: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-procedure">Procedimento</Label>
                <Input
                  id="edit-procedure"
                  value={editForm.procedure}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, procedure: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-payer">Convênio</Label>
                <Input
                  id="edit-payer"
                  value={editForm.payer}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, payer: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-guide">Número da guia do convênio</Label>
              <Input
                id="edit-guide"
                value={editForm.guide}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, guide: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Data</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, date: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-value">Valor Procedimento/Consulta</Label>
                <Input
                  id="edit-value"
                  value={editForm.value}
                  onChange={(e) =>
                    setEditForm((s) => ({
                      ...s,
                      value: maskMoneyInput(e.target.value),
                    }))
                  }
                  inputMode="decimal"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-paid">Valor Pago</Label>
                <Input
                  id="edit-paid"
                  value={editForm.paid}
                  onChange={(e) =>
                    setEditForm((s) => ({
                      ...s,
                      paid: maskMoneyInput(e.target.value),
                    }))
                  }
                  inputMode="decimal"
                  className={
                    !editPaidValid
                      ? "border-destructive focus-visible:ring-destructive"
                      : undefined
                  }
                />
                {editRequiresPaid && !editPaidValid ? (
                  <div className="text-xs text-destructive">
                    Informe um valor maior que zero em Pago para este status.
                  </div>
                ) : null}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm((s) => ({
                    ...s,
                    status: value as ApiEncontroStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(apiStatusLabels) as ApiEncontroStatus[]).map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {apiStatusLabels[s]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!editingId || saving || !editPaidValid}
              onClick={async () => {
                if (!editingId || saving) return;
                if (!editPaidValid) {
                  toast.error(
                    "Informe um valor em Pago maior que zero para este status.",
                  );
                  return;
                }
                const token = localStorage.getItem("fv_access_token");
                if (!token) {
                  toast.error("Sessão expirada. Faça login novamente.");
                  return;
                }

                setSaving(true);
                try {
                  const payload = {
                    nome_paciente: editForm.patient.trim() || null,
                    nome_procedimento: editForm.procedure.trim() || null,
                    convenio_utilizado: editForm.payer.trim() || null,
                    numero_guia_convenio: editForm.guide.trim() || null,
                    data_encontro: editForm.date
                      ? new Date(editForm.date).toISOString()
                      : null,
                    valor_receber: editForm.value.trim()
                      ? parseBRL(editForm.value)
                      : null,
                    valor_recebido: editForm.paid.trim()
                      ? parseBRL(editForm.paid)
                      : null,
                  };

                  const res = await fetch(`/api/encontros/${editingId}`, {
                    method: "PUT",
                    headers: {
                      accept: "application/json",
                      "content-type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  });

                  if (!res.ok) {
                    toast.error("Falha ao salvar", {
                      description: await readErrorMessage(res),
                    });
                    return;
                  }

                  if (editForm.status !== originalEditStatus) {
                    const statusRes = await fetch(
                      `/api/encontros/${editingId}/status`,
                      {
                        method: "PATCH",
                        headers: {
                          accept: "application/json",
                          "content-type": "application/json",
                          authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: editForm.status }),
                      },
                    );
                    if (!statusRes.ok) {
                      toast.error("Falha ao atualizar status", {
                        description: await readErrorMessage(statusRes),
                      });
                      return;
                    }
                    setOriginalEditStatus(editForm.status);
                  }

                  await refreshEncontros();
                  toast.success("Consulta/Procedimento atualizado");
                  setEditOpen(false);
                } finally {
                  setSaving(false);
                }
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
