import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Send,
} from "lucide-react";
import { formatBRL } from "@/lib/mock-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/app/insights")({
  component: Insights,
  head: () => ({ meta: [{ title: "Insights — Fatura Viva" }] }),
  loader: async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("fv_access_token")
          : null;
      const headers = {
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch("/api/insights", { headers });
      if (!res.ok) return null;
      const payload = (await res.json()) as unknown;
      if (!payload || typeof payload !== "object") return null;
      return payload as InsightsResponse;
    } catch {
      return null;
    }
  },
});

type InsightsResponse = {
  receita_projetada_mes: {
    reference_month: string;
    currency: string;
    projected_value: number;
    month_to_date_value: number;
    last_month_value: number;
    percent_vs_last_month: number | null;
  };
  risco_glosa: {
    month_to_date_encounters: number;
    glosa_encounters: number;
    glosa_rate: number;
    at_risk_encounters: number;
    at_risk_rate: number;
    top_risk_reasons: Record<string, number>;
  };
  oportunidade: {
    currency: string;
    window_days: number;
    appealable_glosa_count: number;
    appealable_glosa_value: number;
  };
};

function pctText(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value * 100)}%`;
}

function signedPct(value: number) {
  if (!Number.isFinite(value)) return "0%";
  const rounded = Math.round(value);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

function riskReasonLabel(reason: string) {
  const map: Record<string, string> = {
    convenio_utilizado_vazio: "Convênio não informado",
    numero_guia_convenio_vazio: "Guia do convênio faltando",
    numero_carteira_vazio: "Número da carteira faltando",
    nome_procedimento_vazio: "Procedimento não informado",
    valor_receber_vazio: "Valor a receber faltando",
    data_evento_encontro_vazia: "Data da Consulta/Procedimento faltando",
    procedimento_sem_codigo: "Procedimento sem código",
  };
  return map[reason] ?? reason;
}

type ChatMessage = {
  id: string;
  who: "ai" | "me";
  text: string;
  pending?: boolean;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function Insights() {
  const insights = Route.useLoaderData();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      who: "ai",
      text: "Olá! Posso pesquisar suas Consultas/Procedimentos por paciente, convênio, procedimento e status. O que você quer saber?",
    },
  ]);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const percentVsLastMonth =
    insights?.receita_projetada_mes?.percent_vs_last_month ?? null;
  const topRiskReason = (() => {
    const raw = insights?.risco_glosa?.top_risk_reasons ?? {};
    const entries = Object.entries(raw).sort((a, b) => b[1] - a[1]);
    return entries.length
      ? { reason: entries[0][0], count: entries[0][1] }
      : null;
  })();

  const tips = [
    {
      icon: TrendingUp,
      tone: "primary",
      title: "Receita projetada para o mês",
      value: insights
        ? formatBRL(Number(insights.receita_projetada_mes.projected_value ?? 0))
        : "—",
      desc: insights
        ? `${percentVsLastMonth === null ? "Sem base do mês anterior." : `${signedPct(percentVsLastMonth)} vs mês anterior`} MTD: ${formatBRL(Number(insights.receita_projetada_mes.month_to_date_value ?? 0))}.`
        : "Conecte-se para ver a projeção com base nas suas Consultas/Procedimentos.",
    },
    {
      icon: AlertTriangle,
      tone: "destructive",
      title: "Ocorrências de glosa",
      value: insights
        ? `${pctText(Number(insights.risco_glosa.at_risk_rate ?? 0))} em risco`
        : "—",
      desc: insights
        ? `${insights.risco_glosa.total_glosa_count} procedimento(s) sinalizado(s). Principal motivo: ${topRiskReason ? `${riskReasonLabel(topRiskReason.reason)} (${topRiskReason.count})` : "—"}.`
        : "Conecte-se para ver sinais de risco nas suas Consultas/Procedimentos.",
    },
    {
      icon: Lightbulb,
      tone: "warning",
      title: "Oportunidade",
      value: insights
        ? formatBRL(Number(insights.oportunidade.appealable_glosa_value ?? 0))
        : "—",
      desc: insights
        ? `${insights.oportunidade.appealable_glosa_count} glosa(s) recursável(is) nos últimos ${insights.oportunidade.window_days} dias.`
        : "Conecte-se para ver oportunidades de recuperação.",
    },
  ] as const;

  const suggestions = useMemo(() => {
    const base = [
      "Qual procedimento mais glosou esse mês?",
      "Mostre glosas por convênio",
      "Consultas/Procedimentos do paciente Maria",
    ];

    if (!insights) return base;

    const riskHint = topRiskReason?.reason
      ? riskReasonLabel(topRiskReason.reason)
      : null;
    return [
      `Resumo das glosas do mês (${pctText(Number(insights.risco_glosa.glosa_rate ?? 0))})`,
      riskHint ? `Quais Consultas/Procedimentos estão em risco por: ${riskHint}?` : base[1],
      base[0],
    ];
  }, [insights, topRiskReason?.reason]);

  const updateMessage = (id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  };

  const send = async (text: string) => {
    const token = localStorage.getItem("fv_access_token");
    const trimmed = text.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userId = uid();
    const aiId = uid();
    setMessages((prev) => [
      ...prev,
      { id: userId, who: "me", text: trimmed },
      { id: aiId, who: "ai", text: "", pending: true },
    ]);
    setSending(true);

    if (!token) {
      updateMessage(aiId, {
        text: "Você precisa estar logado para eu conseguir acessar seus dados.",
        pending: false,
      });
      setSending(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          accept: "text/plain",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        updateMessage(aiId, {
          text: errText || "Não foi possível responder agora.",
          pending: false,
        });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        const full = await res.text().catch(() => "");
        updateMessage(aiId, {
          text: full || "Não foi possível responder agora.",
          pending: false,
        });
        return;
      }

      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        updateMessage(aiId, { text: acc });
      }
      updateMessage(aiId, { text: acc.trim() || "—", pending: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro inesperado";
      updateMessage(aiId, {
        text: `Falha ao consultar dados: ${msg}`,
        pending: false,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Insights & previsões
        </h1>
        <p className="text-muted-foreground text-sm">
          Quanto mais dados você cadastra, mais precisas ficam as análises da
          IA.
        </p>
      </div>

      {!insights && (
        <Alert>
          <AlertTitle>Insights indisponíveis</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os insights agora. Verifique se você está
            logado.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        {tips.map((t, i) => {
          const tone = {
            primary: "bg-primary/10 text-primary",
            destructive: "bg-destructive/10 text-destructive",
            warning: "bg-warning/15 text-warning-foreground",
          }[t.tone as "primary" | "destructive" | "warning"];
          return (
            <Card
              key={i}
              className="p-5 bg-gradient-card shadow-elegant transition-smooth hover:shadow-elevated"
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${tone}`}
              >
                <t.icon className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                {t.title}
              </div>
              <div className="text-xl font-semibold tabular-nums mt-1">
                {t.value}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Chat */}
      {/* <Card className="p-5 shadow-elegant">
        <h2 className="font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Converse com seus dados
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pergunte qualquer coisa sobre faturamento, glosas e produção.
        </p>

        <div className="mt-4 space-y-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} who={m.who} pending={m.pending}>
              {m.text}
            </ChatBubble>
          ))}
          <div ref={endRef} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              className="h-8 px-3 text-xs"
              disabled={sending}
              onClick={() => send(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = input;
            setInput("");
            void send(value);
          }}
        >
          <Input
            placeholder="Pergunte sobre seus dados..."
            value={input}
            disabled={sending}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-primary shrink-0"
            disabled={sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card> */}
    </div>
  );
}

function ChatBubble({
  who,
  children,
  pending,
}: {
  who: "ai" | "me";
  children: string;
  pending?: boolean;
}) {
  return (
    <div className={`flex ${who === "me" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          who === "me"
            ? "bg-gradient-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        } whitespace-pre-line`}
      >
        {children || (pending ? "…" : "—")}
      </div>
    </div>
  );
}
