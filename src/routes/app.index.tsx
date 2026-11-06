import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatBRL,
  formatMoneyInput,
  maskMoneyInput,
  parseBRL,
  type EncounterStatus,
  statusLabels,
  formatDateTimeBR,
} from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

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
  data_evento?: string | null;
  data_encontro?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  updated_at?: string | null;
};

type PendenciasResponse = {
  total_encontros: number;
  total_pendencias: number;
  items: Array<{
    encontro_id: string;
    status: ApiEncontroStatus;
    reasons: string[];
    missing_fields: string[];
    suggested_next_status?: ApiEncontroStatus | null;
    data_evento?: string | null;
    data_encontro?: string | null;
    updated_at?: string | null;
  }>;
};

type ConciliacaoResponse = {
  summary: {
    total_encontros: number;
    total_a_receber: number;
    total_recebido: number;
    total_glosado: number;
  } | null;
};

type DashboardData = {
  encontros: ApiEncontro[];
  pendencias: PendenciasResponse;
  conciliacao: ConciliacaoResponse | null;
  profile: {
    username: string;
    company_nome: string | null;
  } | null;
  kpis: {
    total: number;
    recebido: number;
    pendente: number;
    glosado: number;
  };
  shouldOpenTutorial: boolean;
};

const tutorialSteps = [
  {
    number: "1",
    title: "Cadastre seus convênios em Configurações",
    description:
      "Antes de tudo, adicione os convênios com os quais você trabalha. Isso permite o sistema identificar pagamentos corretamente e calcular prazos médios.",
  },
  {
    number: "2",
    title: "Adicione seu primeiro procedimento em Meu trabalho",
    description:
      'Preencha paciente, convênio, valor, número da guia e da carteirinha. Se faltar algum campo essencial, o procedimento entra como "dados irregulares" (veja abaixo).',
  },
  {
    number: "3",
    title: "Suba seus extratos em Conciliação",
    description:
      "Quando o convênio enviar o demonstrativo, suba a foto ou PDF na tela de Conciliação. O sistema atrela ao procedimento e identifica glosas automaticamente.",
  },
] as const;

function mapStatus(status: ApiEncontroStatus): EncounterStatus {
  if (status === "glosado_total") return "glosado";
  if (status === "glosado_parcialmente") return "parcial";
  return status;
}

function pendencyTone(
  status: ApiEncontroStatus,
): "destructive" | "warning" | "info" | "primary" {
  if (status === "glosado_total" || status === "glosado_parcialmente")
    return "destructive";
  if (status === "agendado") return "info";
  if (status === "produzido") return "primary";
  return "warning";
}

const apiStatusLabels: Record<ApiEncontroStatus, string> = {
  agendado: statusLabels.agendado,
  produzido: statusLabels.produzido,
  pago: statusLabels.pago,
  glosado_total: "Glosado total",
  glosado_parcialmente: "Glosado parcial",
};

function computeKpis(encontros: ApiEncontro[]) {
  const totalAReceber = encontros
    .filter((e) => e.status === "agendado" || e.status === "produzido")
    .reduce((sum, e) => sum + Number(e.valor_receber ?? 0), 0);

  const totalRecebido = encontros
    .filter((e) => e.status === "pago")
    .reduce(
      (sum, e) => sum + Number(e.valor_recebido ?? e.valor_receber ?? 0),
      0,
    );

  const totalGlosado = encontros
    .filter(
      (e) =>
        e.status === "glosado_total" || e.status === "glosado_parcialmente",
    )
    .reduce((sum, e) => {
      const vr = Number(e.valor_receber ?? 0);
      const vrc = Number(e.valor_recebido ?? 0);
      const diff = vr - vrc;
      return sum + (diff > 0 ? diff : 0);
    }, 0);

  return {
    total: totalAReceber + totalRecebido + totalGlosado,
    recebido: totalRecebido,
    pendente: totalAReceber,
    glosado: totalGlosado,
  };
}

export const Route = createFileRoute("/app/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Fatura Viva" }] }),
  loader: async (): Promise<DashboardData | null> => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("fv_access_token")
          : null;
      const headers = {
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };

      const [
        encontrosRes,
        pendenciasRes,
        conciliacaoRes,
        profileRes,
        configuracoesRes,
      ] =
        await Promise.all([
          fetch("/api/encontros", { headers }),
          fetch("/api/pendencias", { headers }),
          fetch("/api/conciliacao", { headers }),
          fetch("/api/auth/profile", { headers }),
          fetch("/api/configuracoes", { headers }),
        ]);

      if (!encontrosRes.ok || !pendenciasRes.ok) return null;

      const [encontros, pendencias] = (await Promise.all([
        encontrosRes.json(),
        pendenciasRes.json(),
      ])) as [ApiEncontro[], PendenciasResponse];

      if (!Array.isArray(encontros)) return null;
      if (
        !pendencias ||
        typeof pendencias !== "object" ||
        !Array.isArray((pendencias as any).items)
      )
        return null;

      const conciliacao = conciliacaoRes.ok
        ? ((await conciliacaoRes.json()) as ConciliacaoResponse)
        : null;

      let profile: DashboardData["profile"] = null;
      if (profileRes.ok) {
        const raw = (await profileRes.json()) as any;
        if (raw && typeof raw.username === "string") {
          profile = {
            username: raw.username,
            company_nome:
              typeof raw.company_nome === "string" ? raw.company_nome : null,
          };
        }
      }

      let shouldOpenTutorial = false;
      if (configuracoesRes.ok) {
        const raw = (await configuracoesRes.json()) as any;
        const convenios = Array.isArray(raw?.convenios_atendidos)
          ? raw.convenios_atendidos.filter(
              (v: unknown): v is string =>
                typeof v === "string" && v.trim().length > 0,
            )
          : [];
        shouldOpenTutorial = convenios.length === 0;
      }

      return {
        encontros,
        pendencias,
        conciliacao,
        profile,
        kpis: computeKpis(encontros),
        shouldOpenTutorial,
      };
    } catch {
      return null;
    }
  },
});

function Dashboard() {
  const data = Route.useLoaderData();
  const [tutorialOpen, setTutorialOpen] = useState(
    () => data?.shouldOpenTutorial ?? false,
  );
  const [tutorialApi, setTutorialApi] = useState<CarouselApi>();
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [apiEncontros, setApiEncontros] = useState<ApiEncontro[]>(
    data?.encontros ?? [],
  );
  const [pendencias, setPendencias] = useState<PendenciasResponse | null>(
    data?.pendencias ?? null,
  );
  const [conciliacao, setConciliacao] = useState<ConciliacaoResponse | null>(
    data?.conciliacao ?? null,
  );
  const [kpis, setKpis] = useState(
    () => data?.kpis ?? computeKpis(data?.encontros ?? []),
  );
  const [profile, setProfile] = useState<DashboardData["profile"]>(
    data?.profile ?? null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPendency, setEditPendency] = useState<
    PendenciasResponse["items"][number] | null
  >(null);
  const [saving, setSaving] = useState(false);
  const [originalEditStatus, setOriginalEditStatus] =
    useState<ApiEncontroStatus>("agendado");
  const [statementUploading, setStatementUploading] = useState(false);
  const statementFileRef = useRef<HTMLInputElement | null>(null);
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

  useEffect(() => {
    if (data?.encontros) {
      setApiEncontros(data.encontros);
      setKpis(data.kpis);
    }
    if (data?.pendencias) setPendencias(data.pendencias);
    if (typeof data?.conciliacao !== "undefined")
      setConciliacao(data.conciliacao);
    if (typeof data?.profile !== "undefined") setProfile(data.profile);
    if (typeof data?.shouldOpenTutorial === "boolean") {
      setTutorialOpen(data.shouldOpenTutorial);
    }
  }, [
    data?.conciliacao,
    data?.encontros,
    data?.pendencias,
    data?.profile,
    data?.shouldOpenTutorial,
  ]);

  useEffect(() => {
    if (!tutorialApi) return;

    const syncTutorialIndex = () => {
      setTutorialIndex(tutorialApi.selectedScrollSnap());
    };

    syncTutorialIndex();
    tutorialApi.on("select", syncTutorialIndex);
    tutorialApi.on("reInit", syncTutorialIndex);

    return () => {
      tutorialApi.off("select", syncTutorialIndex);
    };
  }, [tutorialApi]);

  const readErrorMessage = async (res: Response): Promise<string> => {
    if (res.status === 401) return "Sessão expirada. Faça login novamente.";
    try {
      const payload = await res.json();
      if (
        payload &&
        typeof payload === "object" &&
        "detail" in payload &&
        typeof (payload as any).detail === "string"
      ) {
        return (payload as any).detail;
      }
      return JSON.stringify(payload);
    } catch {
      try {
        return await res.text();
      } catch {
        return "Erro ao processar a requisição.";
      }
    }
  };

  const refresh = async () => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) return;
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    };
    const [encontrosRes, pendenciasRes, conciliacaoRes, profileRes] =
      await Promise.all([
        fetch("/api/encontros", { headers }),
        fetch("/api/pendencias", { headers }),
        fetch("/api/conciliacao", { headers }),
        fetch("/api/auth/profile", { headers }),
      ]);
    if (encontrosRes.ok) {
      const next = (await encontrosRes.json()) as unknown;
      if (Array.isArray(next)) {
        const list = next as ApiEncontro[];
        setApiEncontros(list);
        setKpis(computeKpis(list));
      }
    }
    if (pendenciasRes.ok) {
      const next = (await pendenciasRes.json()) as unknown;
      if (
        next &&
        typeof next === "object" &&
        Array.isArray((next as any).items)
      )
        setPendencias(next as PendenciasResponse);
    }
    if (conciliacaoRes.ok) {
      const next = (await conciliacaoRes.json()) as ConciliacaoResponse;
      setConciliacao(next);
    }
    if (profileRes.ok) {
      const raw = (await profileRes.json()) as any;
      if (raw && typeof raw.username === "string") {
        setProfile({
          username: raw.username,
          company_nome:
            typeof raw.company_nome === "string" ? raw.company_nome : null,
        });
      }
    }
  };

  const toDateInputValue = (iso: string | null | undefined): string => {
    if (!iso) return "";
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return "";
    return new Date(t).toISOString().slice(0, 10);
  };

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

  const total = kpis.total;
  const recebido = kpis.recebido;
  const pendente = kpis.pendente;
  const glosado = kpis.glosado;
  const overview = useMemo(() => {
    const aReceber = Number(conciliacao?.summary?.total_a_receber ?? 0);
    const totalRecebido = Number(conciliacao?.summary?.total_recebido ?? 0);
    const totalGlosado = Number(conciliacao?.summary?.total_glosado ?? 0);
    const totalGeral = aReceber + totalRecebido + totalGlosado;
    const pct = (value: number) =>
      totalGeral > 0
        ? Math.max(0, Math.min(100, (value / totalGeral) * 100))
        : 0;

    return {
      aReceber,
      recebido: totalRecebido,
      glosado: totalGlosado,
      total: totalGeral,
      aReceberPct: pct(aReceber),
      recebidoPct: pct(totalRecebido),
      glosadoPct: pct(totalGlosado),
    };
  }, [conciliacao]);

  const recent: Array<{
    id: string;
    patient: string;
    procedure: string;
    payer: string;
    guide: string | null;
    value: number;
    status: EncounterStatus;
  }> = apiEncontros.length
    ? apiEncontros
        .slice()
        .sort((a, b) => {
          const aTime = a.updated_at ? Date.parse(a.updated_at) : 0;
          const bTime = b.updated_at ? Date.parse(b.updated_at) : 0;
          return bTime - aTime;
        })
        .map((e) => ({
          id: e.id,
          patient: e.nome_paciente ?? "Paciente",
          procedure: e.nome_procedimento ?? "Procedimento",
          payer: e.convenio_utilizado ?? "—",
          guide: e.numero_guia_convenio ?? null,
          value: Number(e.valor_receber ?? 0),
          status: mapStatus(e.status),
        }))
        .slice(0, 5)
    : [];

  const toConciliate = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayMs = startOfToday.getTime();

    return apiEncontros
      .filter((e) => {
        if (e.status !== "Pago" || !e.data_encontro) return false;

        const encounterTime = Date.parse(e.data_encontro);
        if (Number.isNaN(encounterTime)) return false;

        return encounterTime < todayMs;
      })
      .slice()
      .sort((a, b) => {
        const aTime = a.updated_at ? Date.parse(a.updated_at) : 0;
        const bTime = b.updated_at ? Date.parse(b.updated_at) : 0;
        return bTime - aTime;
      });
  }, [apiEncontros]);

  const editRequiresPaid =
    editForm.status === "pago" ||
    editForm.status === "glosado_total" ||
    editForm.status === "glosado_parcialmente";
  const editPaidAmount = editForm.paid.trim() ? parseBRL(editForm.paid) : 0;
  const editPaidValid = !editRequiresPaid || editPaidAmount > 0;

  const uploadPaymentStatement = async (file: File) => {
    const token = localStorage.getItem("fv_access_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    setStatementUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/arquivo/upload/extrato-pagamento", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body,
      });
      if (!res.ok) {
        toast.error("Falha no upload do extrato", {
          description: await readErrorMessage(res),
        });
        return;
      }
      toast.success("Extrato enviado para conciliação", {
        description: `${file.name} · Vá na tela de conciliação para acompanhar os dados conciliados.`,
      });
    } finally {
      setStatementUploading(false);
      if (statementFileRef.current) statementFileRef.current.value = "";
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = useMemo(() => {
    const raw = profile?.username?.trim();
    if (!raw) return null;
    return raw.split(" ").filter(Boolean)[0] ?? null;
  }, [profile?.username]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>Como começar em 3 passos</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Se é seu primeiro dia, comece por aqui.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <Carousel
              setApi={setTutorialApi}
              opts={{ loop: false }}
              className="w-full"
            >
              <CarouselContent>
                {tutorialSteps.map((step) => (
                  <CarouselItem key={step.number}>
                    <Card className="min-h-[280px] border-primary/10 bg-gradient-card p-6 shadow-sm">
                      <div className="flex h-full flex-col gap-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                          {step.number}
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex items-center justify-center gap-2">
              {tutorialSteps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  aria-label={`Ir para o passo ${step.number}`}
                  className={
                    index === tutorialIndex
                      ? "h-2.5 w-6 rounded-full bg-primary transition-all"
                      : "h-2.5 w-2.5 rounded-full bg-muted-foreground/30 transition-all"
                  }
                  onClick={() => tutorialApi?.scrollTo(index)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="secondary" onClick={() => setTutorialOpen(false)}>
              Fechar tutorial
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => tutorialApi?.scrollPrev()}
                disabled={tutorialIndex === 0}
              >
                Voltar
              </Button>
              {tutorialIndex === tutorialSteps.length - 1 ? (
                <Button onClick={() => setTutorialOpen(false)}>
                  Começar a usar
                </Button>
              ) : (
                <Button onClick={() => tutorialApi?.scrollNext()}>
                  Próximo
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}
          {firstName ? `, ${firstName}` : ""} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Aqui está o resumo financeiro
          {profile?.company_nome ? ` da ${profile.company_nome}` : ""}.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPI
          icon={TrendingUp}
          label="Faturado no mês"
          value={formatBRL(total)}
          tone="primary"
          trend="+12%"
        />
        <KPI
          icon={CheckCircle2}
          label="Recebido"
          value={formatBRL(recebido)}
          tone="success"
          trend="+8%"
        />
        <KPI
          icon={Clock}
          label="Pendente"
          value={formatBRL(pendente)}
          tone="warning"
        />
        <KPI
          icon={AlertTriangle}
          label="Glosado"
          value={formatBRL(glosado)}
          tone="destructive"
          trend="-3%"
        />
      </div>
      {conciliacao?.summary ? (
        <>
          {/* <div className="grid sm:grid-cols-3 gap-3">
            <Card className="sm:col-span-1 p-4 bg-gradient-card shadow-elegant">
              <div className="text-xs text-muted-foreground">A receber</div>
              <div className="text-[16px] font-semibold tabular-nums mt-1">
                {formatBRL(conciliacao.summary.total_a_receber)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {overview.total ? `${Math.round(overview.aReceberPct)}% do total` : "—"}
              </div>
            </Card>
            <Card className="sm:col-span-1 p-4 bg-gradient-card shadow-elegant">
              <div className="text-xs text-muted-foreground">Recebido</div>
              <div className="text-[16px] font-semibold tabular-nums mt-1">
                {formatBRL(conciliacao.summary.total_recebido)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {overview.total ? `${Math.round(overview.recebidoPct)}% do total` : "—"}
              </div>
            </Card>
            <Card className="sm:col-span-1 p-4 bg-gradient-card shadow-elegant">
              <div className="text-xs text-muted-foreground">Glosado</div>
              <div className="text-[16px] font-semibold tabular-nums mt-1">
                {formatBRL(conciliacao.summary.total_glosado)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {overview.total ? `${Math.round(overview.glosadoPct)}% do total` : "—"}
              </div>
            </Card>
          </div> */}

          <Card className="p-5 bg-gradient-card shadow-elegant">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Visão geral</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {overview.total
                    ? `Você tem ${formatBRL(overview.aReceber)} pendente para receber (${Math.round(overview.aReceberPct)}%).`
                    : "Ainda não há valores para consolidar."}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-sm font-semibold tabular-nums">
                  {formatBRL(overview.total)}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-success"
                  style={{ width: `${overview.recebidoPct}%` }}
                  aria-label="Recebido"
                />
                <div
                  className="h-full bg-warning"
                  style={{ width: `${overview.aReceberPct}%` }}
                  aria-label="A receber"
                />
                <div
                  className="h-full bg-destructive"
                  style={{ width: `${overview.glosadoPct}%` }}
                  aria-label="Glosado"
                />
              </div>

              <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Recebido
                  </span>
                  <span className="tabular-nums">
                    {formatBRL(overview.recebido)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Receber
                  </span>
                  <span className="tabular-nums">
                    {formatBRL(overview.aReceber)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Glosado
                  </span>
                  <span className="tabular-nums">
                    {formatBRL(overview.glosado)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </>
      ) : null}

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Pendências de Conciliação</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Consultas/Procedimentos anteriores à data atual, sem conciliação
              </p>
            </div>
            <input
              ref={statementFileRef}
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.csv,.xls,.xlsx,.ofx,application/pdf,image/png,image/jpeg,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadPaymentStatement(file).catch(() => {});
              }}
            />
            <Button
              size="sm"
              className="bg-gradient-primary shadow-elegant"
              disabled={statementUploading}
              onClick={() => statementFileRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              Enviar extrato
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {toConciliate.length ? (
              toConciliate.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => openEdit(e.id)}
                  className="w-full text-left flex items-center justify-between gap-3 py-2 border-b border-border last:border-0 hover:bg-muted/20 rounded-md px-2 -mx-2 transition-smooth"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {e.nome_paciente ?? "Paciente"}
                    </div>
                    <div className="italic text-sm truncate">
                      {e.numero_guia_convenio
                        ? `Guia ${e.numero_guia_convenio}`
                        : "Sem número de Guia"}
                      {e.data_encontro
                        ? ` · ${formatDateTimeBR(e.data_encontro)}`
                        : ""}
                    </div>

                    <div className="text-xs text-muted-foreground truncate">
                      {(e.nome_procedimento ?? "Procedimento") +
                        " · " +
                        (e.convenio_utilizado ?? "—")}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold tabular-nums">
                      {formatBRL(Number(e.valor_receber ?? 0))}
                    </div>
                    <StatusBadge status={mapStatus(e.status)} />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Nenhuma Consulta/Procedimento em aberto para conciliar.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 shadow-elegant">
          <h2 className="font-semibold mb-3">Dados Irregulares</h2>
          <ul className="space-y-3 text-sm">
            {pendencias?.items?.length ? (
              pendencias.items.slice(0, 6).map((p) => {
                const tone = pendencyTone(p.status);
                const status = mapStatus(p.status);
                const title =
                  p.reasons?.[0] ?? `${statusLabels[status]} com pendência`;
                const missing = p.missing_fields?.length
                  ? ` · ${p.missing_fields.length} campos faltando`
                  : "";
                const desc = `${statusLabels[status]}${missing}`;
                return (
                  <Pending
                    key={p.encontro_id}
                    color={tone}
                    title={title}
                    desc={desc}
                    onClick={() => {
                      setEditPendency(p);
                      openEdit(p.encontro_id);
                    }}
                  />
                );
              })
            ) : (
              <li className="text-sm text-muted-foreground">
                Nenhuma pendência encontrada.
              </li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="p-5 bg-gradient-card shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Consultas/Procedimentos recentes</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/trabalho">
              Ver tudo <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {recent.length ? (
            recent.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => openEdit(e.id)}
                className="w-full text-left flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0 hover:bg-muted/20 rounded-md px-2 -mx-2 transition-smooth"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">
                    {e.patient}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {e.procedure} · {e.payer}
                    {e.guide ? ` · Guia ${e.guide}` : ""}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold tabular-nums">
                    {formatBRL(e.value)}
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              </button>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              Nenhuma Consulta/Procedimento encontrada.
            </div>
          )}
        </div>
      </Card>

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
                    {editPendency.suggested_next_status ? (
                      <p className="mt-1">
                        Próximo status sugerido:{" "}
                        {apiStatusLabels[editPendency.suggested_next_status]}
                      </p>
                    ) : null}
                  </AlertDescription>
                </div>
              </Alert>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="dash-edit-patient">Paciente</Label>
              <Input
                id="dash-edit-patient"
                value={editForm.patient}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, patient: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="dash-edit-procedure">Procedimento</Label>
                <Input
                  id="dash-edit-procedure"
                  value={editForm.procedure}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, procedure: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dash-edit-payer">Convênio</Label>
                <Input
                  id="dash-edit-payer"
                  value={editForm.payer}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, payer: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dash-edit-guide">
                Número da guia do convênio
              </Label>
              <Input
                id="dash-edit-guide"
                value={editForm.guide}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, guide: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="dash-edit-date">Data</Label>
                <Input
                  id="dash-edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, date: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dash-edit-value">Valor Procedimento/Consulta</Label>
                <Input
                  id="dash-edit-value"
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
                <Label htmlFor="dash-edit-paid">Valor Pago</Label>
                <Input
                  id="dash-edit-paid"
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

                  await refresh();
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

function KPI({
  icon: Icon,
  label,
  value,
  tone,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "primary" | "success" | "warning" | "destructive";
  trend?: string;
}) {
  const toneMap = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning-foreground bg-warning/15",
    destructive: "text-destructive bg-destructive/10",
  } as const;
  return (
    <Card className="p-4 bg-gradient-card shadow-elegant transition-smooth hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <span
          className={`h-9 w-9 rounded-lg flex items-center justify-center ${toneMap[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {trend && (
          <span className="text-xs text-muted-foreground">{trend}</span>
        )}
      </div>
      <div className="mt-3 text-xl md:text-2xl font-semibold tabular-nums">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </Card>
  );
}

function Pending({
  color,
  title,
  desc,
  onClick,
}: {
  color: "destructive" | "warning" | "info" | "primary";
  title: string;
  desc: string;
  onClick: () => void;
}) {
  const map = {
    destructive: "bg-destructive",
    warning: "bg-warning",
    info: "bg-info",
    primary: "bg-primary",
  } as const;
  return (
    <li className="flex gap-3 cursor-pointer" onClick={onClick}>
      <div className={`mt-1.5 h-2 w-2 rounded-full ${map[color]} shrink-0`} />
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </li>
  );
}
