import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { appendFile, mkdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID, timingSafeEqual } from "node:crypto";

const root = fileURLToPath(new URL("./public/", import.meta.url));
const port = Number(process.env.PORT || 3000);
const responsesFile = process.env.RESPONSES_FILE || fileURLToPath(new URL("./data/responses.ndjson", import.meta.url));
const adminToken = process.env.ADMIN_TOKEN || "";
const bodyLimit = 64 * 1024;
const recentSubmissions = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function json(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

function requestIp(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function isRateLimited(request) {
  const now = Date.now();
  const ip = requestIp(request);
  const previous = recentSubmissions.get(ip) || 0;
  recentSubmissions.set(ip, now);
  for (const [key, timestamp] of recentSubmissions) {
    if (now - timestamp > 60_000) recentSubmissions.delete(key);
  }
  return now - previous < 1_500;
}

async function readJsonBody(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > bodyLimit) throw new Error("BODY_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function isValidSubmission(value) {
  return value
    && value.questionnaireVersion === "2026-10-07.v3"
    && value.consent === true
    && value.answers
    && typeof value.answers === "object"
    && Object.keys(value.answers).length >= 16;
}

function hasAdminAccess(request) {
  if (!adminToken) return false;
  const candidate = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const left = Buffer.from(candidate);
  const right = Buffer.from(adminToken);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function serveFile(request, response) {
  const url = new URL(request.url, "http://localhost");
  const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(root, safePath);
  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    json(response, 404, { error: "not_found" });
    return;
  }
  const details = await stat(filePath);
  if (!details.isFile()) {
    json(response, 404, { error: "not_found" });
    return;
  }
  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "Cache-Control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=300",
    "Content-Security-Policy": "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "GET" && url.pathname === "/api/health") {
      json(response, 200, { status: "ok" });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/responses") {
      if (isRateLimited(request)) {
        json(response, 429, { error: "too_many_requests" });
        return;
      }
      const submission = await readJsonBody(request);
      if (!isValidSubmission(submission)) {
        json(response, 422, { error: "invalid_submission" });
        return;
      }
      await mkdir(join(responsesFile, ".."), { recursive: true });
      const record = {
        id: randomUUID(),
        receivedAt: new Date().toISOString(),
        questionnaireVersion: submission.questionnaireVersion,
        consent: true,
        locale: submission.locale || "pt-BR",
        contactConsent: submission.contactConsent === true,
        respondent: submission.contactConsent === true ? submission.respondent || null : null,
        answers: submission.answers
      };
      await appendFile(responsesFile, `${JSON.stringify(record)}\n`, { mode: 0o600 });
      json(response, 201, { id: record.id, receivedAt: record.receivedAt });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/responses/export") {
      if (!hasAdminAccess(request)) {
        json(response, 401, { error: "unauthorized" });
        return;
      }
      if (!existsSync(responsesFile)) {
        response.writeHead(200, { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" });
        response.end();
        return;
      }
      response.writeHead(200, {
        "Content-Type": "application/x-ndjson",
        "Content-Disposition": "attachment; filename=remus-questionnaire-responses.ndjson",
        "Cache-Control": "no-store"
      });
      createReadStream(responsesFile).pipe(response);
      return;
    }

    if (request.method === "GET" || request.method === "HEAD") {
      await serveFile(request, response);
      return;
    }
    json(response, 405, { error: "method_not_allowed" });
  } catch (error) {
    const status = error.message === "BODY_TOO_LARGE" ? 413 : error instanceof SyntaxError ? 400 : 500;
    json(response, status, { error: status === 500 ? "internal_error" : "invalid_request" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`REMUS QUESTIONNAIRE listening on http://0.0.0.0:${port}`);
});
