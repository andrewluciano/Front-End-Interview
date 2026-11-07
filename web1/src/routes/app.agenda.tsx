import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import {
  formatBRL,
  formatMoneyInput,
  parseBRL,
  type EncounterStatus,
  statusLabels,
} from "@/lib/mock-data";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";

export const Route = createFileRoute("/app/agenda")({
  component: Agenda,
  head: () => ({ meta: [{ title: "Agenda — Fatura Viva" }] }),
});

type ApiEncontroStatus =
  | "agendado"
  | "produzido"
  | "pago"
  | "glosado_total"
  | "glosado_parcialmente";

type ApiConfirmacaoComparecimento = "pendente" | "confirmado" | "nao_compareceu";

type ApiEncontro = {
  id: string;
  status: ApiEncontroStatus;
  nome_paciente?: string | null;
  medico?: string | null;
  convenio_utilizado?: string | null;
  numero_guia_convenio?: string | null;
  nome_procedimento?: string | null;
  observacoes?: string | null;
  data_encontro?: string | null;
  data_evento?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  confirmacao_comparecimento?: ApiConfirmacaoComparecimento | null;
  updated_at?: string | null;
};

const confirmacaoLabels: Record<ApiConfirmacaoComparecimento, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  nao_compareceu: "Não compareceu",
};

const confirmacaoStyles: Record<ApiConfirmacaoComparecimento, string> = {
  pendente: "bg-muted text-muted-foreground border-border",
  confirmado: "bg-success/15 text-success border-success/25",
  nao_compareceu: "bg-destructive/10 text-destructive border-destructive/25",
};

const filters: Array<"todos" | ApiEncontroStatus> = [
  "todos",
  "agendado",
  "produzido",
  "pago",
  "glosado_total",
  "glosado_parcialmente",
];

function mapStatus(status: ApiEncontroStatus): EncounterStatus {
  if (status === "glosado_total") return "glosado";
  if (status === "glosado_parcialmente") return "parcial";
  return status;
}

function formatApiStatus(status: ApiEncontroStatus): string {
  if (status === "glosado_total") return "Glosado total";
  if (status === "glosado_parcialmente") return "Glosado parcial";
  return statusLabels[mapStatus(status)];
}

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateTimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

function formatDatePtBR(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Date(t).toLocaleDateString("pt-BR");
}

function formatTimePtBR(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveBestIso(encontro: ApiEncontro): string | null {
  return (
    encontro.data_evento ??
    encontro.data_encontro ??
    encontro.updated_at ??
    null
  );
}

function patientInitials(name: string | null | undefined): string {
  const raw = String(name ?? "").trim();
  if (!raw) return "—";

  const lowerWords = new Set(["da", "das", "de", "do", "dos", "e"]);
  const parts = raw.split(/\s+/g).filter(Boolean);
  const out = parts
    .map((p) =>
      p.replace(/^[^A-Za-zÀ-ÖØ-öø-ÿ]+|[^A-Za-zÀ-ÖØ-öø-ÿ]+$/g, ""),
    )
    .filter(Boolean)
    .map((p) => {
      const first = p[0] ?? "";
      const key = p.toLocaleLowerCase("pt-BR");
      return lowerWords.has(key)
        ? first.toLocaleLowerCase("pt-BR")
        : first.toLocaleUpperCase("pt-BR");
    })
    .join("");

  return out || "—";
}

async function readErrorMessage(res: Response): Promise<string> {
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
}

function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [filter, setFilter] = useState<(typeof filters)[number]>("todos");
  const [doctor, setDoctor] = useState<string>("todos");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [encontros, setEncontros] = useState<ApiEncontro[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allEncontros, setAllEncontros] = useState<ApiEncontro[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    patient: "",
    doctor: "",
    procedure: "",
    payer: "",
    guide: "",
    notes: "",
    dateTime: "",
    status: "agendado" as ApiEncontroStatus,
    value: "",
    paid: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    patient: "",
    doctor: "",
    procedure: "",
    payer: "",
    guide: "",
    notes: "",
    dateTime: "",
    status: "agendado" as ApiEncontroStatus,
    value: "",
    paid: "",
    confirmacao: "pendente" as ApiConfirmacaoComparecimento,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiEncontro | null>(null);
  const [deleting, setDeleting] = useState(false);

  const selectedDateKey = useMemo(
    () => toLocalDateKey(selectedDate),
    [selectedDate],
  );
  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);

  const refreshEncontros = useCallback(async (dateKey: string) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;

    setLoading(true);
    try {
      const url = new URL("/api/encontros", window.location.origin);
      url.searchParams.set("from", dateKey);
      url.searchParams.set("to", dateKey);

      const res = await fetch(url.toString(), {
        headers: { accept: "application/json", authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error(await readErrorMessage(res));
        return;
      }

      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) {
        setEncontros(data as ApiEncontro[]);
      } else {
        setEncontros([]);
      }
    } catch (err) {
      if (err instanceof TypeError) {
        toast.error("Não foi possível carregar a agenda.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAllEncontros = useCallback(async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;

    setAllLoading(true);
    try {
      const res = await fetch("/api/encontros", {
        headers: { accept: "application/json", authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error(await readErrorMessage(res));
        return;
      }

      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) {
        setAllEncontros(data as ApiEncontro[]);
      } else {
        setAllEncontros([]);
      }
    } catch (err) {
      if (err instanceof TypeError) {
        toast.error("Não foi possível carregar a lista completa.");
      }
    } finally {
      setAllLoading(false);
    }
  }, []);

  const doctorOptions = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const e of allEncontros) {
      const name = String(e.medico ?? "").trim();
      const key = name.toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(name);
    }
    return out.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [allEncontros]);

  useEffect(() => {
    refreshEncontros(selectedDateKey);
  }, [refreshEncontros, selectedDateKey]);

  useEffect(() => {
    const onChanged = () => {
      refreshEncontros(selectedDateKey);
      refreshAllEncontros();
    };
    window.addEventListener("fv:encontros-changed", onChanged);
    return () => window.removeEventListener("fv:encontros-changed", onChanged);
  }, [refreshAllEncontros, refreshEncontros, selectedDateKey]);

  useEffect(() => {
    refreshAllEncontros();
  }, [refreshAllEncontros]);

  const listForUi = useMemo(() => {
    const query = q.trim().toLowerCase();
    const doctorKey = doctor.trim().toLowerCase();
    const out = encontros
      .filter((e) => {
        const status = e.status ?? "agendado";
        if (filter === "todos") return true;
        return status === filter;
      })
      .filter((e) => {
        if (doctorKey === "todos") return true;
        const m = String(e.medico ?? "").trim().toLowerCase();
        if (!m) return false;
        return m === doctorKey;
      })
      .filter((e) => {
        const iso = resolveBestIso(e);
        if (!iso) return false;
        const t = Date.parse(iso);
        if (!Number.isFinite(t)) return false;
        return toLocalDateKey(new Date(t)) === selectedDateKey;
      })
      .filter((e) => {
        if (!query) return true;
        const blob = `${e.nome_paciente ?? ""} ${e.medico ?? ""} ${e.nome_procedimento ?? ""} ${e.convenio_utilizado ?? ""} ${e.numero_guia_convenio ?? ""}`.toLowerCase();
        return blob.includes(query);
      })
      .map((e) => {
        const iso = resolveBestIso(e);
        return {
          raw: e,
          id: e.id,
          iso,
          time: formatTimePtBR(iso),
          patient: e.nome_paciente ?? "Paciente",
          doctor: e.medico ?? "",
          procedure: e.nome_procedimento ?? "Procedimento",
          payer: e.convenio_utilizado ?? "—",
          guide: e.numero_guia_convenio ?? "",
          status: e.status ?? "agendado",
          confirmacao: e.confirmacao_comparecimento ?? "pendente",
          amount: Number(e.valor_receber ?? 0),
        };
      })
      .sort((a, b) => (a.iso ?? "").localeCompare(b.iso ?? ""));

    return out;
  }, [encontros, filter, q, selectedDateKey]);

  const openCreate = () => {
    const initial = new Date(selectedDate);
    initial.setHours(9, 0, 0, 0);
    setCreateForm({
      patient: "",
      doctor: doctor !== "todos" ? doctor : "",
      procedure: "",
      payer: "",
      guide: "",
      notes: "",
      dateTime: toDateTimeLocalValue(initial.toISOString()),
      status: "agendado",
      value: "",
      paid: "",
    });
    setCreateOpen(true);
  };

  const createCanSave =
    createForm.patient.trim() &&
    createForm.procedure.trim() &&
    createForm.dateTime.trim();
  const createMissing = {
    patient: !createForm.patient.trim(),
    procedure: !createForm.procedure.trim(),
    dateTime: !createForm.dateTime.trim(),
  };

  const createEncontro = async () => {
    if (!createCanSave || createSaving) return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setCreateSaving(true);
    try {
      const payload = {
        nome_paciente: createForm.patient.trim(),
        medico: createForm.doctor.trim() || null,
        nome_procedimento: createForm.procedure.trim(),
        convenio_utilizado: createForm.payer.trim() || null,
        numero_guia_convenio: createForm.guide.trim() || null,
        observacoes: createForm.notes.trim() || null,
        data_evento: createForm.dateTime
          ? new Date(createForm.dateTime).toISOString()
          : null,
        status: createForm.status,
        valor_receber: createForm.value.trim() ? parseBRL(createForm.value) : null,
        valor_recebido: createForm.paid.trim() ? parseBRL(createForm.paid) : null,
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
        toast.error(await readErrorMessage(res));
        return;
      }

      toast.success("Agendamento criado", {
        description: `${payload.nome_paciente} • ${formatDatePtBR(payload.data_evento)}`,
      });
      setCreateOpen(false);
      refreshEncontros(selectedDateKey);
      refreshAllEncontros();
    } finally {
      setCreateSaving(false);
    }
  };

  const loadEncontro = async (encontroId: string): Promise<ApiEncontro | null> => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return null;
    try {
      const res = await fetch(`/api/encontros/${encodeURIComponent(encontroId)}`, {
        headers: { accept: "application/json", authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const json = (await res.json()) as unknown;
      if (!json || typeof json !== "object") return null;
      return json as ApiEncontro;
    } catch {
      return null;
    }
  };

  const openEdit = async (e: ApiEncontro) => {
    setEditingId(e.id);
    const iso = resolveBestIso(e);
    setEditForm({
      patient: e.nome_paciente ?? "",
      doctor: e.medico ?? "",
      procedure: e.nome_procedimento ?? "",
      payer: e.convenio_utilizado ?? "",
      guide: e.numero_guia_convenio ?? "",
      notes: e.observacoes ?? "",
      dateTime: toDateTimeLocalValue(iso),
      status: e.status ?? "agendado",
      value:
        e.valor_receber != null ? formatMoneyInput(Number(e.valor_receber)) : "",
      paid:
        e.valor_recebido != null ? formatMoneyInput(Number(e.valor_recebido)) : "",
      confirmacao: e.confirmacao_comparecimento ?? "pendente",
    });
    setEditOpen(true);

    const fresh = await loadEncontro(e.id);
    if (!fresh) return;
    if (fresh.id !== e.id) return;
    const freshIso = resolveBestIso(fresh);
    setEditForm({
      patient: fresh.nome_paciente ?? "",
      doctor: fresh.medico ?? "",
      procedure: fresh.nome_procedimento ?? "",
      payer: fresh.convenio_utilizado ?? "",
      guide: fresh.numero_guia_convenio ?? "",
      notes: fresh.observacoes ?? "",
      dateTime: toDateTimeLocalValue(freshIso),
      status: fresh.status ?? "agendado",
      value:
        fresh.valor_receber != null
          ? formatMoneyInput(Number(fresh.valor_receber))
          : "",
      paid:
        fresh.valor_recebido != null
          ? formatMoneyInput(Number(fresh.valor_recebido))
          : "",
      confirmacao: fresh.confirmacao_comparecimento ?? "pendente",
    });
  };

  const editCanSave =
    editForm.patient.trim() && editForm.procedure.trim() && editForm.dateTime.trim();
  const editMissing = {
    patient: !editForm.patient.trim(),
    procedure: !editForm.procedure.trim(),
    dateTime: !editForm.dateTime.trim(),
  };

  const saveEdit = async () => {
    if (!editingId || !editCanSave || editSaving) return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setEditSaving(true);
    try {
      const payload = {
        nome_paciente: editForm.patient.trim(),
        medico: editForm.doctor.trim() || null,
        nome_procedimento: editForm.procedure.trim(),
        convenio_utilizado: editForm.payer.trim() || null,
        numero_guia_convenio: editForm.guide.trim() || null,
        observacoes: editForm.notes.trim() || null,
        data_evento: editForm.dateTime ? new Date(editForm.dateTime).toISOString() : null,
        status: editForm.status,
        valor_receber: editForm.value.trim() ? parseBRL(editForm.value) : null,
        valor_recebido: editForm.paid.trim() ? parseBRL(editForm.paid) : null,
        confirmacao_comparecimento: editForm.confirmacao,
      };

      const res = await fetch(`/api/encontros/${encodeURIComponent(editingId)}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error(await readErrorMessage(res));
        return;
      }

      toast.success("Agendamento atualizado");
      setEditOpen(false);
      setEditingId(null);
      refreshEncontros(selectedDateKey);
      refreshAllEncontros();
    } finally {
      setEditSaving(false);
    }
  };

  const updateConfirmacao = async (
    encontroId: string,
    confirmacao: ApiConfirmacaoComparecimento,
  ) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const res = await fetch(`/api/encontros/${encodeURIComponent(encontroId)}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmacao_comparecimento: confirmacao }),
      });
      if (!res.ok) {
        toast.error(await readErrorMessage(res));
        return;
      }

      const updateList = (list: ApiEncontro[]) =>
        list.map((e) =>
          e.id === encontroId ? { ...e, confirmacao_comparecimento: confirmacao } : e,
        );
      setEncontros(updateList);
      setAllEncontros(updateList);
      toast.success("Confirmação atualizada");
    } catch (err) {
      if (err instanceof TypeError) {
        toast.error("Não foi possível atualizar a confirmação.");
      }
    }
  };

  const askDelete = (e: ApiEncontro) => {
    setDeleteTarget(e);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/encontros/${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
        headers: { accept: "application/json", authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error(await readErrorMessage(res));
        return;
      }

      toast.success("Agendamento removido");
      setDeleteOpen(false);
      setDeleteTarget(null);
      setEncontros((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setAllEncontros((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } finally {
      setDeleting(false);
    }
  };

  const fullListInitials = useMemo(() => {
    return allEncontros
      .slice()
      .map((e) => {
        const iso = resolveBestIso(e);
        const t = iso ? Date.parse(iso) : NaN;
        return {
          id: e.id,
          raw: e,
          initials: patientInitials(e.nome_paciente),
          patient: e.nome_paciente ?? "Paciente",
          doctor: e.medico ?? "—",
          procedure: e.nome_procedimento ?? "Procedimento",
          payer: e.convenio_utilizado ?? "—",
          date: formatDatePtBR(iso),
          timeLabel: formatTimePtBR(iso),
          time: Number.isFinite(t) ? t : 0,
        };
      })
      .sort((a, b) => b.time - a.time);
  }, [allEncontros]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {formatDatePtBR(selectedDate.toISOString())}
            </p>
            {selectedDateKey === todayKey ? (
              <Badge variant="secondary" className="h-6">
                Hoje
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => refreshEncontros(selectedDateKey)}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button className="bg-gradient-primary shadow-elegant" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
        <Card className="p-3">
          <div className="flex items-center justify-between gap-2 px-1 pt-1">
            <div className="text-sm font-medium">Selecionar data</div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                setSelectedDate(d);
              }}
            >
              Hoje
            </Button>
          </div>
          <div className="mt-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              classNames={{
                today:
                  "bg-accent text-accent-foreground rounded-md ring-2 ring-primary/30 ring-inset",
              }}
              onSelect={(d) => {
                if (!d) return;
                const next = new Date(d);
                next.setHours(0, 0, 0, 0);
                setSelectedDate(next);
              }}
            />
          </div>

          <div className="mt-3 grid gap-3 px-1 pb-1">
            <div className="grid gap-2">
              <Label htmlFor="agenda-search">Buscar</Label>
              <Input
                id="agenda-search"
                placeholder="Paciente, procedimento, convênio..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={filter}
                onValueChange={(v) => setFilter(v as (typeof filters)[number])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="agendado">{formatApiStatus("agendado")}</SelectItem>
                  <SelectItem value="produzido">{formatApiStatus("produzido")}</SelectItem>
                  <SelectItem value="pago">{formatApiStatus("pago")}</SelectItem>
                  <SelectItem value="glosado_total">
                    {formatApiStatus("glosado_total")}
                  </SelectItem>
                  <SelectItem value="glosado_parcialmente">
                    {formatApiStatus("glosado_parcialmente")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Médico</Label>
              <Select
                value={doctor}
                onValueChange={(v) => setDoctor(v)}
                disabled={doctorOptions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {doctorOptions.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Compromissos do dia</div>
            <div
              className={cn(
                "text-xs tabular-nums",
                loading ? "text-muted-foreground" : "text-muted-foreground",
              )}
            >
              {loading ? "Carregando…" : `${listForUi.length} itens`}
            </div>
          </div>

          <div className="mt-3 divide-y">
            {loading ? (
              <div className="py-10 text-sm text-muted-foreground">
                Carregando agenda…
              </div>
            ) : listForUi.length ? (
              listForUi.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className="py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between cursor-pointer rounded-md px-2 -mx-2 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => openEdit(item.raw)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openEdit(item.raw);
                    }
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium tabular-nums">{item.time || "—"}</div>
                      <StatusBadge status={mapStatus(item.status)} />
                      {item.guide ? (
                        <div className="text-xs text-muted-foreground">
                          Guia {item.guide}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-1 truncate">
                      <span className="font-medium">{item.patient}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        • {item.procedure}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground truncate">
                      {item.doctor ? `${item.doctor} • ` : ""}
                      {item.payer}
                      {item.amount ? ` • ${formatBRL(item.amount)}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Select
                      value={item.confirmacao}
                      onValueChange={(v) =>
                        updateConfirmacao(item.id, v as ApiConfirmacaoComparecimento)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "h-8 w-[150px] text-xs",
                          confirmacaoStyles[item.confirmacao],
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent onClick={(e) => e.stopPropagation()}>
                        <SelectItem value="pendente">
                          {confirmacaoLabels.pendente}
                        </SelectItem>
                        <SelectItem value="confirmado">
                          {confirmacaoLabels.confirmado}
                        </SelectItem>
                        <SelectItem value="nao_compareceu">
                          {confirmacaoLabels.nao_compareceu}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(item.raw);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        askDelete(item.raw);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-sm text-muted-foreground">
                Nenhum agendamento para este dia.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Todos os agendamentos</div>
          <div className="text-xs tabular-nums text-muted-foreground">
            {allLoading ? "Carregando…" : `${fullListInitials.length} itens`}
          </div>
        </div>

        <div className="mt-3">
          <ScrollArea className="h-[260px] rounded-md border bg-background">
            {allLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Carregando lista completa…
              </div>
            ) : fullListInitials.length ? (
              <div className="divide-y">
                {fullListInitials.map((it) => (
                  <div
                    key={it.id}
                    role="button"
                    tabIndex={0}
                    className="px-4 py-3 grid grid-cols-[52px_1fr] gap-3 items-start cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => openEdit(it.raw)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openEdit(it.raw);
                      }
                    }}
                  >
                    <div className="pt-0.5">
                      <span className="inline-flex w-[52px] justify-center rounded-md border bg-muted/40 px-2 py-1 text-sm font-semibold tracking-tight">
                        {it.initials}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="font-medium truncate">{it.patient}</div>
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {it.date}
                          {it.timeLabel ? ` • ${it.timeLabel}` : ""}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <span className="text-foreground/90">{it.procedure}</span>
                        <span className="text-muted-foreground"> • {it.payer}</span>
                        <span className="text-muted-foreground"> • {it.doctor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                Nenhum agendamento encontrado.
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Novo agendamento</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="create-patient">
                  Paciente <span className="text-destructive">*</span>
                </Label>
                <Badge variant="secondary" className="h-6">
                  Obrigatório
                </Badge>
              </div>
              <Input
                id="create-patient"
                className={cn(
                  "border-primary/30 bg-primary/5 focus-visible:ring-primary/20",
                  createMissing.patient
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "",
                )}
                placeholder="Nome completo"
                value={createForm.patient}
                onChange={(e) =>
                  setCreateForm((s) => ({ ...s, patient: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="create-procedure">
                    Procedimento <span className="text-destructive">*</span>
                  </Label>
                  <Badge variant="secondary" className="h-6">
                    Obrigatório
                  </Badge>
                </div>
                <Input
                  id="create-procedure"
                  className={cn(
                    "border-primary/30 bg-primary/5 focus-visible:ring-primary/20",
                    createMissing.procedure
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "",
                  )}
                  placeholder="Ex.: Consulta Cardiológica"
                  value={createForm.procedure}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, procedure: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="create-datetime">
                    Data e hora <span className="text-destructive">*</span>
                  </Label>
                  <Badge variant="secondary" className="h-6">
                    Obrigatório
                  </Badge>
                </div>
                <Input
                  id="create-datetime"
                  type="datetime-local"
                  className={cn(
                    "border-primary/30 bg-primary/5 focus-visible:ring-primary/20",
                    createMissing.dateTime
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "",
                  )}
                  value={createForm.dateTime}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, dateTime: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Convênio</Label>
                <Input
                  placeholder="Ex.: Unimed"
                  value={createForm.payer}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, payer: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Número da guia</Label>
                <Input
                  placeholder="Opcional"
                  value={createForm.guide}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, guide: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Médico</Label>
                <Badge variant="secondary" className="h-6">
                  Importante
                </Badge>
              </div>
              <Input
                placeholder="Ex.: Dra. Maria Souza"
                value={createForm.doctor}
                onChange={(e) =>
                  setCreateForm((s) => ({ ...s, doctor: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label>Status</Label>
                  <Badge variant="secondary" className="h-6">
                    Importante
                  </Badge>
                </div>
                <Select
                  value={createForm.status}
                  onValueChange={(v) =>
                    setCreateForm((s) => ({ ...s, status: v as ApiEncontroStatus }))
                  }
                >
                  <SelectTrigger className="border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">{formatApiStatus("agendado")}</SelectItem>
                    <SelectItem value="produzido">{formatApiStatus("produzido")}</SelectItem>
                    <SelectItem value="pago">{formatApiStatus("pago")}</SelectItem>
                    <SelectItem value="glosado_total">
                      {formatApiStatus("glosado_total")}
                    </SelectItem>
                    <SelectItem value="glosado_parcialmente">
                      {formatApiStatus("glosado_parcialmente")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Valor</Label>
                  <Input
                    inputMode="decimal"
                    placeholder="R$ 0,00"
                    value={createForm.value}
                    onChange={(e) =>
                      setCreateForm((s) => ({ ...s, value: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Recebido</Label>
                  <Input
                    inputMode="decimal"
                    placeholder="R$ 0,00"
                    value={createForm.paid}
                    onChange={(e) =>
                      setCreateForm((s) => ({ ...s, paid: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Observações</Label>
              <Textarea
                value={createForm.notes}
                onChange={(e) =>
                  setCreateForm((s) => ({ ...s, notes: e.target.value }))
                }
              />
            </div>
          </div>

          {!createCanSave ? (
            <div className="text-xs text-muted-foreground">
              Preencha os campos marcados como obrigatório.
            </div>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-gradient-primary shadow-elegant"
              disabled={!createCanSave || createSaving}
              onClick={createEncontro}
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
          if (!open) setEditingId(null);
        }}
      >
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Editar agendamento</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="edit-patient">
                  Paciente <span className="text-destructive">*</span>
                </Label>
                <Badge variant="secondary" className="h-6">
                  Obrigatório
                </Badge>
              </div>
              <Input
                id="edit-patient"
                className={cn(
                  "border-primary/30 bg-primary/5 focus-visible:ring-primary/20",
                  editMissing.patient
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "",
                )}
                value={editForm.patient}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, patient: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="edit-procedure">
                    Procedimento <span className="text-destructive">*</span>
                  </Label>
                  <Badge variant="secondary" className="h-6">
                    Obrigatório
                  </Badge>
                </div>
                <Input
                  id="edit-procedure"
                  className={cn(
                    "border-primary/30 bg-primary/5 focus-visible:ring-primary/20",
                    editMissing.procedure
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "",
                  )}
                  value={editForm.procedure}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, procedure: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="edit-datetime">
                    Data e hora <span className="text-destructive">*</span>
                  </Label>
                  <Badge variant="secondary" className="h-6">
                    Obrigatório
                  </Badge>
                </div>
                <Input
                  id="edit-datetime"
                  type="datetime-local"
                  className={cn(
                    "border-primary/30 bg-primary/5 focus-visible:ring-primary/20",
                    editMissing.dateTime
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "",
                  )}
                  value={editForm.dateTime}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, dateTime: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Convênio</Label>
                <Input
                  placeholder="Ex.: Unimed"
                  value={editForm.payer}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, payer: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Número da guia</Label>
                <Input
                  placeholder="Opcional"
                  value={editForm.guide}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, guide: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Médico</Label>
                <Badge variant="secondary" className="h-6">
                  Importante
                </Badge>
              </div>
              <Input
                placeholder="Ex.: Dr. João Pereira"
                value={editForm.doctor}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, doctor: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Confirmação de comparecimento</Label>
              <Select
                value={editForm.confirmacao}
                onValueChange={(v) =>
                  setEditForm((s) => ({
                    ...s,
                    confirmacao: v as ApiConfirmacaoComparecimento,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">{confirmacaoLabels.pendente}</SelectItem>
                  <SelectItem value="confirmado">
                    {confirmacaoLabels.confirmado}
                  </SelectItem>
                  <SelectItem value="nao_compareceu">
                    {confirmacaoLabels.nao_compareceu}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Label>Status</Label>
                  <Badge variant="secondary" className="h-6">
                    Importante
                  </Badge>
                </div>
                <Select
                  value={editForm.status}
                  onValueChange={(v) =>
                    setEditForm((s) => ({ ...s, status: v as ApiEncontroStatus }))
                  }
                >
                  <SelectTrigger className="border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">{formatApiStatus("agendado")}</SelectItem>
                    <SelectItem value="produzido">{formatApiStatus("produzido")}</SelectItem>
                    <SelectItem value="pago">{formatApiStatus("pago")}</SelectItem>
                    <SelectItem value="glosado_total">
                      {formatApiStatus("glosado_total")}
                    </SelectItem>
                    <SelectItem value="glosado_parcialmente">
                      {formatApiStatus("glosado_parcialmente")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Valor</Label>
                  <Input
                    inputMode="decimal"
                    value={editForm.value}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, value: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Recebido</Label>
                  <Input
                    inputMode="decimal"
                    value={editForm.paid}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, paid: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Observações</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, notes: e.target.value }))
                }
              />
            </div>
          </div>

          {!editCanSave ? (
            <div className="text-xs text-muted-foreground">
              Preencha os campos marcados como obrigatório.
            </div>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-gradient-primary shadow-elegant"
              disabled={!editCanSave || editSaving}
              onClick={saveEdit}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  {deleteTarget.nome_paciente ?? "Paciente"} •{" "}
                  {formatDatePtBR(resolveBestIso(deleteTarget))}
                  {formatTimePtBR(resolveBestIso(deleteTarget))
                    ? ` às ${formatTimePtBR(resolveBestIso(deleteTarget))}`
                    : ""}
                </>
              ) : (
                "Este item será removido permanentemente."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              onClick={() => {
                setDeleteOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
