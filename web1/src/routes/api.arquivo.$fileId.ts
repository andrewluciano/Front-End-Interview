import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/arquivo/$fileId")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const url = new URL(
          `/v1/arquivo/${encodeURIComponent(params.fileId)}`,
          baseUrl,
        );

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

        const upstream = await fetch(url, {
          method: "DELETE",
          headers: {
            accept: "application/json",
            authorization,
          },
        });

        const status = upstream.status;
        const contentType = upstream.headers.get("content-type");
        const headers: Record<string, string> = { "cache-control": "no-store" };

        if (contentType) {
          headers["content-type"] = contentType;
        }

        if (status === 204 || status === 205 || status === 304) {
          return new Response(null, { status, headers });
        }

        const body = await upstream.text();
        if (!headers["content-type"]) {
          headers["content-type"] = "application/json; charset=utf-8";
        }
        return new Response(body, { status, headers });
      },
    },
  },
});
