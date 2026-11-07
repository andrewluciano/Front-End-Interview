import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/pacientes")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const url = new URL("/v1/pacientes", baseUrl);

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
          method: "GET",
          headers: {
            accept: "application/json",
            authorization,
          },
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
        const url = new URL("/v1/pacientes", baseUrl);

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
          method: "POST",
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
    },
  },
});
