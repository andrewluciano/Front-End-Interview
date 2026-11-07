import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

function loadDotEnvFileIfPresent() {
  const envPath = new URL("./.env", import.meta.url);
  const fsPath = envPath.pathname;
  if (!fs.existsSync(fsPath)) return;

  const raw = fs.readFileSync(fsPath, "utf8");
  const lines = raw.split(/\r?\n/g);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const normalized = trimmed.startsWith("export ") ? trimmed.slice("export ".length) : trimmed;
    const eqIndex = normalized.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = normalized.slice(0, eqIndex).trim();
    if (!key) continue;
    if (process.env[key] !== undefined && process.env[key] !== "") continue;

    let value = normalized.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadDotEnvFileIfPresent();

const port = Number(process.env.PORT || 8080);
const distClientDir = fileURLToPath(new URL("./dist/client/", import.meta.url));

async function importFirst(modulePaths) {
  let lastError;
  for (const modulePath of modulePaths) {
    try {
      return await import(modulePath);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Failed to import server entry");
}

async function getWorker() {
  const mod = await importFirst(["./dist/server/index.js", "./dist/server/index.mjs"]);
  const worker = mod.default;
  if (!worker || typeof worker.fetch !== "function") {
    throw new Error(
      "Invalid server entry: expected default export with fetch(request, env, ctx)",
    );
  }
  return worker;
}

let workerPromise;

function getWorkerCached() {
  if (!workerPromise) workerPromise = getWorker();
  return workerPromise;
}

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".json":
      return "application/json; charset=utf-8";
    case ".map":
      return "application/json; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".woff2":
      return "font/woff2";
    case ".woff":
      return "font/woff";
    case ".ttf":
      return "font/ttf";
    default:
      return "application/octet-stream";
  }
}

function tryServeStatic(req, res) {
  const method = req.method || "GET";
  if (method !== "GET" && method !== "HEAD") return false;

  const url = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`,
  );

  if (!url.pathname.startsWith("/assets/") && url.pathname !== "/favicon.ico")
    return false;

  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(url.pathname);
  } catch {
    return false;
  }

  const resolvedPath = path.resolve(distClientDir, `.${decodedPathname}`);
  const distRoot = distClientDir.endsWith(path.sep)
    ? distClientDir
    : `${distClientDir}${path.sep}`;
  if (!resolvedPath.startsWith(distRoot)) return false;

  let stat;
  try {
    stat = fs.statSync(resolvedPath);
  } catch {
    return false;
  }
  if (!stat.isFile()) return false;

  res.statusCode = 200;
  res.setHeader("content-type", guessContentType(resolvedPath));
  res.setHeader("content-length", String(stat.size));
  res.setHeader(
    "cache-control",
    url.pathname.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
  );

  if (method === "HEAD") {
    res.end();
    return true;
  }

  fs.createReadStream(resolvedPath).pipe(res);
  return true;
}

function toRequest(req) {
  const url = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`,
  );

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "undefined") continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  const method = req.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";

  return new Request(url, {
    method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: hasBody ? "half" : undefined,
  });
}

function applyResponse(nodeRes, response) {
  nodeRes.statusCode = response.status;

  const setCookies = response.headers.getSetCookie?.();
  if (setCookies?.length) nodeRes.setHeader("set-cookie", setCookies);

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    nodeRes.setHeader(key, value);
  });

  if (response.body) {
    Readable.fromWeb(response.body).pipe(nodeRes);
    return;
  }
  nodeRes.end();
}

const server = http.createServer(async (req, res) => {
  try {
    if (tryServeStatic(req, res)) return;
    const worker = await getWorkerCached();
    const request = toRequest(req);
    const ctx = { waitUntil: () => {} };
    const response = await worker.fetch(request, process.env, ctx);
    applyResponse(res, response);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(
      err instanceof Error ? err.stack || err.message : "Internal Server Error",
    );
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Listening on ${port}`);
});
