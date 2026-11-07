import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Loader2,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";

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
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  formatBRL,
  formatMoneyInput,
  maskMoneyInput,
  parseBRL,
  safeMoney,
} from "@/lib/mock-data";

type ApiEncontroStatus =
  | "agendado"
  | "produzido"
  | "pago"
  | "glosado_total"
  | "glosado_parcialmente";

type ApiEncontro = {
  id: string;
  status?: ApiEncontroStatus | null;
  nome_paciente?: string | null;
  convenio_utilizado?: string | null;
  numero_guia_convenio?: string | null;
  nome_procedimento?: string | null;
  data_evento?: string | null;
  data_encontro?: string | null;
  data_pagamento?: string | null;
  tipo_encontro?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  usado_conciliacao?: boolean | null;
  conciliado_com_ids?: string[] | null;
  conciliado_por_extrato_id?: string | null;
  updated_at?: string | null;
};

type ConciliacaoResponse = {
  summary: {
    total_encontros: number;
    total_a_receber: number;
    total_recebido: number;
    total_glosado: number;
  } | null;
};

type ConciliacaoPageData = {
  conciliacao: ConciliacaoResponse | null;
  encontros: ApiEncontro[];
  extratosPagamento: ApiEncontro[];
};

type LinkMode = "auto" | "manual";

type DraftLink = {
  extratoId: string;
  lancamentoIds: string[];
  mode: LinkMode;
};

type ApplySelectedConciliacaoResponse = {
  updated: number;
  used_extratos: Array<{
    extrato_id: string;
    encontro_ids: string[];
  }>;
  unmatched_lancamento_ids: string[];
};

type AutoConciliacaoResponse = {
  updated: number;
  used_extratos: number;
  skipped: number;
  unmatched: number;
  total_extratos_analisados: number;
  message: string;
};

const doneStatuses = new Set<ApiEncontroStatus>([
  "pago",
  "glosado_total",
  "glosado_parcialmente",
]);

function normalizeTipoEncontro(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
}

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t).toISOString().slice(0, 10);
}

function parseDateInputValue(value: string): Date | null {
  const raw = value.trim();
  if (!raw) return null;
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return null;
  return new Date(t);
}

function formatDatePtBR(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Date(t).toLocaleDateString("pt-BR");
}

function cleanDescription(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function toFriendlyConciliacaoError(error: unknown) {
  if (!(error instanceof Error))
    return "Nao foi possivel concluir a conciliacao agora.";
  const message = error.message.trim();
  if (!message) return "Nao foi possivel concluir a conciliacao agora.";
  if (message === "Not Found" || message === '{"detail":"Not Found"}') {
    return "Nao foi possivel localizar uma das rotas necessarias para concluir a conciliacao.";
  }
  return message;
}

function withinDays(
  a: string | null | undefined,
  b: string | null | undefined,
  rangeDays: number,
) {
  if (!a || !b) return false;
  const at = Date.parse(a);
  const bt = Date.parse(b);
  if (!Number.isFinite(at) || !Number.isFinite(bt)) return false;
  const diffDays = Math.abs(at - bt) / (1000 * 60 * 60 * 24);
  return diffDays <= rangeDays;
}

function isOverdue(iso: string | null | undefined) {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(t);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

async function readErrorMessage(res: Response): Promise<string> {
  if (res.status === 401) return "Sessão expirada. Faça login novamente.";
  try {
    const payload = (await res.json()) as unknown;
    if (payload && typeof payload === "object" && "detail" in payload) {
      const detail = (payload as { detail?: unknown }).detail;
      if (typeof detail === "string" && detail) return detail;
    }
    return JSON.stringify(payload);
  } catch {
    try {
      const text = await res.text();
      return text || "Erro ao processar a requisição.";
    } catch {
      return "Erro ao processar a requisição.";
    }
  }
}

function showUploadProcessingToast(fileName?: string | null) {
  toast.success("Upload recebido e em processamento", {
    description: fileName
      ? `${fileName} Acompanhe o processamento em Arquivos. Os dados serão atualizados automaticamente.`
      : "Os dados aparecerão na tela assim que o processamento terminar. Acompanhe em Arquivos.",
  });
}

export const Route = createFileRoute("/app/conciliacao")({
  component: Conciliacao,
  head: () => ({ meta: [{ title: "Conciliação — Fatura Viva" }] }),
  loader: async (): Promise<ConciliacaoPageData | null> => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("fv_access_token")
          : null;
      const headers = {
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };
      const [conciliacaoRes, encontrosRes, extratosPagamentoRes] =
        await Promise.all([
          fetch("/api/conciliacao", { headers }),
          fetch("/api/encontros", { headers }),
          fetch("/api/conciliacao/extratos-pagamento", { headers }),
        ]);

      const conciliacao = conciliacaoRes.ok
        ? ((await conciliacaoRes.json()) as ConciliacaoResponse)
        : null;
      const encontrosRaw = encontrosRes.ok
        ? ((await encontrosRes.json()) as unknown)
        : [];
      const encontros = Array.isArray(encontrosRaw)
        ? (encontrosRaw as ApiEncontro[])
        : [];
      const extratosPagamentoRaw = extratosPagamentoRes.ok
        ? ((await extratosPagamentoRes.json()) as unknown)
        : [];
      const extratosPagamento = Array.isArray(extratosPagamentoRaw)
        ? (extratosPagamentoRaw as ApiEncontro[])
        : [];

      return {
        conciliacao,
        encontros,
        extratosPagamento,
      } as ConciliacaoPageData;
    } catch {
      return null;
    }
  },
});

function Conciliacao() {
  const data = Route.useLoaderData();
  const [conciliacao, setConciliacao] = useState<ConciliacaoResponse | null>(
    data?.conciliacao ?? null,
  );
  const [encontros, setEncontros] = useState<ApiEncontro[]>(
    data?.encontros ?? [],
  );
  const [extratosPagamento, setExtratosPagamento] = useState<ApiEncontro[]>(
    data?.extratosPagamento ?? [],
  );

  const [importOpen, setImportOpen] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2>(1);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [autoMagicAfterUpload, setAutoMagicAfterUpload] = useState(true);
  const [uploading, setUploading] = useState(false);
  const importFileRef = useRef<HTMLInputElement | null>(null);

  const [uploadGuiaOpen, setUploadGuiaOpen] = useState(false);
  const [uploadGuiaFile, setUploadGuiaFile] = useState<File | null>(null);
  const [uploadGuiaUploading, setUploadGuiaUploading] = useState(false);
  const uploadGuiaFileRef = useRef<HTMLInputElement | null>(null);

  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");

  const [manualExtratoOpen, setManualExtratoOpen] = useState(false);
  const [manualExtratoSaving, setManualExtratoSaving] = useState(false);
  const [patientPickerOpen, setPatientPickerOpen] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientNames, setPatientNames] = useState<string[]>([]);
  const [createdPatients, setCreatedPatients] = useState<string[]>([]);
  const [convenioPickerOpen, setConvenioPickerOpen] = useState(false);
  const [convenioQuery, setConvenioQuery] = useState("");
  const [convenioNames, setConvenioNames] = useState<string[]>([]);
  const [addingConvenio, setAddingConvenio] = useState(false);
  const [manualExtratoForm, setManualExtratoForm] = useState({
    date: "",
    value: "",
    patientName: "",
    convenioName: "",
    procedureName: "",
    procedureDate: "",
    guiaNumber: "",
  });
  const [checkedExtratoIds, setCheckedExtratoIds] = useState<string[]>([]);
  const [checkedLancamentoIds, setCheckedLancamentoIds] = useState<string[]>(
    [],
  );
  const [draftLink, setDraftLink] = useState<DraftLink | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<
    "extrato" | "lancamentos" | "ambos"
  >("ambos");
  const [deletingSelection, setDeletingSelection] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    party: "",
    category: "",
    description: "",
    due: "",
    value: "",
  });
  const [editExtratoOpen, setEditExtratoOpen] = useState(false);
  const [editExtratoSaving, setEditExtratoSaving] = useState(false);
  const [editingExtratoId, setEditingExtratoId] = useState<string | null>(null);
  const [editExtratoForm, setEditExtratoForm] = useState({
    date: "",
    value: "",
    patientName: "",
    convenioName: "",
    procedureName: "",
    procedureDate: "",
    guiaNumber: "",
  });
  const [editLancamentoOpen, setEditLancamentoOpen] = useState(false);
  const [editLancamentoSaving, setEditLancamentoSaving] = useState(false);
  const [editingLancamentoId, setEditingLancamentoId] = useState<string | null>(
    null,
  );
  const [editLancamentoForm, setEditLancamentoForm] = useState({
    patientName: "",
    convenioName: "",
    procedureName: "",
    guiaNumber: "",
    due: "",
    value: "",
    paymentDate: "",
    paidValue: "",
  });
  const [applying, setApplying] = useState(false);
  const [refreshingPanels, setRefreshingPanels] = useState(false);
  const selectedExtratoId = checkedExtratoIds[0] ?? null;
  const selectedLancamentoIds = checkedLancamentoIds;

  useEffect(() => {
    setConciliacao(data?.conciliacao ?? null);
    setEncontros(data?.encontros ?? []);
    setExtratosPagamento(data?.extratosPagamento ?? []);
  }, [data?.conciliacao, data?.encontros, data?.extratosPagamento]);

  const refreshConvenios = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const res = await fetch("/api/configuracoes", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const raw = (await res.json()) as unknown;
    const list = (raw as any)?.convenios_atendidos;
    if (!Array.isArray(list)) return;
    const names = list
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      .map((v) => v.replace(/\s+/g, " ").trim());
    setConvenioNames(names);
  };

  const addConvenioAtendido = async (name: string) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    const trimmed = name.replace(/\s+/g, " ").trim();
    if (!trimmed) return;

    setAddingConvenio(true);
    try {
      const res = await fetch("/api/configuracoes", {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ add_convenios_atendidos: [trimmed] }),
      });
      if (!res.ok) {
        toast.error("Não foi possível salvar o convênio", {
          description: await readErrorMessage(res),
        });
        return;
      }
      const remote = (await res.json()) as any;
      const remoteList = remote?.convenios_atendidos;
      if (Array.isArray(remoteList)) {
        const names = remoteList
          .filter(
            (v: unknown): v is string =>
              typeof v === "string" && v.trim().length > 0,
          )
          .map((v: string) => v.replace(/\s+/g, " ").trim());
        setConvenioNames(names);
      } else {
        setConvenioNames((prev) => {
          const seen = new Set(prev.map((v) => v.toLowerCase()));
          if (seen.has(trimmed.toLowerCase())) return prev;
          return [...prev, trimmed];
        });
      }
      setManualExtratoForm((s) => ({ ...s, convenioName: trimmed }));
      toast.success("Convênio adicionado", { description: trimmed });
      setConvenioPickerOpen(false);
      setConvenioQuery("");
    } finally {
      setAddingConvenio(false);
    }
  };

  const refreshPatients = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const res = await fetch("/api/pacientes", {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const raw = (await res.json()) as unknown;
    if (!Array.isArray(raw)) return;
    const names = raw
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      .map((v) => v.trim());
    setPatientNames(names);
  };

  useEffect(() => {
    refreshPatients().catch(() => {});
    refreshConvenios().catch(() => {});
  }, []);

  const openImport = () => {
    setImportStep(1);
    setImportFile(null);
    setAutoMagicAfterUpload(true);
    setImportOpen(true);
  };

  const openUploadGuia = () => {
    setUploadGuiaFile(null);
    setUploadGuiaOpen(true);
  };

  const uploadGuia = async () => {
    const file = uploadGuiaFile;
    if (!file) return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    setUploadGuiaOpen(false);
    setUploadGuiaFile(null);
    showUploadProcessingToast(file.name);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/arquivo/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body,
      });
      if (!res.ok) {
        toast.error("Falha ao enviar guia", {
          description: await readErrorMessage(res),
        });
        return;
      }
    } finally {
      if (uploadGuiaFileRef.current) uploadGuiaFileRef.current.value = "";
    }
  };

  const openManualExtrato = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setPatientPickerOpen(false);
    setPatientQuery("");
    setConvenioPickerOpen(false);
    setConvenioQuery("");
    setManualExtratoForm({
      date: today.toISOString().slice(0, 10),
      value: "",
      patientName: "",
      convenioName: "",
      procedureName: "",
      procedureDate: today.toISOString().slice(0, 10),
      guiaNumber: "",
    });
    refreshPatients().catch(() => {});
    refreshConvenios().catch(() => {});
    setManualExtratoOpen(true);
  };

  const openEditExtrato = (item: ApiEncontro) => {
    setEditingExtratoId(item.id);
    setEditExtratoForm({
      date: toDateInputValue(item.data_encontro ?? item.data_evento),
      value:
        item.valor_receber != null || item.valor_recebido != null
          ? formatMoneyInput(
              safeMoney(item.valor_receber ?? item.valor_recebido),
            )
          : "",
      patientName: item.nome_paciente ?? "",
      convenioName: item.convenio_utilizado ?? "",
      procedureName: item.nome_procedimento ?? "",
      procedureDate: toDateInputValue(item.data_evento),
      guiaNumber: item.numero_guia_convenio ?? "",
    });
    setEditExtratoOpen(true);
  };

  const openEditLancamento = (item: ApiEncontro) => {
    setEditingLancamentoId(item.id);
    setEditLancamentoForm({
      patientName: item.nome_paciente ?? "",
      convenioName: item.convenio_utilizado ?? "",
      procedureName: item.nome_procedimento ?? "",
      guiaNumber: item.numero_guia_convenio ?? "",
      due: toDateInputValue(item.data_encontro ?? item.data_evento),
      value:
        item.valor_receber != null
          ? formatMoneyInput(safeMoney(item.valor_receber))
          : "",
      paymentDate: toDateInputValue(item.data_pagamento),
      paidValue:
        item.valor_recebido != null
          ? formatMoneyInput(safeMoney(item.valor_recebido))
          : "",
    });
    setEditLancamentoOpen(true);
  };

  const refreshAll = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    };
    setRefreshingPanels(true);
    try {
      const [concRes, encRes, extRes] = await Promise.all([
        fetch("/api/conciliacao", { headers }),
        fetch("/api/encontros", { headers }),
        fetch("/api/conciliacao/extratos-pagamento", { headers }),
      ]);
      if (concRes.ok)
        setConciliacao((await concRes.json()) as ConciliacaoResponse);
      if (encRes.ok) {
        const raw = (await encRes.json()) as unknown;
        if (Array.isArray(raw)) setEncontros(raw as ApiEncontro[]);
      }
      if (extRes.ok) {
        const raw = (await extRes.json()) as unknown;
        if (Array.isArray(raw)) setExtratosPagamento(raw as ApiEncontro[]);
      }
    } finally {
      setRefreshingPanels(false);
    }
  };

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
  const patientOptions = useMemo(() => {
    const merged = [...createdPatients, ...patientNames];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const name of merged) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
    out.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
    return out;
  }, [createdPatients, patientNames]);

  const filteredPatientNames = useMemo(() => {
    if (!patientQueryTrimmed) return patientOptions.slice(0, 8);
    const q = patientQueryTrimmed.toLowerCase();
    return patientOptions
      .filter((n) => n.toLowerCase().includes(q))
      .slice(0, 8);
  }, [patientOptions, patientQueryTrimmed]);

  const hasExactPatientMatch = useMemo(() => {
    if (!patientQueryTrimmed) return false;
    const q = patientQueryTrimmed.toLowerCase();
    return patientOptions.some((n) => n.toLowerCase() === q);
  }, [patientOptions, patientQueryTrimmed]);

  const convenioQueryTrimmed = convenioQuery.trim();
  const convenioOptions = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const name of convenioNames) {
      const trimmed = name.replace(/\s+/g, " ").trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
    out.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
    return out;
  }, [convenioNames]);

  const filteredConvenioNames = useMemo(() => {
    if (!convenioQueryTrimmed) return convenioOptions.slice(0, 8);
    const q = convenioQueryTrimmed.toLowerCase();
    return convenioOptions
      .filter((n) => n.toLowerCase().includes(q))
      .slice(0, 8);
  }, [convenioOptions, convenioQueryTrimmed]);

  const hasExactConvenioMatch = useMemo(() => {
    if (!convenioQueryTrimmed) return false;
    const q = convenioQueryTrimmed.toLowerCase();
    return convenioOptions.some((n) => n.toLowerCase() === q);
  }, [convenioOptions, convenioQueryTrimmed]);

  const uploadExtrato = async () => {
    const file = importFile;
    if (!file) return;
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setImportOpen(false);
    setImportFile(null);
    setImportStep(1);
    showUploadProcessingToast(file.name);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/arquivo/upload/extrato-pagamento", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body,
      });
      if (!res.ok) {
        toast.error("Falha ao importar extrato", {
          description: await readErrorMessage(res),
        });
        return;
      }
    } finally {
      if (importFileRef.current) importFileRef.current.value = "";
    }
  };

  const createManualExtrato = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    const dt = manualExtratoForm.date
      ? new Date(manualExtratoForm.date).toISOString()
      : null;
    const procDt = manualExtratoForm.procedureDate
      ? new Date(manualExtratoForm.procedureDate).toISOString()
      : null;
    const value = parseBRL(manualExtratoForm.value);
    if (!dt || !value) {
      toast.error("Preencha data e valor.");
      return;
    }

    const patientName = manualExtratoForm.patientName.trim();
    const convenioName = manualExtratoForm.convenioName.trim();
    const procedureName = manualExtratoForm.procedureName.trim();
    const guiaNumber = manualExtratoForm.guiaNumber.trim();

    setManualExtratoSaving(true);
    try {
      const payload = {
        nome_paciente: patientName || null,
        nome_procedimento: procedureName || null,
        convenio_utilizado: convenioName || null,
        numero_guia_convenio: guiaNumber || null,
        data_evento: procDt,
        data_encontro: dt,
        valor_receber: value,
        tipo_encontro: "extrato-pagamento",
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
        toast.error("Falha ao adicionar transação", {
          description: await readErrorMessage(res),
        });
        return;
      }

      toast.success("Transação adicionada");
      setManualExtratoOpen(false);
      await refreshAll();
    } finally {
      setManualExtratoSaving(false);
    }
  };

  const extratoItems = useMemo(() => {
    const inicio = parseDateInputValue(periodoInicio);
    const fim = parseDateInputValue(periodoFim);
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/[^\d]/g, "");
    const done = doneStatuses;

    return extratosPagamento
      .filter((e) => {
        const status = (e.status ?? "agendado") as ApiEncontroStatus;
        if (done.has(status)) return false;
        if (e.usado_conciliacao) return false;
        const iso = e.data_encontro ?? e.data_evento ?? null;
        if (inicio) {
          const t = iso ? Date.parse(iso) : NaN;
          if (Number.isFinite(t) && new Date(t) < inicio) return false;
        }
        if (fim) {
          const t = iso ? Date.parse(iso) : NaN;
          if (Number.isFinite(t)) {
            const d = new Date(t);
            const end = new Date(fim);
            end.setHours(23, 59, 59, 999);
            if (d > end) return false;
          }
        }
        return true;
      })
      .filter((e) => {
        if (!q) return true;
        const iso = e.data_encontro ?? e.data_evento ?? null;
        const value = safeMoney(e.valor_recebido ?? e.valor_receber);
        const cents = String(Math.round(value * 100));
        const description = cleanDescription(
          e.nome_procedimento ?? e.nome_paciente ?? "Transação",
        );
        const blob =
          `${description} ${formatDatePtBR(iso)} ${String(value)}`.toLowerCase();
        if (blob.includes(q)) return true;
        if (qDigits && cents.includes(qDigits)) return true;
        return false;
      })
      .slice()
      .sort((a, b) => {
        const at = a.data_encontro ?? a.data_evento ?? a.updated_at ?? null;
        const bt = b.data_encontro ?? b.data_evento ?? b.updated_at ?? null;
        const aTime = at ? Date.parse(at) : 0;
        const bTime = bt ? Date.parse(bt) : 0;
        return bTime - aTime;
      })
      .map((e) => {
        const iso = e.data_encontro ?? e.data_evento ?? null;
        const value = safeMoney(e.valor_recebido ?? e.valor_receber);
        const description = cleanDescription(
          e.nome_procedimento ?? e.nome_paciente ?? "Transação",
        );
        const status = (e.status ?? "agendado") as ApiEncontroStatus;
        return { raw: e, id: e.id, iso, value, description, status };
      });
  }, [extratosPagamento, periodoInicio, periodoFim, query]);

  const lancamentos = useMemo(() => {
    const inicio = parseDateInputValue(periodoInicio);
    const fim = parseDateInputValue(periodoFim);
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/[^\d]/g, "");
    return encontros
      .filter(
        (e) => normalizeTipoEncontro(e.tipo_encontro) !== "extrato-pagamento",
      )
      .filter((e) => {
        const iso = e.data_encontro ?? e.data_evento ?? null;
        if (inicio) {
          const t = iso ? Date.parse(iso) : NaN;
          if (Number.isFinite(t) && new Date(t) < inicio) return false;
        }
        if (fim) {
          const t = iso ? Date.parse(iso) : NaN;
          if (Number.isFinite(t)) {
            const d = new Date(t);
            const end = new Date(fim);
            end.setHours(23, 59, 59, 999);
            if (d > end) return false;
          }
        }
        return true;
      })
      .filter((e) => {
        if (!q) return true;
        const value = safeMoney(e.valor_receber);
        const cents = String(Math.round(value * 100));
        const blob =
          `${e.nome_paciente ?? ""} ${e.nome_procedimento ?? ""} ${e.convenio_utilizado ?? ""} ${String(e.valor_receber ?? "")}`.toLowerCase();
        if (blob.includes(q)) return true;
        if (qDigits && cents.includes(qDigits)) return true;
        return false;
      })
      .slice()
      .sort((a, b) => {
        const at = a.data_encontro ?? a.data_evento ?? a.updated_at ?? null;
        const bt = b.data_encontro ?? b.data_evento ?? b.updated_at ?? null;
        const aTime = at ? Date.parse(at) : 0;
        const bTime = bt ? Date.parse(bt) : 0;
        return bTime - aTime;
      })
      .map((e) => {
        const iso = e.data_encontro ?? e.data_evento ?? null;
        const value = safeMoney(e.valor_receber);
        const party = cleanDescription(e.nome_paciente ?? "Cliente/Fornecedor");
        const category = cleanDescription(e.convenio_utilizado ?? "");
        const desc = cleanDescription(e.nome_procedimento ?? "");
        const status = (e.status ?? "agendado") as ApiEncontroStatus;
        return { raw: e, id: e.id, iso, value, party, category, desc, status };
      });
  }, [encontros, periodoInicio, periodoFim, query]);

  const totalExtrato = extratoItems.length;
  const conciliados = extratoItems.filter((t) =>
    doneStatuses.has(t.status),
  ).length;
  const progresso = totalExtrato
    ? Math.round((conciliados / totalExtrato) * 100)
    : 0;

  const selectedExtrato = useMemo(() => {
    if (!selectedExtratoId) return null;
    return extratoItems.find((x) => x.id === selectedExtratoId) ?? null;
  }, [extratoItems, selectedExtratoId]);

  const suggestionsByExtratoId = useMemo(() => {
    const rightPending = lancamentos.filter((l) => !doneStatuses.has(l.status));
    const map = new Map<
      string,
      { lancamentoId: string; confidence: number; tone: "green" | "yellow" }
    >();

    for (const t of extratoItems) {
      if (doneStatuses.has(t.status)) continue;
      if (!t.iso) continue;
      let best: {
        id: string;
        confidence: number;
        tone: "green" | "yellow";
      } | null = null;

      for (const l of rightPending) {
        if (!l.iso) continue;
        const sameValue = Math.abs(t.value - l.value) < 0.01;
        if (!sameValue) continue;
        const near = withinDays(t.iso, l.iso, 2);
        const confidence = near ? 0.95 : 0.7;
        const tone = near ? "green" : "yellow";
        if (!best || confidence > best.confidence)
          best = { id: l.id, confidence, tone };
      }

      if (best)
        map.set(t.id, {
          lancamentoId: best.id,
          confidence: best.confidence,
          tone: best.tone,
        });
    }

    return map;
  }, [extratoItems, lancamentos]);

  const highlightedLancamentos = useMemo(() => {
    if (!selectedExtrato) return new Set<string>();
    const ids = new Set<string>();
    for (const l of lancamentos) {
      if (Math.abs(selectedExtrato.value - l.value) < 0.01) ids.add(l.id);
    }
    return ids;
  }, [lancamentos, selectedExtrato]);

  useEffect(() => {
    if (!selectedExtratoId || !selectedLancamentoIds.length) {
      setDraftLink(null);
      return;
    }
    setDraftLink({
      extratoId: selectedExtratoId,
      lancamentoIds: selectedLancamentoIds,
      mode: "manual",
    });
  }, [selectedExtratoId, selectedLancamentoIds]);

  const computeStatusForAmount = (
    received: number,
    expected: number,
  ): ApiEncontroStatus => {
    if (received <= 0) return "glosado_total";
    if (expected > 0 && received < expected * 0.99)
      return "glosado_parcialmente";
    return "pago";
  };

  const updateEncontro = async (
    encontroId: string,
    payload: Record<string, unknown>,
  ) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");
    const res = await fetch(
      `/api/encontros/${encodeURIComponent(encontroId)}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) throw new Error(await readErrorMessage(res));
  };

  const updateExtratoPagamento = async (
    extratoId: string,
    payload: Record<string, unknown>,
  ) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");
    const res = await fetch(
      `/api/conciliacao/extratos-pagamento/${encodeURIComponent(extratoId)}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) throw new Error(await readErrorMessage(res));
  };

  const updateStatus = async (
    encontroId: string,
    status: ApiEncontroStatus,
  ) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");
    const res = await fetch(
      `/api/encontros/${encodeURIComponent(encontroId)}/status`,
      {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    );
    if (!res.ok) throw new Error(await readErrorMessage(res));
  };

  const saveEditedExtrato = async () => {
    if (!editingExtratoId) return;

    const date = editExtratoForm.date.trim();
    const valueText = editExtratoForm.value.trim();
    if (!date || !valueText) {
      toast.error("Preencha a data e o valor do item do extrato.");
      return;
    }

    setEditExtratoSaving(true);
    try {
      await updateExtratoPagamento(editingExtratoId, {
        nome_paciente: editExtratoForm.patientName.trim() || null,
        convenio_utilizado: editExtratoForm.convenioName.trim() || null,
        numero_guia_convenio: editExtratoForm.guiaNumber.trim() || null,
        nome_procedimento: editExtratoForm.procedureName.trim() || null,
        data_evento: editExtratoForm.procedureDate.trim()
          ? new Date(editExtratoForm.procedureDate).toISOString()
          : null,
        data_encontro: new Date(date).toISOString(),
        valor_receber: parseBRL(valueText),
      });

      toast.success("Item do extrato atualizado");
      setEditExtratoOpen(false);
      await refreshAll();
    } catch (err) {
      toast.error("Nao foi possivel atualizar o item do extrato", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    } finally {
      setEditExtratoSaving(false);
    }
  };

  const saveEditedLancamento = async () => {
    if (!editingLancamentoId) return;

    const due = editLancamentoForm.due.trim();
    const valueText = editLancamentoForm.value.trim();
    if (!due || !valueText) {
      toast.error("Preencha a data e o valor do lançamento.");
      return;
    }

    setEditLancamentoSaving(true);
    try {
      await updateEncontro(editingLancamentoId, {
        nome_paciente: editLancamentoForm.patientName.trim() || null,
        convenio_utilizado: editLancamentoForm.convenioName.trim() || null,
        numero_guia_convenio: editLancamentoForm.guiaNumber.trim() || null,
        nome_procedimento: editLancamentoForm.procedureName.trim() || null,
        data_encontro: new Date(due).toISOString(),
        data_pagamento: editLancamentoForm.paymentDate.trim()
          ? new Date(editLancamentoForm.paymentDate).toISOString()
          : null,
        valor_receber: parseBRL(valueText),
        valor_recebido: editLancamentoForm.paidValue.trim()
          ? parseBRL(editLancamentoForm.paidValue)
          : null,
      });

      toast.success("Lançamento atualizado");
      setEditLancamentoOpen(false);
      await refreshAll();
    } catch (err) {
      toast.error("Nao foi possivel atualizar o lançamento", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    } finally {
      setEditLancamentoSaving(false);
    }
  };

  const applySelectedConciliacao = async (
    extratoIds: string[],
    lancamentoIds: string[],
  ) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");

    const uniqueExtratoIds = [...new Set(extratoIds.filter(Boolean))];
    const uniqueLancamentoIds = [...new Set(lancamentoIds.filter(Boolean))];
    if (!uniqueExtratoIds.length || !uniqueLancamentoIds.length) {
      throw new Error("Selecione ao menos um item do extrato e um lançamento.");
    }

    try {
      const res = await fetch("/api/conciliacao", {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          extrato_ids: uniqueExtratoIds,
          lancamento_ids: uniqueLancamentoIds,
        }),
      });

      if (res.status === 404) {
        return applySelectedConciliacaoFallback(
          uniqueExtratoIds,
          uniqueLancamentoIds,
        );
      }

      if (!res.ok) throw new Error(await readErrorMessage(res));
      return (await res.json()) as ApplySelectedConciliacaoResponse;
    } catch (error) {
      // Se a rota nova ainda nao estiver ativa, mantemos a conciliacao funcionando
      // com o fluxo compativel; nos demais casos preservamos o erro do backend.
      if (
        error instanceof Error &&
        (error.message === "Not Found" ||
          error.message === '{"detail":"Not Found"}' ||
          error.message.includes("Failed to fetch"))
      ) {
        return applySelectedConciliacaoFallback(
          uniqueExtratoIds,
          uniqueLancamentoIds,
        );
      }
      throw error;
    }
  };

  const applySelectedConciliacaoFallback = async (
    extratoIds: string[],
    lancamentoIds: string[],
  ): Promise<ApplySelectedConciliacaoResponse> => {
    const extratosByGuia = new Map<string, ApiEncontro>();
    const extratosById = new Map<string, ApiEncontro>();

    for (const extratoId of extratoIds) {
      const extrato = extratosPagamento.find((item) => item.id === extratoId);
      if (!extrato) continue;
      extratosById.set(extrato.id, extrato);
      const guia = normalizeText(extrato.numero_guia_convenio);
      if (guia && !extratosByGuia.has(guia)) {
        extratosByGuia.set(guia, extrato);
      }
    }

    const extratosUsados = new Map<string, string[]>();
    const unmatchedLancamentoIds: string[] = [];
    let updated = 0;

    for (const lancamentoId of lancamentoIds) {
      const lancamento = encontros.find((item) => item.id === lancamentoId);
      if (!lancamento) {
        unmatchedLancamentoIds.push(lancamentoId);
        continue;
      }
      if (
        normalizeTipoEncontro(lancamento.tipo_encontro) === "extrato-pagamento"
      ) {
        unmatchedLancamentoIds.push(lancamentoId);
        continue;
      }

      const guia = normalizeText(lancamento.numero_guia_convenio);
      const extrato = guia ? (extratosByGuia.get(guia) ?? null) : null;
      if (!extrato) {
        unmatchedLancamentoIds.push(lancamentoId);
        continue;
      }

      const valorExtrato = safeMoney(
        extrato.valor_recebido ?? extrato.valor_receber,
      );
      const valorEncontro = safeMoney(lancamento.valor_receber);
      const status = computeStatusForAmount(valorExtrato, valorEncontro);

      await updateEncontro(lancamento.id, {
        valor_recebido: valorExtrato,
        status,
        conciliado_por_extrato_id: extrato.id,
      });

      const existingIds = [
        ...new Set([...(extrato.conciliado_com_ids ?? []), lancamento.id]),
      ];
      await updateEncontro(extrato.id, {
        usado_conciliacao: true,
        conciliado_com_ids: existingIds,
      });

      extrato.conciliado_com_ids = existingIds;
      extrato.usado_conciliacao = true;
      const current = extratosUsados.get(extrato.id) ?? [];
      if (!current.includes(lancamento.id)) {
        current.push(lancamento.id);
      }
      extratosUsados.set(extrato.id, current);
      updated += 1;
    }

    return {
      updated,
      used_extratos: Array.from(extratosUsados.entries()).map(
        ([extrato_id, encontro_ids]) => ({
          extrato_id,
          encontro_ids,
        }),
      ),
      unmatched_lancamento_ids: unmatchedLancamentoIds,
    };
  };

  const deleteEncontro = async (encontroId: string) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");
    const res = await fetch(
      `/api/encontros/${encodeURIComponent(encontroId)}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw new Error(await readErrorMessage(res));
  };

  const deleteEncontros = async (encontroIds: string[]) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");
    const uniqueIds = [...new Set(encontroIds.filter(Boolean))];
    if (!uniqueIds.length) return;

    const res = await fetch("/api/encontros", {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ encontro_ids: uniqueIds }),
    });
    if (res.ok) return;

    if (res.status === 404) {
      await Promise.all(uniqueIds.map((id) => deleteEncontro(id)));
      return;
    }

    throw new Error(await readErrorMessage(res));
  };

  const selectVisibleExtratoItems = () => {
    const ids = extratoItems.map((item) => item.id);
    const allSelected =
      ids.length > 0 && ids.every((id) => checkedExtratoIds.includes(id));
    setCheckedExtratoIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : ids,
    );
  };

  const selectVisibleLancamentos = () => {
    const ids = lancamentos.map((item) => item.id);
    const allSelected =
      ids.length > 0 && ids.every((id) => checkedLancamentoIds.includes(id));
    setCheckedLancamentoIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : ids,
    );
  };

  const requestDeleteSelection = (
    target: "extrato" | "lancamentos" | "ambos",
  ) => {
    const hasExtrato = checkedExtratoIds.length > 0;
    const hasLancamentos = checkedLancamentoIds.length > 0;
    if (
      (target === "extrato" && !hasExtrato) ||
      (target === "lancamentos" && !hasLancamentos) ||
      (target === "ambos" && !hasExtrato && !hasLancamentos)
    ) {
      toast.error("Selecione ao menos um card para excluir.");
      return;
    }
    setDeleteTarget(target);
    setDeleteSelectionOpen(true);
  };

  const openDeleteSelection = (target: "extrato" | "lancamentos" | "ambos") => {
    setDeleteTarget(target);
    setDeleteSelectionOpen(true);
  };

  const deleteTargetIds = useMemo(() => {
    if (deleteTarget === "extrato") return checkedExtratoIds;
    if (deleteTarget === "lancamentos") return checkedLancamentoIds;
    return [...new Set([...checkedExtratoIds, ...checkedLancamentoIds])];
  }, [checkedExtratoIds, checkedLancamentoIds, deleteTarget]);

  const deleteTargetLabel =
    deleteTarget === "extrato"
      ? "transações do extrato"
      : deleteTarget === "lancamentos"
        ? "lançamentos"
        : "cards selecionados";

  const allVisibleExtratoSelected =
    extratoItems.length > 0 &&
    extratoItems.every((item) => checkedExtratoIds.includes(item.id));

  const allVisibleLancamentosSelected =
    lancamentos.length > 0 &&
    lancamentos.every((item) => checkedLancamentoIds.includes(item.id));

  const extratoPanelLoading =
    refreshingPanels || uploading || manualExtratoSaving || applying;
  const lancamentosPanelLoading = refreshingPanels || creating || applying;

  const confirmDeleteSelection = async () => {
    if (!deleteTargetIds.length || deletingSelection) return;

    setDeletingSelection(true);
    try {
      await deleteEncontros(deleteTargetIds);

      setEncontros((prev) =>
        prev.filter((item) => !deleteTargetIds.includes(item.id)),
      );
      setExtratosPagamento((prev) =>
        prev.filter((item) => !deleteTargetIds.includes(item.id)),
      );

      setCheckedExtratoIds((prev) =>
        prev.filter((id) => !deleteTargetIds.includes(id)),
      );
      setCheckedLancamentoIds((prev) =>
        prev.filter((id) => !deleteTargetIds.includes(id)),
      );
      setDraftLink((prev) => {
        if (!prev) return null;
        if (deleteTargetIds.includes(prev.extratoId)) return null;
        const lancamentoIds = prev.lancamentoIds.filter(
          (id) => !deleteTargetIds.includes(id),
        );
        if (!lancamentoIds.length) return null;
        return { ...prev, lancamentoIds };
      });

      setDeleteSelectionOpen(false);
      toast.success("Cards excluídos", {
        description:
          deleteTargetIds.length === 1
            ? "1 item removido"
            : `${deleteTargetIds.length} itens removidos`,
      });
      await refreshAll();
    } catch (err) {
      toast.error("Falha ao excluir cards", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    } finally {
      setDeletingSelection(false);
    }
  };

  const applyLink = async (link: DraftLink) => {
    const t = extratoItems.find((x) => x.id === link.extratoId);
    if (!t) return;
    const ls = link.lancamentoIds
      .map((id) => lancamentos.find((l) => l.id === id))
      .filter(Boolean) as Array<(typeof lancamentos)[number]>;
    if (!ls.length) return;

    setApplying(true);
    try {
      const extratoValue = t.value;
      const expectedSum = ls.reduce(
        (sum, l) => sum + safeMoney(l.raw.valor_receber),
        0,
      );
      const status = computeStatusForAmount(extratoValue, expectedSum);

      const weights = ls.map((l) => safeMoney(l.raw.valor_receber));
      const weightsSum = weights.reduce((sum, v) => sum + v, 0);
      const receivedByLancamento = ls.map((_, idx) => {
        if (ls.length === 1) return extratoValue;
        if (!weightsSum) return extratoValue / ls.length;
        const share = (weights[idx] / weightsSum) * extratoValue;
        return Math.max(0, share);
      });

      await Promise.all([
        updateEncontro(t.id, { valor_recebido: extratoValue }),
        updateStatus(t.id, status),
        ...ls.flatMap((l, idx) => [
          updateEncontro(l.id, { valor_recebido: receivedByLancamento[idx] }),
          updateStatus(l.id, status),
        ]),
      ]);

      toast.success("Conciliação aplicada", {
        description:
          ls.length === 1
            ? "1 lançamento atualizado"
            : `${ls.length} lançamentos atualizados (split)`,
      });
      setDraftLink(null);
      setCheckedExtratoIds([]);
      setCheckedLancamentoIds([]);
      await refreshAll();
    } catch (err) {
      toast.error("Falha ao aplicar conciliação", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    } finally {
      setApplying(false);
    }
  };

  const conciliacaoRelampago = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessao expirada", {
        description: "Entre novamente para continuar a conciliacao.",
      });
      return;
    }

    setApplying(true);
    try {
      const res = await fetch("/api/conciliacao/auto", {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }
      const result = (await res.json()) as AutoConciliacaoResponse;

      if (!result.updated) {
        toast.message(
          "Nao encontramos itens suficientes para conciliar agora",
          {
            description:
              result.message ||
              "Revise os dados do extrato e dos lancamentos para tentar novamente.",
          },
        );
        await refreshAll();
        return;
      }

      toast.success("Conciliacao automatica concluida", {
        description:
          `${result.message} ${result.used_extratos} item(ns) do extrato foram aproveitados e ${result.unmatched} ficaram para revisao manual.`.trim(),
      });
      await refreshAll();
      setDraftLink(null);
      setCheckedExtratoIds([]);
      setCheckedLancamentoIds([]);
    } catch (err) {
      toast.error("Nao foi possivel concluir a conciliacao automatica", {
        description: toFriendlyConciliacaoError(err),
      });
    } finally {
      setApplying(false);
    }
  };

  const confirmChecked = async () => {
    const extratoIds = checkedExtratoIds.length
      ? checkedExtratoIds
      : draftLink
        ? [draftLink.extratoId]
        : selectedExtratoId
          ? [selectedExtratoId]
          : [];
    const lancamentoIds = checkedLancamentoIds.length
      ? checkedLancamentoIds
      : draftLink?.lancamentoIds?.length
        ? draftLink.lancamentoIds
        : selectedLancamentoIds;

    if (!extratoIds.length || !lancamentoIds.length) {
      toast.message("Nada para confirmar", {
        description:
          "Selecione ao menos um item do extrato e um lançamento para conciliar.",
      });
      return;
    }

    setApplying(true);
    try {
      const result = await applySelectedConciliacao(extratoIds, lancamentoIds);
      if (!result.updated) {
        toast.message(
          "Nao encontramos correspondencias para concluir a conciliacao",
          {
            description: result.unmatched_lancamento_ids.length
              ? `${result.unmatched_lancamento_ids.length} lancamento(s) nao bateram com os numeros de guia selecionados.`
              : "Revise os numeros de guia dos itens selecionados e tente novamente.",
          },
        );
        return;
      }

      const extratosUsadosCount = result.used_extratos.length;
      const usedExtratosDescription = result.used_extratos
        .map((item) => `${item.extrato_id}: ${item.encontro_ids.join(", ")}`)
        .join(" | ");
      const unmatchedDescription = result.unmatched_lancamento_ids.length
        ? ` ${result.unmatched_lancamento_ids.length} lancamento(s) ficaram sem correspondencia por guia.`
        : "";

      toast.success("Conciliacao concluida com sucesso", {
        description:
          `${result.updated} lancamento(s) atualizado(s) e ${extratosUsadosCount} item(ns) do extrato marcado(s) como usado(s). ${
            usedExtratosDescription
              ? `Vinculos gerados: ${usedExtratosDescription}.`
              : ""
          }${unmatchedDescription}`.trim(),
      });

      setDraftLink(null);
      setCheckedExtratoIds([]);
      setCheckedLancamentoIds([]);
      await refreshAll();
    } finally {
      setApplying(false);
    }
  };

  const openManualLancamento = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCreateForm({
      party: "",
      category: "",
      description: "",
      due: today.toISOString().slice(0, 10),
      value: "",
    });
    setCreatingOpen(true);
  };

  const startCreateFromSelectedExtrato = () => {
    if (!selectedExtrato) return;
    const iso = selectedExtrato.iso;
    setCreateForm({
      party: "",
      category: "",
      description: selectedExtrato.description,
      due: toDateInputValue(iso),
      value: selectedExtrato.value
        ? formatMoneyInput(selectedExtrato.value)
        : "",
    });
    setCreatingOpen(true);
  };

  const createLancamento = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    const value = parseBRL(createForm.value);
    const due = createForm.due ? new Date(createForm.due).toISOString() : null;
    setCreating(true);
    try {
      const payload = {
        nome_paciente: createForm.party.trim() || "Lançamento",
        nome_procedimento: createForm.description.trim() || "Lançamento",
        convenio_utilizado: createForm.category.trim() || "—",
        numero_guia_convenio: null,
        data_encontro: due,
        valor_receber: value,
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
        toast.error("Falha ao criar lançamento", {
          description: await readErrorMessage(res),
        });
        return;
      }

      toast.success("Lançamento criado");
      setCreatingOpen(false);
      await refreshAll();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" /> Conciliação
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe encontros conciliados por arquivo enviado.
          </p>
        </div>
      </div>

      {!conciliacao && (
        <Alert>
          <AlertTitle>Conciliação indisponível</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados agora. Verifique se você está
            logado.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-5 bg-gradient-card shadow-elegant relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">
                Centro de Conciliação Inteligente
              </div>
              <Badge variant="secondary" className="shrink-0">
                Beta
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Concilie itens do extrato com lançamentos do Fatura Viva, com
              sugestões e batimento rápido.
            </div>
          </div>
          <div />
        </div>

        <div className="mt-4 grid gap-4">
          <div className="rounded-md border bg-background/40 p-4">
            <div className="md:hidden">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
              >
                Filtros
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div
              className={cn(
                "mt-4 hidden flex-wrap gap-4 md:mt-0 md:flex",
                mobileFiltersOpen && "flex",
              )}
            >
              <div className="flex flex-col md:flex-2 p-2">
                <div className="text-xs text-muted-foreground">
                  Progresso: {progresso}% concluído
                </div>
                <div className="mt-2">
                  <Progress value={progresso} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {conciliados}/{totalExtrato} itens conciliados
                </div>
              </div>

              <div className="md:flex md:flex-8 p-2 items-end gap-3 sm:flex-12">
                <div className="grid gap-1 items-center">
                  <div className="text-xs text-muted-foreground">Período</div>
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <Input
                      type="date"
                      className="w-[165px]"
                      value={periodoInicio}
                      onChange={(e) => setPeriodoInicio(e.target.value)}
                    />
                    <span className="text-xs text-muted-foreground">até</span>
                    <Input
                      type="date"
                      className="w-[165px]"
                      value={periodoFim}
                      onChange={(e) => setPeriodoFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-1">
                  <div className="text-xs text-muted-foreground">Busca</div>
                  <div className="relative w-[100%]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Buscar no extrato e lançamentos..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-md border bg-background/40 overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/30">
                <div>
                  <div className="text-sm font-semibold">
                    Lançamentos Fatura Viva
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Guias, extrato de produção e procedimentos adicionados
                    manualmente
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={openManualLancamento}
                      className="w-full"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Adição Manual
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-gradient-primary shadow-elegant w-full"
                      onClick={openUploadGuia}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Upload Guia
                    </Button>
                  </div>
                  {/* <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={selectVisibleLancamentos}
                      disabled={!lancamentos.length}
                      className="w-full"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      {allVisibleLancamentosSelected
                        ? "Retirar Seleção"
                        : "Selecionar Visiveis"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => requestDeleteSelection("lancamentos")}
                      disabled={
                        !checkedLancamentoIds.length || deletingSelection
                      }
                      className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Excluir
                    </Button>
                  </div> */}
                </div>

                {selectedExtrato ? (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Destaque por valor: {formatBRL(selectedExtrato.value)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="p-2 max-h-[680px] overflow-auto">
                {lancamentosPanelLoading ? (
                  <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando Dados
                    </div>
                  </div>
                ) : lancamentos.length ? (
                  <div className="grid gap-2">
                    {lancamentos.map((l) => {
                      const selected = selectedLancamentoIds.includes(l.id);
                      const checked = checkedLancamentoIds.includes(l.id);
                      const highlighted = highlightedLancamentos.has(l.id);
                      const done = doneStatuses.has(l.status);
                      const overdue = !done && isOverdue(l.iso);
                      const valueExact = selectedExtrato
                        ? Math.abs(selectedExtrato.value - l.value) < 0.01
                        : false;
                      const nearDate =
                        selectedExtrato?.iso && l.iso
                          ? withinDays(selectedExtrato.iso, l.iso, 2)
                          : false;

                      const toneClass = overdue
                        ? "border-destructive/50 bg-destructive/5"
                        : highlighted &&
                            valueExact &&
                            !nearDate &&
                            selectedExtrato
                          ? "border-warning/50 bg-warning/5"
                          : highlighted && selectedExtrato
                            ? "border-success/30 bg-success/5"
                            : selected
                              ? "border-primary/50 bg-primary/5"
                              : "hover:bg-muted/30";

                      return (
                        <div
                          key={l.id}
                          className={cn(
                            "w-full rounded-md border p-3 text-left transition-smooth cursor-pointer",
                            toneClass,
                            done && "opacity-80",
                          )}
                          onClick={() => {
                            openEditLancamento(l.raw);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openEditLancamento(l.raw);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div
                            className="flex items-start justify-between gap-2"
                            style={{ position: "relative" }}
                          >
                            <div className="min-w-0 max-w-full">
                              <div className="text-xs text-muted-foreground tabular-nums">
                                Venc.: {formatDatePtBR(l.iso)}
                              </div>
                              <div className="pt-0.5 text-sm font-medium truncate">
                                {l.party}
                              </div>
                              <div className="text-xs text-muted-foreground ">
                                <strong>
                                  {l.category ? `${l.category}` : ""}
                                </strong>
                                <br />
                                {l.desc || "—"}
                              </div>
                              <div className="mt-1 text-sm font-semibold tabular-nums">
                                {formatBRL(l.value)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 absolute top-0 right-0">
                              {overdue ? (
                                <Badge
                                  variant="outline"
                                  className="bg-destructive/10 text-destructive border-destructive/30"
                                >
                                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                  Atrasado
                                </Badge>
                              ) : null}
                              <div
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const next = !!v;
                                    setCheckedLancamentoIds((prev) => {
                                      if (next && !prev.includes(l.id))
                                        return [...prev, l.id];
                                      if (!next)
                                        return prev.filter((id) => id !== l.id);
                                      return prev;
                                    });
                                  }}
                                  aria-label="Selecionar lançamento"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="text-[11px] text-muted-foreground">
                              {selectedExtrato
                                ? valueExact && nearDate
                                  ? "Verde: valor + data compatíveis"
                                  : valueExact
                                    ? "Amarelo: valor igual, datas distantes"
                                    : "—"
                                : "Selecione um item do extrato para conciliar"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                disabled={
                                  !selectedExtrato ||
                                  !selected ||
                                  selectedLancamentoIds.length < 2
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toast.message("Split selecionado", {
                                    description:
                                      "Use o vínculo com múltiplos lançamentos e confirme.",
                                  });
                                }}
                                aria-label="Split (desmembrar)"
                              >
                                <Scissors className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                    Nenhum lançamento encontrado.
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-md border bg-background/40 overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/30">
                <div>
                  <div className="text-sm font-semibold">
                    Procedimentos Pagos
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Pagamentos efetuados pelos convênios ou particular
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={openManualExtrato}
                      className="w-full"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Adição Manual
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-gradient-primary shadow-elegant w-full"
                      onClick={openImport}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Upload Extrato
                    </Button>
                  </div>
                  {/* <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={selectVisibleExtratoItems}
                      disabled={!extratoItems.length}
                      className="w-full"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      {allVisibleExtratoSelected
                        ? "Retirar Seleção"
                        : "Selecionar Visiveis"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => requestDeleteSelection("extrato")}
                      disabled={!checkedExtratoIds.length || deletingSelection}
                      className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Excluir
                    </Button>
                  </div> */}
                </div>
              </div>

              <div className="p-2 max-h-[680px] overflow-auto justify-between">
                {extratoPanelLoading ? (
                  <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando Dados
                    </div>
                  </div>
                ) : extratoItems.length ? (
                  <div className="grid gap-2">
                    {extratoItems.map((t) => {
                      const checked = checkedExtratoIds.includes(t.id);
                      const suggested =
                        suggestionsByExtratoId.get(t.id) ?? null;
                      const selected = checked;
                      const done = doneStatuses.has(t.status);
                      const badge = done ? (
                        <Badge
                          className="bg-success/15 text-success border-success/30"
                          variant="outline"
                        >
                          Conciliado
                        </Badge>
                      ) : suggested ? (
                        <Badge
                          className={cn(
                            "border",
                            suggested.tone === "green"
                              ? "bg-success/10 text-success border-success/30"
                              : "bg-warning/10 text-warning border-warning/30",
                          )}
                          variant="outline"
                        >
                          Sugerido
                        </Badge>
                      ) : (
                        // <Badge variant="secondary">Pendente</Badge>
                        <Badge variant="secondary" className="capitalize">
                          {t.raw.status}
                        </Badge>
                      );

                      return (
                        <div
                          key={t.id}
                          style={{ position: "relative" }}
                          className={cn(
                            "w-full rounded-md border p-3 text-left transition-smooth justify-between cursor-pointer",
                            selected
                              ? "border-primary/50 bg-primary/5"
                              : "hover:bg-muted/30",
                            done && "opacity-80",
                          )}
                          onClick={() => {
                            openEditExtrato(t.raw);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openEditExtrato(t.raw);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          {/* <div className="flex items-start justify-between gap-2 min-w-0 max-w-full" style={{position:'relative'}}> */}
                          <div
                            className="flex items-start justify-between gap-2 "
                            style={{ position: "relative" }}
                          >
                            <div className="min-w-0 max-w-full flex w-[100%] flex-col justify-between md:w-full ">
                              <div className="flex items-start justify-between gap-2 ">
                                <div className="min-w-0">
                                  <div className="text-xs text-muted-foreground tabular-nums">
                                    {formatDatePtBR(t.iso)}
                                  </div>
                                  <div className="pt-0.5 text-sm font-medium truncate">
                                    {t.raw.nome_paciente || "Sem NOme"}
                                  </div>
                                  {/* <div className="pt-1 text-sm font-medium truncate max-w-full" style={{border:'1px solid red'}}>    */}
                                  {/* <div className="text-xs text-muted-foreground "> */}
                                  <div className="text-xs text-muted-foreground font-bold">
                                    Guia{" "}
                                    {t.raw.numero_guia_convenio ||
                                      "Sem número de guia"}
                                  </div>
                                  <div className="text-xs text-muted-foreground tabular-nums">
                                    {t.description || "Transação"}
                                  </div>
                                  <div className="mt-1 text-sm font-semibold tabular-nums">
                                    {formatBRL(t.value)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 absolute top-[0px] right-0">
                                  {badge}
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                  >
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(v) => {
                                        const next = !!v;
                                        setCheckedExtratoIds((prev) => {
                                          if (next && !prev.includes(t.id))
                                            return [...prev, t.id];
                                          if (!next)
                                            return prev.filter(
                                              (id) => id !== t.id,
                                            );
                                          return prev;
                                        });
                                      }}
                                      aria-label="Selecionar transação"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center justify-between gap-2 w-full max-w-full">
                                <div className="text-[11px] text-muted-foreground">
                                  {suggested
                                    ? "Par provável encontrado"
                                    : "Sem sugestão automática"}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    disabled={!selected || done}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      startCreateFromSelectedExtrato();
                                    }}
                                    aria-label="Criar lançamento"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                    Nenhum item de extrato encontrado com os filtros atuais.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-primary text-primary bg-background shadow-elegant hover:bg-primary/5"
            disabled={
              applying ||
              !checkedExtratoIds.length ||
              !checkedLancamentoIds.length
            }
            onClick={() => {
              confirmChecked().catch((err) => {
                toast.error("Falha ao aplicar conciliação", {
                  description: toFriendlyConciliacaoError(err),
                });
              });
            }}
          >
            {applying ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Confirmar Selecionados
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-purple-600 text-purple-700 bg-background shadow-elegant hover:bg-purple-50"
            disabled={applying || !extratoItems.length}
            onClick={() => conciliacaoRelampago().catch(() => {})}
          >
            {applying ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Conciliação Automática
          </Button>
        </div>
      </Card>

      <AlertDialog
        open={deleteSelectionOpen}
        onOpenChange={(open) => {
          if (deletingSelection) return;
          setDeleteSelectionOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cards selecionados</AlertDialogTitle>
            <AlertDialogDescription>
              {`Voce esta prestes a excluir ${deleteTargetIds.length} ${deleteTargetLabel}. Esta acao nao pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingSelection}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!deleteTargetIds.length || deletingSelection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(ev) => {
                ev.preventDefault();
                confirmDeleteSelection().catch(() => {});
              }}
            >
              {deletingSelection ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Importar Extrato</DialogTitle>
            <DialogDescription>
              Faça upload de OFX, CSV ou PDF. Depois, você pode aplicar a
              conciliação automática de itens idênticos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {importStep === 1 ? (
              <div className="grid gap-3">
                <input
                  ref={importFileRef}
                  type="file"
                  className="hidden"
                  accept=".ofx,.csv,.pdf,application/pdf,text/csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setImportFile(file);
                    if (file) setImportStep(2);
                  }}
                />

                <button
                  type="button"
                  className="rounded-md border border-dashed p-8 text-center bg-background/40 hover:bg-muted/20 transition-smooth"
                  onClick={() => importFileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0] ?? null;
                    setImportFile(file);
                    if (file) setImportStep(2);
                  }}
                >
                  <Upload className="h-5 w-5 mx-auto text-primary" />
                  <div className="mt-2 text-sm font-medium">
                    Arraste e solte aqui ou clique para selecionar
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Formatos: OFX, CSV, PDF
                  </div>
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-md border bg-background/40 p-4">
                  <div className="text-sm font-medium">Arquivo selecionado</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {importFile?.name ?? "—"}
                  </div>
                </div>

                <div className="rounded-md border bg-background/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        Deseja aplicar a conciliação automática?
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        O sistema vincula itens onde Valor + Data (D-2 até D+2)
                        coincidem.
                      </div>
                    </div>
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Checkbox
                      checked={autoMagicAfterUpload}
                      onCheckedChange={(v) => setAutoMagicAfterUpload(!!v)}
                      aria-label="Aplicar conciliação automática"
                    />
                    <span className="text-sm">
                      Sim, aplicar mágica após importar
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setImportOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            {importStep === 2 ? (
              <Button
                type="button"
                onClick={() => uploadExtrato().catch(() => {})}
                disabled={!importFile || uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-1" />
                )}
                Importar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => importFileRef.current?.click()}
              >
                Selecionar arquivo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creatingOpen} onOpenChange={setCreatingOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Novo lançamento</DialogTitle>
            <DialogDescription>
              Crie um lançamento rápido (pré-preenchido a partir do extrato
              selecionado).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Cliente/Fornecedor</Label>
              <Input
                value={createForm.party}
                onChange={(e) =>
                  setCreateForm((s) => ({ ...s, party: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Input
                value={createForm.category}
                onChange={(e) =>
                  setCreateForm((s) => ({ ...s, category: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Input
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={createForm.due}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, due: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor</Label>
                <Input
                  value={createForm.value}
                  onChange={(e) =>
                    setCreateForm((s) => ({
                      ...s,
                      value: maskMoneyInput(e.target.value),
                    }))
                  }
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreatingOpen(false)}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => createLancamento().catch(() => {})}
              disabled={creating}
            >
              {creating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={manualExtratoOpen} onOpenChange={setManualExtratoOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Adicionar transação do extrato</DialogTitle>
            <DialogDescription>
              Preencha manualmente uma transação do Extrato dos convênios.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data do extrato</Label>
                <Input
                  type="date"
                  value={manualExtratoForm.date}
                  onChange={(e) =>
                    setManualExtratoForm((s) => ({
                      ...s,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor</Label>
                <Input
                  placeholder="Ex: 1250,00"
                  value={manualExtratoForm.value}
                  onChange={(e) =>
                    setManualExtratoForm((s) => ({
                      ...s,
                      value: maskMoneyInput(e.target.value),
                    }))
                  }
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Nome do paciente</Label>
                <Popover
                  open={patientPickerOpen}
                  onOpenChange={setPatientPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={patientPickerOpen}
                      className="w-full justify-between font-normal truncate"
                    >
                      <span
                        className={cn(
                          "truncate",
                          !manualExtratoForm.patientName &&
                            "text-muted-foreground",
                        )}
                      >
                        {manualExtratoForm.patientName
                          ? manualExtratoForm.patientName
                          : "Selecione um paciente"}
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
                          <CommandEmpty>
                            Nenhum paciente disponível.
                          </CommandEmpty>
                        ) : null}

                        {filteredPatientNames.length === 0 &&
                        patientQueryTrimmed ? (
                          <CommandEmpty>
                            Nenhum paciente encontrado.
                          </CommandEmpty>
                        ) : null}

                        {filteredPatientNames.length > 0 ? (
                          <CommandGroup>
                            {filteredPatientNames.map((name) => (
                              <CommandItem
                                key={name}
                                value={name}
                                onSelect={() => {
                                  setManualExtratoForm((s) => ({
                                    ...s,
                                    patientName: name,
                                  }));
                                  setPatientPickerOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    manualExtratoForm.patientName === name
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
                                setManualExtratoForm((s) => ({
                                  ...s,
                                  patientName: patientQueryTrimmed,
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
              <div className="grid gap-2">
                <Label>Nome do convênio</Label>
                <Popover
                  open={convenioPickerOpen}
                  onOpenChange={setConvenioPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={convenioPickerOpen}
                      className="w-full justify-between font-normal truncate"
                    >
                      <span
                        className={cn(
                          "truncate",
                          !manualExtratoForm.convenioName &&
                            "text-muted-foreground",
                        )}
                      >
                        {manualExtratoForm.convenioName
                          ? manualExtratoForm.convenioName
                          : "Selecione um convênio"}
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
                        placeholder="Buscar convênio..."
                        value={convenioQuery}
                        onValueChange={(value) => setConvenioQuery(value)}
                      />
                      <CommandList>
                        {filteredConvenioNames.length === 0 &&
                        !convenioQueryTrimmed ? (
                          <CommandEmpty>
                            Nenhum convênio cadastrado.
                          </CommandEmpty>
                        ) : null}

                        {filteredConvenioNames.length === 0 &&
                        convenioQueryTrimmed ? (
                          <CommandEmpty>
                            Nenhum convênio encontrado.
                          </CommandEmpty>
                        ) : null}

                        {filteredConvenioNames.length > 0 ? (
                          <CommandGroup>
                            {filteredConvenioNames.map((name) => (
                              <CommandItem
                                key={name}
                                value={name}
                                onSelect={() => {
                                  setManualExtratoForm((s) => ({
                                    ...s,
                                    convenioName: name,
                                  }));
                                  setConvenioPickerOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    manualExtratoForm.convenioName === name
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <span className="truncate">{name}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : null}

                        {convenioQueryTrimmed && !hasExactConvenioMatch ? (
                          <CommandGroup>
                            <CommandItem
                              value={`__add__${convenioQueryTrimmed}`}
                              disabled={addingConvenio}
                              onSelect={() => {
                                addConvenioAtendido(convenioQueryTrimmed).catch(
                                  () => {},
                                );
                              }}
                            >
                              {addingConvenio ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="mr-2 h-4 w-4" />
                              )}
                              Adicionar “{convenioQueryTrimmed}”
                            </CommandItem>
                          </CommandGroup>
                        ) : null}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Número da guia</Label>
                <Input
                  value={manualExtratoForm.guiaNumber}
                  onChange={(e) =>
                    setManualExtratoForm((s) => ({
                      ...s,
                      guiaNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Data do procedimento ou consulta</Label>
                <Input
                  type="date"
                  value={manualExtratoForm.procedureDate}
                  onChange={(e) =>
                    setManualExtratoForm((s) => ({
                      ...s,
                      procedureDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Nome do procedimento ou consulta</Label>
              <Input
                value={manualExtratoForm.procedureName}
                onChange={(e) =>
                  setManualExtratoForm((s) => ({
                    ...s,
                    procedureName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setManualExtratoOpen(false)}
              disabled={manualExtratoSaving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => createManualExtrato().catch(() => {})}
              disabled={manualExtratoSaving}
            >
              {manualExtratoSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editExtratoOpen}
        onOpenChange={(open) => {
          if (editExtratoSaving) return;
          setEditExtratoOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Editar item do extrato</DialogTitle>
            <DialogDescription>
              Atualize os dados do item selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-date">Data do extrato</Label>
              <Input
                id="edit-extrato-date"
                type="date"
                value={editExtratoForm.date}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-value">Valor Recebido do Convênio</Label>
              <Input
                id="edit-extrato-value"
                placeholder="0,00"
                value={editExtratoForm.value}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    value: maskMoneyInput(e.target.value),
                  }))
                }
                inputMode="decimal"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-patient">Paciente</Label>
              <Input
                id="edit-extrato-patient"
                value={editExtratoForm.patientName}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-convenio">Convênio</Label>
              <Input
                id="edit-extrato-convenio"
                value={editExtratoForm.convenioName}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    convenioName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-guia">Numero da guia</Label>
              <Input
                id="edit-extrato-guia"
                value={editExtratoForm.guiaNumber}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    guiaNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-procedure-date">
                Data do procedimento
              </Label>
              <Input
                id="edit-extrato-procedure-date"
                type="date"
                value={editExtratoForm.procedureDate}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    procedureDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-extrato-procedure">Procedimento</Label>
              <Input
                id="edit-extrato-procedure"
                value={editExtratoForm.procedureName}
                onChange={(e) =>
                  setEditExtratoForm((prev) => ({
                    ...prev,
                    procedureName: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditExtratoOpen(false)}
              disabled={editExtratoSaving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => saveEditedExtrato().catch(() => {})}
              disabled={editExtratoSaving}
            >
              {editExtratoSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editLancamentoOpen}
        onOpenChange={(open) => {
          if (editLancamentoSaving) return;
          setEditLancamentoOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Editar lançamento</DialogTitle>
            <DialogDescription>
              Atualize os dados do lançamento selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-due">Data do lançamento</Label>
              <Input
                id="edit-lancamento-due"
                type="date"
                value={editLancamentoForm.due}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    due: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-value">Valor Procedimento/Consulta</Label>
              <Input
                id="edit-lancamento-value"
                placeholder="0,00"
                value={editLancamentoForm.value}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    value: maskMoneyInput(e.target.value),
                  }))
                }
                inputMode="decimal"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-paid-value">Valor pago</Label>
              <Input
                id="edit-lancamento-paid-value"
                placeholder="0,00"
                value={editLancamentoForm.paidValue}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    paidValue: maskMoneyInput(e.target.value),
                  }))
                }
                inputMode="decimal"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-payment-date">
                Data de pagamento
              </Label>
              <Input
                id="edit-lancamento-payment-date"
                type="date"
                value={editLancamentoForm.paymentDate}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    paymentDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-patient">Paciente</Label>
              <Input
                id="edit-lancamento-patient"
                value={editLancamentoForm.patientName}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-convenio">Convênio</Label>
              <Input
                id="edit-lancamento-convenio"
                value={editLancamentoForm.convenioName}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    convenioName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-guia">Numero da guia</Label>
              <Input
                id="edit-lancamento-guia"
                value={editLancamentoForm.guiaNumber}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    guiaNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-lancamento-procedure">Procedimento</Label>
              <Input
                id="edit-lancamento-procedure"
                value={editLancamentoForm.procedureName}
                onChange={(e) =>
                  setEditLancamentoForm((prev) => ({
                    ...prev,
                    procedureName: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditLancamentoOpen(false)}
              disabled={editLancamentoSaving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => saveEditedLancamento().catch(() => {})}
              disabled={editLancamentoSaving}
            >
              {editLancamentoSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={uploadGuiaOpen}
        onOpenChange={(open) => {
          if (!uploadGuiaUploading) setUploadGuiaOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Upload de Guia</DialogTitle>
            <DialogDescription>
              Envie o PDF ou XML da produção. O arquivo será processado e
              associado aos lançamentos correspondentes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <input
              ref={uploadGuiaFileRef}
              type="file"
              className="hidden"
              accept=".pdf,.xml,application/pdf,application/xml,text/xml"
              onChange={(e) => {
                setUploadGuiaFile(e.target.files?.[0] ?? null);
              }}
            />

            {uploadGuiaFile ? (
              <div className="rounded-md border bg-background/40 p-4">
                <div className="text-sm font-medium">Arquivo selecionado</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {uploadGuiaFile.name}
                </div>
                <button
                  type="button"
                  className="mt-2 text-xs text-muted-foreground underline"
                  onClick={() => {
                    setUploadGuiaFile(null);
                    if (uploadGuiaFileRef.current)
                      uploadGuiaFileRef.current.value = "";
                  }}
                >
                  Trocar arquivo
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="rounded-md border border-dashed p-8 text-center bg-background/40 hover:bg-muted/20 transition-smooth"
                onClick={() => uploadGuiaFileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUploadGuiaFile(e.dataTransfer.files?.[0] ?? null);
                }}
              >
                <Upload className="h-5 w-5 mx-auto text-primary" />
                <div className="mt-2 text-sm font-medium">
                  Arraste e solte aqui ou clique para selecionar
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Formatos: PDF, XML
                </div>
              </button>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setUploadGuiaOpen(false)}
              disabled={uploadGuiaUploading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => uploadGuia().catch(() => {})}
              disabled={!uploadGuiaFile || uploadGuiaUploading}
            >
              {uploadGuiaUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1" />
              )}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
