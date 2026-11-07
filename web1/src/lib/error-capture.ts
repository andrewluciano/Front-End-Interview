// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;
const TICKET_DEDUP_MS = 60_000;
let lastTicket: { signature: string; at: number } | undefined;

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatErrorForTicket(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? "",
    };
  }
  return {
    name: "NonError",
    message: typeof error === "string" ? error : safeStringify(error),
    stack: "",
  };
}

function ticketSignature(error: unknown) {
  const e = formatErrorForTicket(error);
  const msg = `${e.name}:${e.message}`.slice(0, 500);
  const st = (e.stack ?? "").split("\n").slice(0, 3).join("\n").slice(0, 500);
  const path =
    typeof location !== "undefined"
      ? `${location.pathname}${location.search}${location.hash}`
      : "";
  return `${path}|${msg}|${st}`;
}

async function openTicket(error: unknown) {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("fv_access_token");
  if (!token) return;

  const signature = ticketSignature(error);
  const now = Date.now();
  if (
    lastTicket &&
    lastTicket.signature === signature &&
    now - lastTicket.at < TICKET_DEDUP_MS
  )
    return;
  lastTicket = { signature, at: now };

  const path = `${location.pathname}${location.search}${location.hash}`;
  const e = formatErrorForTicket(error);
  const payload = {
    page_path: path,
    message: [
      `Erro capturado automaticamente`,
      ``,
      `Nome: ${e.name}`,
      `Mensagem: ${e.message}`,
      e.stack ? `Stack:\n${e.stack}` : "",
      ``,
      `User-Agent: ${navigator.userAgent}`,
      `Data/Hora: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  try {
    await fetch("/api/suporte/tickets", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {}
}

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
  openTicket(error).catch(() => {});
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) =>
    record((event as ErrorEvent).error ?? event),
  );
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
