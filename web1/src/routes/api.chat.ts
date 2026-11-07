import { createFileRoute } from "@tanstack/react-router";

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
  nome_procedimento?: string | null;
  data_evento?: string | null;
  data_encontro?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  updated_at?: string | null;
};

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function fmtBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function dateFromEncounter(e: ApiEncontro): Date | null {
  const raw = e.data_evento || e.data_encontro || e.updated_at;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function isInMonth(d: Date, y: number, m1: number) {
  return d.getFullYear() === y && d.getMonth() + 1 === m1;
}

function scoreMatch(haystack: string, queryTokens: string[]) {
  const t = normalizeText(haystack);
  let score = 0;
  for (const q of queryTokens) {
    if (!q) continue;
    if (t.includes(q)) score += 1;
  }
  return score;
}

function topGroups<T extends string>(
  items: ApiEncontro[],
  groupBy: (e: ApiEncontro) => T | null,
) {
  const map = new Map<T, { count: number; total: number }>();
  for (const e of items) {
    const key = groupBy(e);
    if (!key) continue;
    const prev = map.get(key) ?? { count: 0, total: 0 };
    map.set(key, {
      count: prev.count + 1,
      total: prev.total + asNumber(e.valor_receber),
    });
  }
  return Array.from(map.entries())
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.count - a.count || b.total - a.total)
    .slice(0, 5);
}

function buildAnswer(message: string, encontros: ApiEncontro[]) {
  const now = new Date();
  const y = now.getFullYear();
  const m1 = now.getMonth() + 1;

  const normalized = normalizeText(message);
  const tokens = normalized.split(/[\s,.;:!?()]+/g).filter(Boolean);

  const encountersWithDate = encontros
    .map((e) => ({ e, dt: dateFromEncounter(e) }))
    .filter((x) => x.dt !== null) as Array<{ e: ApiEncontro; dt: Date }>;

  const thisMonth = encountersWithDate
    .filter((x) => isInMonth(x.dt, y, m1))
    .map((x) => x.e);
  const glosasThisMonth = thisMonth.filter(
    (e) => e.status === "glosado_total" || e.status === "glosado_parcialmente",
  );

  const totalThisMonth = thisMonth.length;
  const glosaCountThisMonth = glosasThisMonth.length;
  const glosaRate = totalThisMonth ? glosaCountThisMonth / totalThisMonth : 0;

  const glosaValueThisMonth = glosasThisMonth.reduce((sum, e) => {
    const vr = asNumber(e.valor_receber);
    const vrc = asNumber(e.valor_recebido);
    const diff = e.status === "glosado_total" ? vr : Math.max(vr - vrc, 0);
    return sum + diff;
  }, 0);

  const askedProcedimento =
    normalized.includes("proced") || normalized.includes("tuss");
  const askedConvenio =
    normalized.includes("conven") || normalized.includes("plano");
  const askedPaciente =
    normalized.includes("paciente") || tokens.some((t) => t.length >= 4);
  const askedGlosa =
    normalized.includes("glosa") || normalized.includes("glos");
  const askedPago =
    normalized.includes("pago") || normalized.includes("recebid");

  if (askedGlosa && askedProcedimento) {
    const top = topGroups(glosasThisMonth, (e) =>
      e.nome_procedimento ? (e.nome_procedimento as string) : null,
    );
    if (!top.length)
      return "Não encontrei glosas com procedimento identificado neste mês.";
    const lines = top
      .map(
        (x, idx) =>
          `${idx + 1}. ${x.key} — ${x.count} glosa(s), ${fmtBRL(x.total)} em valor a receber`,
      )
      .join("\n");
    return `Neste mês (${monthKey(now)}), os procedimentos com mais glosas são:\n${lines}\n\nTotal: ${glosaCountThisMonth} glosa(s) em ${totalThisMonth} procedimento(s) (${Math.round(glosaRate * 100)}%).`;
  }

  if (askedGlosa && askedConvenio) {
    const top = topGroups(glosasThisMonth, (e) =>
      e.convenio_utilizado ? (e.convenio_utilizado as string) : null,
    );
    if (!top.length)
      return "Não encontrei glosas com convênio identificado neste mês.";
    const lines = top
      .map(
        (x, idx) =>
          `${idx + 1}. ${x.key} — ${x.count} glosa(s), ${fmtBRL(x.total)} em valor a receber`,
      )
      .join("\n");
    return `Neste mês (${monthKey(now)}), os convênios com mais glosas são:\n${lines}\n\nTotal: ${glosaCountThisMonth} glosa(s) em ${totalThisMonth} procedimento(s) (${Math.round(glosaRate * 100)}%).`;
  }

  if (askedGlosa) {
    return `Neste mês (${monthKey(now)}), você tem ${glosaCountThisMonth} glosa(s) em ${totalThisMonth} procedimento(s) (${Math.round(glosaRate * 100)}%).\nValor potencial (glosa total/parcial): ${fmtBRL(glosaValueThisMonth)}.`;
  }

  if (askedPago) {
    const pagos = thisMonth.filter((e) => e.status === "pago");
    const total = pagos.reduce(
      (sum, e) => sum + asNumber(e.valor_recebido ?? e.valor_receber),
      0,
    );
    return `Neste mês (${monthKey(now)}), há ${pagos.length} procedimento(s) pagos.\nTotal recebido: ${fmtBRL(total)}.`;
  }

  if (askedPaciente) {
    const qTokens = tokens.filter((t) => t.length >= 3);
    const candidates = encontros
      .map((e) => {
        const patient = e.nome_paciente ?? "";
        const proc = e.nome_procedimento ?? "";
        const payer = e.convenio_utilizado ?? "";
        const score = scoreMatch(`${patient} ${proc} ${payer}`, qTokens);
        return { e, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.e);

    if (!candidates.length) {
      return "Não encontrei Consultas/Procedimentos que casem com a sua busca. Tente informar paciente, convênio ou procedimento.";
    }

    const lines = candidates
      .map((e) => {
        const dt = dateFromEncounter(e);
        const when = dt ? dt.toLocaleDateString("pt-BR") : "—";
        const patient = e.nome_paciente ?? "—";
        const proc = e.nome_procedimento ?? "—";
        const payer = e.convenio_utilizado ?? "—";
        const value = fmtBRL(asNumber(e.valor_receber));
        return `• ${when} — ${patient} — ${proc} — ${payer} — ${value} — ${e.status}`;
      })
      .join("\n");

    return `Encontrei ${candidates.length} procedimento(s) relacionado(s) à sua busca:\n${lines}`;
  }

  return `Posso pesquisar suas Consultas/Procedimentos por paciente, procedimento, convênio e status.\nExemplos:\n- "Qual procedimento mais glosou esse mês?"\n- "Mostre glosas por convênio"\n- "Consultas/Procedimentos do paciente Maria"`;
}

function streamText(text: string) {
  const encoder = new TextEncoder();
  const chunkSize = 48;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < text.length; i += chunkSize) {
        controller.enqueue(encoder.encode(text.slice(i, i + chunkSize)));
      }
      controller.close();
    },
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const url = new URL("/v1/encontros", baseUrl);

        const envAuth =
          process.env.FATURAVIVA_API_AUTHORIZATION ??
          process.env.FATURAVIVA_API_TOKEN ??
          "";
        const headerAuth = request.headers.get("authorization") ?? "";
        const rawAuth = headerAuth || envAuth;
        const authorization = rawAuth
          ? rawAuth.toLowerCase().startsWith("bearer ")
            ? rawAuth
            : `Bearer ${rawAuth}`
          : "";

        if (!authorization) {
          return new Response(
            JSON.stringify({ error: "Missing Authorization" }),
            {
              status: 401,
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "no-store",
              },
            },
          );
        }

        let payload: any = null;
        try {
          payload = await request.json();
        } catch {
          payload = null;
        }

        const message =
          typeof payload?.message === "string" ? payload.message : "";
        if (!message.trim()) {
          return new Response(JSON.stringify({ error: "Missing message" }), {
            status: 400,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
            },
          });
        }

        const upstream = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization,
          },
        });

        if (!upstream.ok) {
          const body = await upstream.text().catch(() => "");
          return new Response(
            body || JSON.stringify({ error: "Upstream error" }),
            {
              status: upstream.status,
              headers: {
                "content-type":
                  upstream.headers.get("content-type") ??
                  "application/json; charset=utf-8",
                "cache-control": "no-store",
              },
            },
          );
        }

        const data = (await upstream.json()) as unknown;
        const encontros = Array.isArray(data) ? (data as ApiEncontro[]) : [];
        const answer = buildAnswer(message, encontros);

        return new Response(streamText(answer), {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
