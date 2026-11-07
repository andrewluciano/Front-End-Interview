import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatBRL, type EncounterStatus } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/arquivos/$fileId")({
  component: ArquivoWorkflowRoute,
  head: () => ({ meta: [{ title: "Processamento do arquivo — Fatura Viva" }] }),
});

type ApiFile = {
  id: string;
  original_filename: string;
  content_type?: string | null;
  size_bytes?: number | null;
  uploaded_by?: string | null;
  created_at?: string | null;
};

type ApiFileHistoryItem = {
  id: string;
  status?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  updated_at?: string | null;
  error_message?: string | null;
  created_at?: string | null;
};

type ApiWorkflow = {
  file: ApiFile;
  stage: {
    key: string;
    label: string;
    status?: string | null;
    updated_at?: string | null;
    details?: string | null;
    technical?: string[] | null;
  };
  history: ApiFileHistoryItem[];
  encontros: ApiEncontro[];
};

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
  nome_procedimento?: string | null;
  convenio_utilizado?: string | null;
  numero_guia_convenio?: string | null;
  data_encontro?: string | null;
  data_evento?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type WorkflowStageKey =
  | "recebido"
  | "fila"
  | "reconhecendo_tipo"
  | "extraindo"
  | "carregando"
  | "carregado"
  | "error";

const stages: Array<{ key: WorkflowStageKey; label: string }> = [
  { key: "recebido", label: "Recebido" },
  { key: "fila", label: "Na fila" },
  { key: "reconhecendo_tipo", label: "Reconhecendo Tipo" },
  { key: "extraindo", label: "Extraindo" },
  { key: "carregando", label: "Populando" },
  { key: "carregado", label: "Carregado" },
  { key: "error", label: "Erro" },
];

function mapEncounterStatus(status: ApiEncontroStatus): EncounterStatus {
  if (status === "glosado_total") return "glosado";
  if (status === "glosado_parcialmente") return "parcial";
  return status;
}

function normalizeHistoryStatus(
  status: string | null | undefined,
): WorkflowStageKey {
  const raw = (status ?? "").trim().toLowerCase();
  if (!raw) return "recebido";
  if (raw === "error" || raw.includes("erro") || raw.includes("fail"))
    return "error";
  if (raw === "carregado" || raw.includes("carregado")) return "carregado";
  if (raw === "carregando" || raw.includes("populando")) return "carregando";
  if (raw === "extraindo") return "extraindo";
  if (raw === "reconhecendo_tipo" || raw.includes("reconhecendo"))
    return "reconhecendo_tipo";
  if (raw.includes("aguardando") || raw.includes("fila")) return "fila";
  if (raw.includes("recebido")) return "recebido";
  return "fila";
}

function userFriendlyErrorMessage(rawMessage: string | null): string {
  const msg = (rawMessage ?? "").trim();
  const lower = msg.toLowerCase();
  if (!msg) return "Não foi possível processar este arquivo no momento.";
  if (
    lower.includes("missing gemini_api_key") ||
    lower.includes("missing google_api_key")
  ) {
    return "O processamento automático está temporariamente indisponível por configuração interna. Tente novamente em alguns minutos.";
  }
  if (lower.includes("unsupported file extension")) {
    return "Formato de arquivo não suportado. Envie PDF, JPG ou PNG.";
  }
  if (
    lower.includes("returned an unexpected payload") ||
    lower.includes("unexpected payload")
  ) {
    return "Não foi possível interpretar o conteúdo deste arquivo. Tente reenviar com melhor qualidade (imagem nítida/PDF pesquisável) ou envie outra versão.";
  }
  if (
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("resource exhausted")
  ) {
    return "O processamento automático atingiu um limite temporário. Tente novamente em alguns minutos.";
  }
  if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("deadline")
  ) {
    return "O processamento demorou mais do que o esperado e foi interrompido. Tente novamente.";
  }
  return "Não foi possível processar este arquivo. Confira o log abaixo e tente reenviar.";
}

function stageIndex(stage: WorkflowStageKey): number {
  return stages.findIndex((s) => s.key === stage);
}

function ArquivoWorkflowRoute() {
  const params = Route.useParams();
  return <ArquivoWorkflowContent fileId={params.fileId} mode="page" />;
}

export function ArquivoWorkflowContent({
  fileId,
  mode,
}: {
  fileId: string;
  mode: "page" | "modal";
}) {
  const [workflow, setWorkflow] = useState<ApiWorkflow | null>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("fv_access_token")
      : null;

  const fileCreatedAt = useMemo(() => {
    const dt = workflow?.file?.created_at
      ? Date.parse(workflow.file.created_at)
      : NaN;
    return Number.isFinite(dt) ? dt : null;
  }, [workflow?.file?.created_at]);

  const latestHistory = useMemo(() => {
    const history = workflow?.history ?? [];
    if (!history.length) return null;
    const sorted = [...history].sort((a, b) => {
      const at = Date.parse(a.updated_at ?? a.created_at ?? "") || 0;
      const bt = Date.parse(b.updated_at ?? b.created_at ?? "") || 0;
      return bt - at;
    });
    return sorted[0] ?? null;
  }, [workflow?.history]);

  const currentStage = useMemo<WorkflowStageKey>(() => {
    const stageKey = workflow?.stage?.key;
    if (stageKey && stages.some((s) => s.key === stageKey))
      return stageKey as WorkflowStageKey;
    if (latestHistory?.status)
      return normalizeHistoryStatus(latestHistory.status);
    return "recebido";
  }, [latestHistory?.status, workflow?.stage?.key]);

  const currentStageLabel = useMemo(() => {
    const found = stages.find((s) => s.key === currentStage);
    return found ? found.label : "Recebido";
  }, [currentStage]);

  const stageDetails = useMemo(() => {
    const value = workflow?.stage?.details;
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }, [workflow?.stage?.details]);

  const stageTechnical = useMemo(() => {
    const raw = workflow?.stage?.technical;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((x) => typeof x === "string" && x.trim())
      .map((x) => x.trim());
  }, [workflow?.stage?.technical]);

  const stageUpdatedAt = useMemo(() => {
    const value = workflow?.stage?.updated_at;
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }, [workflow?.stage?.updated_at]);

  const latestErrorMessage = useMemo(() => {
    const value = latestHistory?.error_message;
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }, [latestHistory?.error_message]);

  const latestErrorFriendly = useMemo(() => {
    return userFriendlyErrorMessage(latestErrorMessage);
  }, [latestErrorMessage]);

  const isTerminal = currentStage === "carregado" || currentStage === "error";

  const nextStage = useMemo(() => {
    if (isTerminal) return null;
    const currentIdx = stageIndex(currentStage);
    const next = stages[currentIdx + 1];
    return next ?? null;
  }, [currentStage, isTerminal]);

  const filteredEncontros = useMemo(() => {
    const encontros = workflow?.encontros ?? [];
    if (!fileCreatedAt) return encontros;
    return encontros.filter((e) => {
      const dt = e.created_at ? Date.parse(e.created_at) : NaN;
      return Number.isFinite(dt) && dt >= fileCreatedAt;
    });
  }, [fileCreatedAt, workflow?.encontros]);

  const listForUi = useMemo(() => {
    return filteredEncontros
      .map((e) => {
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
          status: mapEncounterStatus(e.status),
        };
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [filteredEncontros]);

  const refreshFile = async () => {
    if (!token) return;
    return;
  };

  const refreshHistory = async () => {
    if (!token) return;
    return;
  };

  const refreshEncontros = async () => {
    if (!token) return;
    return;
  };

  const refreshWorkflow = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/arquivo/${encodeURIComponent(fileId)}/workflow?minutes=180`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) return;
      const data = (await res.json()) as unknown;
      if (!data || typeof data !== "object") return;
      setWorkflow(data as ApiWorkflow);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    refreshWorkflow().catch(() => {});
  }, [fileId, token]);

  useEffect(() => {
    if (currentStage !== "error") return;
    if (!latestErrorMessage) return;
    console.error("Arquivo: processamento com erro", {
      fileId,
      error_message: latestErrorMessage,
      stage: workflow?.stage ?? null,
      latest_history: latestHistory ?? null,
    });
  }, [
    currentStage,
    fileId,
    latestErrorMessage,
    latestHistory,
    workflow?.stage,
  ]);

  useEffect(() => {
    if (!token) return;
    if (isTerminal) return;
    const id = window.setInterval(() => {
      refreshWorkflow().catch(() => {});
    }, 3000);
    return () => window.clearInterval(id);
  }, [isTerminal, fileId, token]);

  const orderedHistory = useMemo(() => {
    const history = workflow?.history ?? [];
    return [...history].sort((a, b) => {
      const at = Date.parse(a.created_at ?? "") || 0;
      const bt = Date.parse(b.created_at ?? "") || 0;
      return at - bt;
    });
  }, [workflow?.history]);

  return (
    <div
      className={cn("space-y-5", mode === "page" ? "max-w-6xl mx-auto" : "")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {mode === "page" ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/app/arquivos">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {workflow?.file?.original_filename ?? "Arquivo"}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {loading ? "Carregando..." : `Status: ${currentStageLabel}`}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => {
              refreshWorkflow().catch(() => {});
              toast.success("Atualizado");
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Atualizando
              </>
            ) : (
              "Atualizar"
            )}
          </Button>
        </div>
      </div>

      <Card className="p-4 shadow-elegant">
        <div className="flex flex-col gap-3">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Etapas</div>
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => {
                const idx = stageIndex(s.key);
                const currentIdx = stageIndex(currentStage);
                const completed = currentIdx > idx && currentStage !== "error";
                const active = currentStage === s.key;
                const errorTone = s.key === "error" && currentStage === "error";
                return (
                  <div
                    key={s.key}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth",
                      completed
                        ? "bg-primary text-primary-foreground border-primary"
                        : active
                          ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_0_22px_rgba(59,130,246,0.25)]"
                          : "bg-card border-border text-muted-foreground",
                      active ? "ring-1 ring-primary/50" : "",
                      errorTone
                        ? "bg-destructive text-destructive-foreground border-destructive ring-0"
                        : "",
                    )}
                  >
                    {s.label}
                  </div>
                );
              })}
            </div>
            <div className="mt-1">
              {currentStage === "error" ? (
                <Alert className="border-destructive/40 bg-destructive/10 text-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <div>
                    <AlertTitle>Processamento com erro</AlertTitle>
                    <AlertDescription>{latestErrorFriendly}</AlertDescription>
                  </div>
                </Alert>
              ) : currentStage === "carregado" ? (
                <Alert className="border-primary/30 bg-primary/5 text-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <div>
                    <AlertTitle>Arquivo carregado</AlertTitle>
                    <AlertDescription>
                      Revise as Consultas/Procedimentos geradas e ajuste campos pendentes.
                    </AlertDescription>
                  </div>
                </Alert>
              ) : nextStage ? (
                <Alert className="border-warning/40 bg-warning/10 text-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <div>
                    <AlertTitle>Próxima etapa: {nextStage.label}</AlertTitle>
                    <AlertDescription>
                      {loading
                        ? "Atualizando status..."
                        : "Acompanhe o log abaixo. O status atualiza automaticamente."}
                    </AlertDescription>
                  </div>
                </Alert>
              ) : null}
            </div>

            {stageDetails || stageTechnical.length ? (
              <div className="mt-3 rounded-md border bg-muted/20 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-medium">Detalhes técnicos</div>
                  {stageUpdatedAt ? (
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {new Date(stageUpdatedAt).toLocaleString("pt-BR")}
                    </div>
                  ) : null}
                </div>
                {stageDetails ? (
                  <div className="mt-1 text-sm text-foreground">
                    {stageDetails}
                  </div>
                ) : null}
                {stageTechnical.length ? (
                  <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground space-y-1">
                    {stageTechnical.map((line, idx) => (
                      <li key={`${idx}-${line}`}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card className="p-4 shadow-elegant">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">Log do processo</div>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : null}
              </div>
              <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                {orderedHistory.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhum evento registrado ainda.
                  </div>
                ) : (
                  orderedHistory.map((h) => (
                    <div key={h.id} className="border rounded-md px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium truncate">
                          {h.status ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {h.created_at
                            ? new Date(h.created_at).toLocaleString("pt-BR")
                            : "—"}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                        Início:{" "}
                        {h.started_at
                          ? new Date(h.started_at).toLocaleString("pt-BR")
                          : "—"}{" "}
                        · Fim:{" "}
                        {h.finished_at
                          ? new Date(h.finished_at).toLocaleString("pt-BR")
                          : "—"}
                      </div>
                      {h.error_message ? (
                        <div className="mt-1 text-xs text-destructive tabular-nums break-words">
                          {h.error_message}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-4 shadow-elegant">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">Consultas/Procedimentos criados</div>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : null}
              </div>
              <div className="mt-3 space-y-2 max-h-80 overflow-auto">
                {listForUi.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma Consulta/Procedimento encontrada para este arquivo.
                  </div>
                ) : (
                  listForUi.map((e) => (
                    <div key={e.id} className="border rounded-md px-3 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {e.patient}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {e.procedure}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {e.payer}
                            {e.guide ? ` · Guia ${e.guide}` : ""}
                            {" · "}
                            {e.date
                              ? new Date(e.date).toLocaleDateString("pt-BR")
                              : "—"}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold tabular-nums">
                            {formatBRL(e.value)}
                          </div>
                          <div className="mt-1">
                            <StatusBadge status={e.status} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground tabular-nums">
                        Pago: {formatBRL(e.paid)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {loading && !workflow?.file ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando dados do arquivo...
        </div>
      ) : null}
    </div>
  );
}
