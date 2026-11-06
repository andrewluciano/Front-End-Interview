import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#2d7a5a" },
        { title: "Fatura Viva" },
        { name: "description", content: "Saúde financeira para clínicas" },
        { name: "author", content: "Fatura Viva" },
        { property: "og:title", content: "Fatura Viva" },
        {
          property: "og:description",
          content: "Saúde financeira para clínicas",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@FaturaViva" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  const googleTagId = "G-B57BSV47GD";
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleTagId}');`,
          }}
        />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const [apiPending, setApiPending] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { __fv_fetch_wrapped?: boolean };
    if (!w.__fv_fetch_wrapped) {
      w.__fv_fetch_wrapped = true;

      const originalFetch = window.fetch.bind(window);
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const methodRaw = (init?.method ??
          (typeof Request !== "undefined" && input instanceof Request
            ? input.method
            : undefined) ??
          "GET") as string;
        const method = methodRaw.toUpperCase();
        const isMutation =
          method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

        let urlString = "";
        if (typeof input === "string") urlString = input;
        else if (typeof URL !== "undefined" && input instanceof URL)
          urlString = input.toString();
        else if (typeof Request !== "undefined" && input instanceof Request)
          urlString = input.url;

        let trackApi = false;
        try {
          const resolved = new URL(urlString || "", window.location.origin);
          trackApi = resolved.pathname.startsWith("/api/");
        } catch {
          trackApi =
            typeof urlString === "string" && urlString.startsWith("/api/");
        }

        if (trackApi) {
          setApiPending((c) => c + 1);
        }

        let res: Response;
        try {
          res = await originalFetch(input as any, init as any);
        } finally {
          if (trackApi) {
            setApiPending((c) => (c > 0 ? c - 1 : 0));
          }
        }

        try {
          if (!isMutation || !res.ok) return res;

          const resolved = new URL(urlString || "", window.location.origin);
          const path = resolved.pathname;
          if (!path.startsWith("/api/")) return res;

          const detail = { method, path, status: res.status, at: Date.now() };
          window.dispatchEvent(new CustomEvent("fv:api-changed", { detail }));

          const events: string[] = [];
          if (path.startsWith("/api/arquivo")) events.push("fv:files-changed");
          if (path.startsWith("/api/pacientes"))
            events.push("fv:patients-changed");
          if (path.startsWith("/api/encontros"))
            events.push("fv:encontros-changed");
          if (path.startsWith("/api/pendencias"))
            events.push("fv:pendencias-changed");
          if (path.startsWith("/api/users") || path.startsWith("/api/invites"))
            events.push("fv:users-changed");
          if (path.startsWith("/api/configuracoes"))
            events.push("fv:global-settings-changed");

          for (const name of events) {
            window.dispatchEvent(new CustomEvent(name, { detail }));
          }
        } catch {
          return res;
        }

        return res;
      };
    }

    const onApiChanged = () => {
      router.invalidate();
    };
    window.addEventListener("fv:api-changed", onApiChanged);
    return () => {
      window.removeEventListener("fv:api-changed", onApiChanged);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalLoadingIndicator apiPending={apiPending} />
      <GlobalAuthRedirectNotice />
      <Outlet />
    </QueryClientProvider>
  );
}

function GlobalLoadingIndicator({ apiPending }: { apiPending: number }) {
  const routerLoading = useRouterState({
    select: (s) => {
      const state = s as any;
      if (typeof state.isLoading === "boolean") return state.isLoading;
      if (typeof state.status === "string") return state.status === "pending";
      return false;
    },
  });

  const isLoading = routerLoading || apiPending > 0;
  if (!isLoading) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="h-1 bg-primary/15">
        <div className="h-full w-1/2 bg-primary animate-pulse" />
      </div>
    </div>
  );
}

function GlobalAuthRedirectNotice() {
  const routerState = useRouterState();
  const state = routerState as any;
  const isLoading =
    (typeof state.isLoading === "boolean" && state.isLoading) ||
    (typeof state.status === "string" && state.status === "pending");
  const pathname =
    state.location?.pathname ??
    state.resolvedLocation?.pathname ??
    state.latestLocation?.pathname ??
    "/";

  const notice =
    typeof window !== "undefined"
      ? sessionStorage.getItem("fv_auth_notice")
      : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!notice) return;
    if (!isLoading && pathname === "/login") {
      sessionStorage.removeItem("fv_auth_notice");
    }
  }, [isLoading, pathname, notice]);

  if (!notice || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-elevated">
        <div className="text-sm font-medium">Autenticação</div>
        <div className="mt-1 text-sm text-muted-foreground">{notice}</div>
      </div>
    </div>
  );
}
