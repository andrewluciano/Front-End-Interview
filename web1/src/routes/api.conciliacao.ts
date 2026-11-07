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
  numero_guia_convenio?: string | null;
  nome_procedimento?: string | null;
  data_evento?: string | null;
  data_encontro?: string | null;
  data_pagamento?: string | null;
  valor_receber?: number | null;
  valor_recebido?: number | null;
  updated_at?: string | null;
};

type ApiFile = {
  id: string;
  original_filename: string;
  content_type?: string | null;
  size_bytes?: number | null;
  uploaded_by?: string | null;
  created_at?: string | null;
  file_type?: string | null;
};

type ApiFileWorkflow = {
  file: ApiFile;
  stage?: {
    key?: string | null;
    label?: string | null;
    status?: string | null;
    updated_at?: string | null;
  } | null;
  history?: Array<{
    id: string;
    status?: string | null;
    created_at?: string | null;
  }> | null;
  encontros?: ApiEncontro[] | null;
};

type ConciliacaoSummary = {
  total_encontros: number;
  total_a_receber: number;
  total_recebido: number;
  total_glosado: number;
  por_status: Record<
    string,
    { count: number; valor_receber: number; valor_recebido: number }
  >;
};

type ConciliacaoByFileItem = {
  file: ApiFile;
  stage: {
    label: string | null;
    status: string | null;
    updated_at: string | null;
  };
  conciliated: {
    total: number;
    paid: number;
    glosado_total: number;
    glosado_parcialmente: number;
    encontros: ApiEncontro[];
  };
};

type ConciliacaoResponse = {
  summary: ConciliacaoSummary | null;
  files: ConciliacaoByFileItem[];
};

export const Route = createFileRoute("/api/conciliacao")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";

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

        const [summaryRes, filesRes] = await Promise.all([
          fetch(new URL("/v1/conciliacao", baseUrl), {
            method: "GET",
            headers: { accept: "application/json", authorization },
          }),
          fetch(new URL("/v1/arquivo", baseUrl), {
            method: "GET",
            headers: { accept: "application/json", authorization },
          }),
        ]);

        const summary = summaryRes.ok
          ? ((await summaryRes.json()) as ConciliacaoSummary)
          : null;
        const filesRaw = filesRes.ok
          ? ((await filesRes.json()) as unknown)
          : [];
        const files = Array.isArray(filesRaw) ? (filesRaw as ApiFile[]) : [];

        const extratos = files
          .filter((f) => (f.file_type ?? "") === "extrato_pagamento")
          .slice()
          .sort((a, b) => {
            const at = a.created_at ? Date.parse(a.created_at) : 0;
            const bt = b.created_at ? Date.parse(b.created_at) : 0;
            return bt - at;
          })
          .slice(0, 10);

        const finalized: ApiEncontroStatus[] = [
          "pago",
          "glosado_total",
          "glosado_parcialmente",
        ];
        const items: ConciliacaoByFileItem[] = [];

        for (const f of extratos) {
          const wfUrl = new URL(
            `/v1/arquivo/${encodeURIComponent(f.id)}/workflow`,
            baseUrl,
          );
          wfUrl.searchParams.set("minutes", "1440");
          const wfRes = await fetch(wfUrl, {
            method: "GET",
            headers: { accept: "application/json", authorization },
          });
          const wf = wfRes.ok
            ? ((await wfRes.json()) as ApiFileWorkflow)
            : null;

          const encontros = Array.isArray(wf?.encontros)
            ? (wf?.encontros as ApiEncontro[])
            : [];
          const conciliatedEncontros = encontros.filter((e) =>
            finalized.includes(e.status),
          );
          const counts = {
            total: conciliatedEncontros.length,
            paid: conciliatedEncontros.filter((e) => e.status === "pago")
              .length,
            glosado_total: conciliatedEncontros.filter(
              (e) => e.status === "glosado_total",
            ).length,
            glosado_parcialmente: conciliatedEncontros.filter(
              (e) => e.status === "glosado_parcialmente",
            ).length,
          };

          items.push({
            file: wf?.file ?? f,
            stage: {
              label: wf?.stage?.label ?? null,
              status: wf?.stage?.status ?? null,
              updated_at: wf?.stage?.updated_at ?? null,
            },
            conciliated: { ...counts, encontros: conciliatedEncontros },
          });
        }

        const body: ConciliacaoResponse = { summary, files: items };
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
      PATCH: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const url = new URL("/v1/conciliacao/aplicar", baseUrl);

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

        const payload = await request.text();
        const upstream = await fetch(url, {
          method: "PATCH",
          headers: {
            accept: "application/json",
            "content-type":
              request.headers.get("content-type") ?? "application/json",
            authorization,
          },
          body: payload,
        });

        const body = await upstream.text();
        return new Response(body, {
          status: upstream.status,
          headers: {
            "content-type":
              upstream.headers.get("content-type") ??
              "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
      PUT: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const url = new URL("/v1/conciliacao/auto", baseUrl);

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

        const payload = await request.text();
        const hasBody = payload.trim().length > 0;
        const upstream = await fetch(url, {
          method: "POST",
          headers: {
            accept: "application/json",
            ...(hasBody
              ? {
                  "content-type":
                    request.headers.get("content-type") ?? "application/json",
                }
              : {}),
            authorization,
          },
          ...(hasBody ? { body: payload } : {}),
        });

        const body = await upstream.text();
        return new Response(body, {
          status: upstream.status,
          headers: {
            "content-type":
              upstream.headers.get("content-type") ??
              "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
      POST: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const url = new URL("/v1/arquivo/upload/extrato-conciliacao", baseUrl);

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

        const incoming = await request.formData();
        const outgoing = new FormData();
        const file = incoming.get("file");
        if (file != null) outgoing.set("file", file);

        const upstream = await fetch(url, {
          method: "POST",
          headers: {
            accept: "application/json",
            authorization,
          },
          body: outgoing,
        });

        const body = await upstream.text();
        return new Response(body, {
          status: upstream.status,
          headers: {
            "content-type":
              upstream.headers.get("content-type") ??
              "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
