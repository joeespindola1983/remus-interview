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

  const clubPage = await fetch(`${baseUrl}/club/`);
  assert.equal(clubPage.status, 200);
  assert.match(await clubPage.text(), /Pesquisa detalhada/);

  const clubScript = await fetch(`${baseUrl}/club/club.js`);
  assert.equal(clubScript.status, 200);
  const clubScriptText = await clubScript.text();
  assert.match(clubScriptText, /club_detailed_questionnaire/);
  assert.match(clubScriptText, /2026-10-09\.v2/);
  assert.match(clubScriptText, /brl_5_to_15/);

  const landingPage = await fetch(`${baseUrl}/`);
  assert.equal(landingPage.status, 200);
  assert.match(await landingPage.text(), /Qual pesquisa você quer responder/);

  const initialPage = await fetch(`${baseUrl}/initial/`);
  assert.equal(initialPage.status, 200);
  assert.match(await initialPage.text(), /Pesquisa inicial/);

  const initialScript = await fetch(`${baseUrl}/app.js`);
  assert.equal(initialScript.status, 200);
  const initialScriptText = await initialScript.text();
  assert.match(initialScriptText, /2026-10-09\.v5/);
  assert.match(initialScriptText, /brl_5_to_15/);

  const adminPage = await fetch(`${baseUrl}/admin/`);
  assert.equal(adminPage.status, 200);
  assert.match(await adminPage.text(), /Área administrativa/);

  const legacyAdminPage = await fetch(`${baseUrl}/responses/`, { redirect: "manual" });
  assert.equal(legacyAdminPage.status, 308);
  assert.equal(legacyAdminPage.headers.get("location"), "/admin/");

  const submission = await fetch(`${baseUrl}/api/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionnaireVersion: "2026-10-07.v3",
      consent: true,
      answers: {
        researchInstrument: "club_detailed_questionnaire",
        instrumentRevision: "2026-10-09.v2",
        ...Object.fromEntries(Array.from({ length: 18 }, (_, index) => [`q${index}`, "answer"]))
      }
    })
  });
  assert.equal(submission.status, 201);
  const saved = JSON.parse((await readFile(responsesFile, "utf8")).trim());
  assert.equal(saved.consent, true);
  assert.equal(Object.keys(saved.answers).length, 20);
  assert.equal(saved.answers.researchInstrument, "club_detailed_questionnaire");
});
