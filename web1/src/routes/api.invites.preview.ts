import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/invites/preview")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl =
          process.env.FATURAVIVA_API_BASE_URL ?? "http://127.0.0.1:8000";
        const search = new URL(request.url).searchParams;
        const token = search.get("token") ?? "";
        const url = new URL("/v1/invites/preview", baseUrl);
        if (token) url.searchParams.set("token", token);

        const upstream = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
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
    },
  },
});
