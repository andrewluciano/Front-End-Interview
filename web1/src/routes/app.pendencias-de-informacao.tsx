import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requestOpenEncounter } from "@/lib/open-encounter";
import { cn } from "@/lib/utils";
import { formatBRL, statusLabels, type EncounterStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/app/pendencias-de-informacao")({
  component: PendenciasDeInformacaoPage,
  head: () => ({ meta: [{ title: "Pendências de informação — Fatura Viva" }] }),
});

type ApiEncontroStatus =
  | "agendado"
  | "produzido"
  | "pago"
  | "glosado_total"
  | "glosado_parcialmente";

type ApiPendencyItem = {
  encontro_id: string;
  status: ApiEncontroStatus;
  reasons: string[];
  missing_fields: string[];
  suggested_next_status?: ApiEncontroStatus | null;
  data_evento?: string | null;
  data_encontro?: string | null;
  updated_at?: string | null;
};

type ApiPendenciasResponse = {
  total_encontros: number;
  total_pendencias: number;
  items: ApiPendencyItem[];
};

type ApiEncontro = {
  id: string;
  status: ApiEncontroStatus;
  nome_paciente?: string | null;
  convenio_utilizado?: string | null;
  numero_guia_convenio?: string | null;
  nome_procedimento?: string | null;
  data_encontro?: string | null;
  data_evento?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  updated_at?: string | null;
};

type EnrichedPendency = ApiPendencyItem & {
  encounter?: ApiEncontro;
};

type ReasonFilter = "todas" | "campos" | "data" | "atualizacao";

const kanbanColumns: ApiEncontroStatus[] = [
  "agendado",
  "produzido",
  "pago",
  "glosado_parcialmente",
  "glosado_total",
];

const kanbanColumnMeta: Record<
  ApiEncontroStatus,
  { title: string; accent: string; empty: string }
> = {
  agendado: {
    title: "Agendado",
    accent: "border-l-info",
    empty: "Nenhuma pendência em Consultas/Procedimentos agendadas.",
  },
  produzido: {
    title: "Produzido",
    accent: "border-l-primary",
    empty: "Nenhuma pendência em Consultas/Procedimentos produzidas.",
  },
  pago: {
    title: "Pago",
    accent: "border-l-success",
    empty: "Nenhuma pendência em Consultas/Procedimentos pagas.",
  },
  glosado_parcialmente: {
    title: "Glosado parcial",
    accent: "border-l-warning",
    empty: "Nenhuma pendência em glosas parciais.",
  },
  glosado_total: {
    title: "Glosado total",
    accent: "border-l-destructive",
    empty: "Nenhuma pendência em glosas totais.",
  },
};

const missingFieldLabels: Record<string, string> = {
  valor_receber: "Valor a receber",
  valor_recebido: "Valor recebido",
  nome_procedimento: "Procedimento",
  data_encontro: "Data da Consulta/Procedimento",
  nome_paciente: "Paciente",
};

function mapStatus(status: ApiEncontroStatus): EncounterStatus {
  if (status === "glosado_total") return "glosado";
  if (status === "glosado_parcialmente") return "parcial";
  return status;
}

function formatApiStatus(status: ApiEncontroStatus | null | undefined) {
  if (!status) return "Sem sugestão";
  if (status === "glosado_total") return "Glosado total";
  if (status === "glosado_parcialmente") return "Glosado parcial";
  return statusLabels[mapStatus(status)];
}

function formatFieldLabel(field: string) {
  return missingFieldLabels[field] ?? field.replaceAll("_", " ");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Sem data";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Sem data";
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Sem atualização";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Sem atualização";
  return new Date(timestamp).toLocaleString("pt-BR");
}

function PendenciasDeInformacaoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState<ReasonFilter>("todas");
  const [response, setResponse] = useState<ApiPendenciasResponse | null>(null);
  const [encontros, setEncontros] = useState<ApiEncontro[]>([]);

  const load = async (mode: "initial" | "refresh" = "initial") => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      const headers = {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      };
      const [pendenciasRes, encontrosRes] = await Promise.all([
        fetch("/api/pendencias", { headers }),
        fetch("/api/encontros", { headers }),
      ]);

      if (!pendenciasRes.ok) {
        const message =
          pendenciasRes.status === 401
            ? "Sessão expirada. Faça login novamente."
            : "Não foi possível carregar as pendências.";
        throw new Error(message);
      }

      const pendenciasData = (await pendenciasRes.json()) as unknown;
      if (
        !pendenciasData ||
        typeof pendenciasData !== "object" ||
        !Array.isArray((pendenciasData as { items?: unknown }).items)
      ) {
        throw new Error("Resposta inválida ao carregar pendências.");
      }

      setResponse(pendenciasData as ApiPendenciasResponse);

      if (encontrosRes.ok) {
        const encontrosData = (await encontrosRes.json()) as unknown;
        if (Array.isArray(encontrosData)) {
          setEncontros(encontrosData as ApiEncontro[]);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as pendências.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  useEffect(() => {
    const onChanged = () => {
      load("refresh").catch(() => {});
    };

    window.addEventListener("fv:encontros-changed", onChanged);
    window.addEventListener("fv:pendencias-changed", onChanged);
    return () => {
      window.removeEventListener("fv:encontros-changed", onChanged);
      window.removeEventListener("fv:pendencias-changed", onChanged);
    };
  }, []);

  const encounterById = useMemo(() => {
    const map = new Map<string, ApiEncontro>();
    for (const encontro of encontros) {
      map.set(encontro.id, encontro);
    }
    return map;
  }, [encontros]);

  const items = useMemo<EnrichedPendency[]>(() => {
    return (response?.items ?? []).map((item) => ({
      ...item,
      encounter: encounterById.get(item.encontro_id),
    }));
  }, [encounterById, response?.items]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const encounter = item.encounter;
      const searchable = [
        encounter?.nome_paciente ?? "",
        encounter?.nome_procedimento ?? "",
        encounter?.convenio_utilizado ?? "",
        encounter?.numero_guia_convenio ?? "",
        item.reasons.join(" "),
        item.missing_fields.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      if (normalizedQuery && !searchable.includes(normalizedQuery))
        return false;

      if (reasonFilter === "campos" && item.missing_fields.length === 0)
        return false;
      if (
        reasonFilter === "data" &&
        !item.reasons.some((reason) => reason.toLowerCase().includes("passado"))
      )
        return false;
      if (
        reasonFilter === "atualizacao" &&
        !item.reasons.some((reason) =>
          reason.toLowerCase().includes("atualização"),
        )
      )
        return false;

      return true;
    });
  }, [items, normalizedQuery, reasonFilter]);

  const columns = useMemo(() => {
    return kanbanColumns.map((status) => ({
      status,
      ...kanbanColumnMeta[status],
      items: filteredItems.filter((item) => item.status === status),
    }));
  }, [filteredItems]);

  const summary = useMemo(() => {
    return {
      totalPendencias: response?.total_pendencias ?? items.length,
      totalEncontros: response?.total_encontros ?? encontros.length,
      comCamposFaltando: items.filter((item) => item.missing_fields.length > 0)
        .length,
      comDataVencida: items.filter((item) =>
        item.reasons.some((reason) => reason.toLowerCase().includes("passado")),
      ).length,
      semAtualizacao: items.filter((item) =>
        item.reasons.some((reason) =>
          reason.toLowerCase().includes("atualização"),
        ),
      ).length,
    };
  }, [
    encontros.length,
    items,
    response?.total_encontros,
    response?.total_pendencias,
  ]);

  const openEncounter = (item: EnrichedPendency) => {
    requestOpenEncounter({ encontroId: item.encontro_id, pendency: item });
    navigate({ to: "/app/trabalho" });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 flex items-center justify-center gap-3 text-muted-foreground shadow-elegant">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando pendências de informação...
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pendências de informação
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize todas as pendências do usuário em um quadro kanban e abra
            rapidamente a Consulta/Procedimento para corrigir.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={refreshing}
          onClick={() => load("refresh").catch(() => {})}
        >
          <RefreshCcw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <SummaryCard
          label="Pendências"
          value={String(summary.totalPendencias)}
          tone="destructive"
        />
        <SummaryCard
          label="Consultas/Procedimentos avaliados"
          value={String(summary.totalEncontros)}
          tone="primary"
        />
        <SummaryCard
          label="Campos faltando"
          value={String(summary.comCamposFaltando)}
          tone="warning"
        />
        <SummaryCard
          label="Data no passado"
          value={String(summary.comDataVencida)}
          tone="warning"
        />
        <SummaryCard
          label="Sem atualização"
          value={String(summary.semAtualizacao)}
          tone="secondary"
        />
      </div>

      <Card className="p-4 shadow-elegant">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por paciente, procedimento, convênio, guia ou motivo..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["todas", "Todas"],
                ["campos", "Campos vazios"],
                ["data", "Data vencida"],
                ["atualizacao", "Sem atualização"],
              ] as Array<[ReasonFilter, string]>
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setReasonFilter(value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth",
                  reasonFilter === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-accent",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="p-5 border-destructive/40 bg-destructive/5 shadow-elegant">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="space-y-2">
              <div className="font-medium">Falha ao carregar pendências</div>
              <div className="text-sm text-muted-foreground">{error}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => load("refresh").catch(() => {})}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {!error && filteredItems.length === 0 ? (
        <Card className="p-8 text-center shadow-elegant">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CalendarClock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-semibold">Nenhuma pendência encontrada</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste os filtros ou continue o trabalho normalmente: não há itens
            para revisão com os critérios atuais.
          </p>
        </Card>
      ) : null}

      {!error && filteredItems.length > 0 ? (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1320px] grid-cols-5 gap-4">
            {columns.map((column) => (
              <div key={column.status} className="space-y-3">
                <Card
                  className={cn("border-l-4 p-4 shadow-elegant", column.accent)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{column.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {column.items.length}{" "}
                        {column.items.length === 1 ? "pendência" : "pendências"}
                      </div>
                    </div>
                    <Badge variant="secondary">{column.items.length}</Badge>
                  </div>
                </Card>

                <div className="space-y-3">
                  {column.items.length ? (
                    column.items.map((item) => (
                      <PendencyCard
                        key={item.encontro_id}
                        item={item}
                        onOpen={() => openEncounter(item)}
                      />
                    ))
                  ) : (
                    <Card className="p-4 text-sm text-muted-foreground shadow-sm">
                      {column.empty}
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "secondary" | "warning" | "destructive";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-muted text-muted-foreground",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  } as const;

  return (
    <Card className="p-4 shadow-elegant">
      <div
        className={cn(
          "inline-flex rounded-md px-2 py-1 text-xs font-medium",
          toneClass[tone],
        )}
      >
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div>
    </Card>
  );
}

function PendencyCard({
  item,
  onOpen,
}: {
  item: EnrichedPendency;
  onOpen: () => void;
}) {
  const encounter = item.encounter;
  const encounterStatus = mapStatus(item.status);
  const eventDate =
    encounter?.data_encontro ??
    encounter?.data_evento ??
    item.data_encontro ??
    item.data_evento;
  const updatedAt = encounter?.updated_at ?? item.updated_at;
  const patient = encounter?.nome_paciente?.trim() || "Paciente não informado";
  const procedure =
    encounter?.nome_procedimento?.trim() || "Procedimento não informado";
  const payer =
    encounter?.convenio_utilizado?.trim() || "Convênio não informado";
  const guide = encounter?.numero_guia_convenio?.trim() || "";
  const amount = Number(encounter?.valor_receber ?? 0);

  return (
    <Card className="p-4 shadow-elegant transition-smooth hover:shadow-elevated">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{patient}</div>
            <div className="text-xs text-muted-foreground truncate">
              {procedure}
            </div>
          </div>
          <StatusBadge status={encounterStatus} />
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="truncate">{payer}</div>
          <div>
            {guide ? `Guia ${guide}` : "Guia não informada"}
            {" · "}
            {formatDate(eventDate)}
          </div>
          <div>Atualizado em {formatDateTime(updatedAt)}</div>
        </div>

        <div className="text-sm font-semibold tabular-nums">
          {formatBRL(amount)}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Motivos
          </div>
          <div className="space-y-1">
            {item.reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-md bg-muted/60 px-2.5 py-2 text-xs text-foreground"
              >
                {reason}
              </div>
            ))}
          </div>
        </div>

        {item.missing_fields.length ? (
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Campos faltando
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.missing_fields.map((field) => (
                <Badge key={field} variant="outline">
                  {formatFieldLabel(field)}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {item.suggested_next_status ? (
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">
            Próximo status sugerido:{" "}
            <span className="font-medium">
              {formatApiStatus(item.suggested_next_status)}
            </span>
          </div>
        ) : null}

        <Button className="w-full" variant="outline" onClick={onOpen}>
          Abrir Consulta/Procedimento
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
