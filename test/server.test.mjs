import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

test("health and response submission", async t => {
  const directory = await mkdtemp(join(tmpdir(), "remus-questionnaire-"));
  const responsesFile = join(directory, "responses.ndjson");
  const port = 39000 + Math.floor(Math.random() * 1000);
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(port), RESPONSES_FILE: responsesFile },
    stdio: "ignore"
  });
  t.after(() => child.kill());

  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/api/health`)).ok) break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);

  const submission = await fetch(`${baseUrl}/api/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionnaireVersion: "2026-10-07.v3",
      consent: true,
      answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [`q${index}`, "answer"]))
    })
  });
  assert.equal(submission.status, 201);
  const saved = JSON.parse((await readFile(responsesFile, "utf8")).trim());
  assert.equal(saved.consent, true);
  assert.equal(Object.keys(saved.answers).length, 20);
});
