const transportVersion = "2026-10-07.v3";
const responseEndpoint = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "/api/responses"
  : "https://remus-app-recorder-backend.onrender.com/api/questionnaire/responses";

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, reduceMotion() ? 5 : milliseconds));

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  })[character]);
}

function resolve(value, answers) {
  return typeof value === "function" ? value(answers) : value;
}

export function mountQuestionnaire(config) {
  const personalizedName = config.allowPersonalizedName
    ? new URLSearchParams(location.search).get("name")?.trim().slice(0, 120) || ""
    : "";
  const query = new URLSearchParams(location.search);
  const draftKey = `remusQuestionnaireDraft:${config.instrumentId}:${config.revision}`;
  const screen = document.querySelector("#screen");
  const status = document.querySelector("#status");
  const progressRegion = document.querySelector("#progress-region");
  const progressLabel = document.querySelector("#progress-label");
  const progressPercent = document.querySelector("#progress-percent");
  const progressBar = document.querySelector("#progress-bar");
  const progressTrack = document.querySelector("[role='progressbar']");
  const state = { currentId: null, answers: {}, consent: false, busy: false, respondent: null, stage: "intro" };

  function setScreen(content, direction = "forward") {
    screen.className = `screen entering ${direction === "back" ? "entering-back" : ""}`;
    screen.innerHTML = content;
    requestAnimationFrame(() => screen.querySelector("button, input")?.focus({ preventScroll: true }));
  }

  function visibleQuestions() {
    return config.questions.filter(item => !item.when || item.when(state.answers));
  }

  function questionById(id) {
    return config.questions.find(item => item.id === id);
  }

  function optionsFor(item) {
    return resolve(item.options, state.answers) || [];
  }

  function pruneHiddenAnswers() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const item of config.questions) {
        if (item.when && !item.when(state.answers) && Object.hasOwn(state.answers, item.id)) {
          delete state.answers[item.id];
          changed = true;
        }
      }
    }
  }

  function saveDraft() {
    localStorage.setItem(draftKey, JSON.stringify({ answers: state.answers, consent: state.consent }));
  }

  function clearDraft() {
    localStorage.removeItem(draftKey);
  }

  function readDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey));
      return draft?.consent && draft.answers && typeof draft.answers === "object" ? draft : null;
    } catch {
      return null;
    }
  }

  function firstUnansweredId() {
    return visibleQuestions().find(item => {
      const answer = state.answers[item.id];
      return item.multiple ? !Array.isArray(answer) || answer.length === 0 : answer === undefined;
    })?.id || visibleQuestions().at(-1)?.id;
  }

  function intro() {
    state.stage = "intro";
    progressRegion.hidden = true;
    const draft = readDraft();
    const heading = personalizedName
      ? `${escapeHtml(personalizedName)}, ${escapeHtml(config.personalizedHeading || config.heading)}`
      : config.heading;
    setScreen(`
      <p class="eyebrow">${escapeHtml(config.eyebrow)}</p>
      <h1>${heading}</h1>
      <p class="lead">${config.introduction}</p>
      <div class="meta-row">${config.meta.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <div class="actions">
        ${draft ? '<button class="primary" type="button" data-action="resume">Continuar resposta</button><button class="secondary" type="button" data-action="restart">Começar novamente</button>' : '<button class="primary" type="button" data-action="start">Começar</button>'}
      </div>
    `);
  }

  function consent() {
    state.stage = "consent";
    progressRegion.hidden = true;
    setScreen(`
      <p class="eyebrow">Antes de começar</p>
      <h2>Sua participação é voluntária.</h2>
      <div class="consent-box">${config.consentText}</div>
      <div class="actions">
        <button class="primary" type="button" data-action="consent">Concordo e quero participar</button>
        <button class="secondary" type="button" data-action="decline">Agora não</button>
      </div>
    `);
  }

  function updateProgress(item) {
    const questions = visibleQuestions();
    const index = questions.findIndex(candidate => candidate.id === item.id);
    const percent = Math.max(1, Math.round(((index + 1) / questions.length) * 100));
    progressRegion.hidden = false;
    progressLabel.textContent = `${resolve(item.section, state.answers) || "Pesquisa"} · ${index + 1} de ${questions.length}`;
    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    progressTrack.setAttribute("aria-valuenow", String(percent));
  }

  function question(direction = "forward") {
    state.stage = "question";
    const item = questionById(state.currentId);
    if (!item || (item.when && !item.when(state.answers))) {
      state.currentId = firstUnansweredId();
      return question(direction);
    }
    updateProgress(item);
    const title = resolve(item.title, state.answers);
    const selectedValues = item.multiple
      ? (Array.isArray(state.answers[item.id]) ? state.answers[item.id] : [])
      : state.answers[item.id] === undefined ? [] : [state.answers[item.id]];
    const options = optionsFor(item).map(([value, label], index) => `
      <button class="option${selectedValues.includes(value) ? " selected" : ""}" type="button" style="--order:${index}" data-value="${escapeHtml(value)}" aria-pressed="${selectedValues.includes(value)}">
        <span class="option-key">${index + 1}</span>
        <span class="option-label">${escapeHtml(label)}</span>
        <span class="option-check" aria-hidden="true">✓</span>
      </button>
    `).join("");
    const selectionHelp = item.multiple
      ? item.maxSelections ? `Escolha até ${item.maxSelections}.` : "Você pode marcar mais de uma opção."
      : "Escolha uma opção.";
    setScreen(`
      <div class="question-nav"><button class="back-button" type="button" data-action="back" aria-label="Voltar à pergunta anterior">← Voltar</button></div>
      <p class="eyebrow">${escapeHtml(resolve(item.section, state.answers) || "Conte para a gente")}</p>
      <h2 id="question-title">${title}</h2>
      <p class="selection-help">${escapeHtml(selectionHelp)}</p>
      <div class="options" role="group" aria-labelledby="question-title">${options}</div>
      ${item.helper ? `<p class="helper">${resolve(item.helper, state.answers)}</p>` : ""}
      ${item.multiple ? `<div class="actions"><button class="primary" type="button" data-action="continue"${selectedValues.length ? "" : " disabled"}>Continuar</button></div>` : ""}
    `, direction);
  }

  function nextQuestionId() {
    const questions = visibleQuestions();
    const index = questions.findIndex(item => item.id === state.currentId);
    return questions[index + 1]?.id || null;
  }

  function previousQuestionId() {
    const questions = visibleQuestions();
    const index = questions.findIndex(item => item.id === state.currentId);
    return questions[index - 1]?.id || null;
  }

  function advance() {
    const nextId = nextQuestionId();
    if (nextId) {
      state.currentId = nextId;
      question();
    } else {
      review();
    }
  }

  async function transition(next, direction = "forward") {
    if (state.busy) return;
    state.busy = true;
    screen.classList.remove("entering", "entering-back");
    screen.classList.add(direction === "back" ? "leaving-back" : "leaving");
    await wait(220);
    next();
    state.busy = false;
  }

  async function choose(button) {
    if (state.busy) return;
    const item = questionById(state.currentId);
    const value = button.dataset.value;
    if (item.multiple) {
      const exclusive = new Set(item.exclusiveValues || []);
      const selected = new Set(Array.isArray(state.answers[item.id]) ? state.answers[item.id] : []);
      if (selected.has(value)) {
        selected.delete(value);
      } else if (exclusive.has(value)) {
        selected.clear();
        selected.add(value);
      } else {
        for (const exclusiveValue of exclusive) selected.delete(exclusiveValue);
        if (item.maxSelections && selected.size >= item.maxSelections) {
          status.textContent = `Você pode escolher até ${item.maxSelections} opções.`;
          return;
        }
        selected.add(value);
      }
      state.answers[item.id] = [...selected];
      pruneHiddenAnswers();
      saveDraft();
      screen.querySelectorAll(".option").forEach(option => {
        const isSelected = selected.has(option.dataset.value);
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });
      const continueButton = screen.querySelector("[data-action='continue']");
      if (continueButton) continueButton.disabled = selected.size === 0;
      status.textContent = selected.size === 1 ? "1 opção selecionada" : `${selected.size} opções selecionadas`;
      return;
    }
    state.answers[item.id] = value;
    pruneHiddenAnswers();
    saveDraft();
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    status.textContent = `Resposta selecionada: ${button.querySelector(".option-label").textContent}`;
    await wait(240);
    transition(advance);
  }

  function answerLabel(item, value) {
    const labels = new Map(optionsFor(item));
    if (Array.isArray(value)) return value.map(entry => labels.get(entry) || entry).join(", ");
    return labels.get(value) || String(value ?? "—");
  }

  function review() {
    state.stage = "review";
    progressRegion.hidden = true;
    const rows = visibleQuestions().filter(item => Object.hasOwn(state.answers, item.id)).map(item => `
      <div class="review-row">
        <div><span>${escapeHtml(resolve(item.title, state.answers).replace(/<[^>]+>/g, ""))}</span><strong>${escapeHtml(answerLabel(item, state.answers[item.id]))}</strong></div>
        <button type="button" class="edit-answer" data-action="edit" data-question-id="${item.id}">Editar</button>
      </div>
    `).join("");
    setScreen(`
      <div class="question-nav"><button class="back-button" type="button" data-action="back">← Voltar</button></div>
      <p class="eyebrow">Revisão</p>
      <h2>Confira suas respostas.</h2>
      <p class="lead">Você pode voltar e alterar qualquer resposta antes do envio.</p>
      <div class="review-list">${rows}</div>
      <div class="actions"><button class="primary" type="button" data-action="identify">Continuar</button></div>
    `);
  }

  function identify() {
    state.stage = "identify";
    progressRegion.hidden = true;
    const safeName = escapeHtml(personalizedName);
    setScreen(`
      <div class="question-nav"><button class="back-button" type="button" data-action="back">← Voltar</button></div>
      <p class="eyebrow">Última etapa</p>
      <h2>${personalizedName ? `Este convite foi preparado para ${safeName}.` : "Quer se identificar?"}</h2>
      <p class="lead">Nome e e-mail são opcionais. Eles serão usados somente para conversar sobre a pesquisa e um possível piloto.</p>
      <form class="identity-form" id="identity-form">
        <label for="respondent-name">Nome</label>
        <input id="respondent-name" name="name" type="text" maxlength="120" autocomplete="name" value="${safeName}" placeholder="Seu nome" />
        <label for="respondent-email">E-mail</label>
        <input id="respondent-email" name="email" type="email" maxlength="254" autocomplete="email" placeholder="voce@exemplo.com" />
        <p class="helper">Ao enviar com seus dados, você autoriza o Remus a entrar em contato sobre esta pesquisa.</p>
        <div class="actions">
          <button class="primary" type="submit">Enviar com meus dados</button>
          <button class="secondary" type="button" data-action="submit-anonymous">Enviar sem me identificar</button>
        </div>
      </form>
    `);
  }

  function submissionAnswers() {
    return {
      researchInstrument: config.instrumentId,
      instrumentRevision: config.revision,
      collectionMode: config.collectionMode,
      sourceCampaign: query.get("source")?.slice(0, 100) || config.defaultSource || "direct",
      sourceClub: query.get("club")?.slice(0, 120) || "",
      ...state.answers
    };
  }

  async function submit(respondent = null) {
    state.respondent = respondent;
    progressRegion.hidden = true;
    setScreen('<p class="eyebrow">Enviando</p><h2>Guardando suas respostas…</h2><p class="lead">Não feche esta tela até receber a confirmação.</p>');
    try {
      const response = await fetch(responseEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaireVersion: transportVersion,
          consent: state.consent,
          locale: document.documentElement.lang,
          contactConsent: Boolean(respondent),
          respondent,
          answers: submissionAnswers()
        })
      });
      if (!response.ok) throw new Error("SUBMISSION_FAILED");
      clearDraft();
      complete();
    } catch {
      failure();
    }
  }

  function complete() {
    state.stage = "complete";
    setScreen(`
      <div class="success-mark" aria-hidden="true">✓</div>
      <p class="eyebrow">Resposta recebida</p>
      <h2>Obrigado por remar com a gente.</h2>
      <p class="lead">A resposta foi registrada como <strong>${escapeHtml(config.displayName)}</strong>.</p>
      ${config.collectionMode === "club_intercept" ? '<div class="actions"><button class="primary" type="button" data-action="next-respondent">Preparar para a próxima pessoa</button></div>' : ""}
    `);
  }

  function failure() {
    state.stage = "failure";
    setScreen(`
      <p class="eyebrow error">Não foi possível enviar</p>
      <h2>Suas respostas continuam salvas neste aparelho.</h2>
      <p class="lead">Verifique a conexão e tente novamente antes de entregar o aparelho para outra pessoa.</p>
      <div class="actions"><button class="primary" type="button" data-action="retry">Tentar novamente</button></div>
    `);
  }

  function resetForNextRespondent() {
    clearDraft();
    state.currentId = null;
    state.answers = {};
    state.consent = false;
    state.respondent = null;
    intro();
  }

  function goBack() {
    if (state.stage === "question") {
      const previousId = previousQuestionId();
      if (previousId) {
        state.currentId = previousId;
        transition(() => question("back"), "back");
      } else {
        transition(consent, "back");
      }
    } else if (state.stage === "review") {
      state.currentId = visibleQuestions().at(-1)?.id;
      transition(() => question("back"), "back");
    } else if (state.stage === "identify") {
      transition(review, "back");
    }
  }

  screen.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "start") transition(consent);
    else if (action === "restart") { clearDraft(); state.answers = {}; state.consent = false; transition(consent); }
    else if (action === "resume") {
      const draft = readDraft();
      state.answers = draft?.answers || {};
      state.consent = true;
      state.currentId = firstUnansweredId();
      transition(question);
    } else if (action === "consent") {
      state.consent = true;
      state.currentId = visibleQuestions()[0].id;
      saveDraft();
      transition(question);
    } else if (action === "decline") {
      clearDraft();
      transition(() => setScreen('<p class="eyebrow">Tudo bem</p><h2>Obrigado pelo seu tempo.</h2><p class="lead">Nenhuma resposta foi enviada.</p>'));
    } else if (action === "back") goBack();
    else if (action === "continue") transition(advance);
    else if (action === "identify") transition(identify);
    else if (action === "edit") {
      state.currentId = button.dataset.questionId;
      transition(() => question("back"), "back");
    } else if (action === "retry") submit(state.respondent);
    else if (action === "submit-anonymous") submit(null);
    else if (action === "next-respondent") resetForNextRespondent();
    else if (button.classList.contains("option")) choose(button);
  });

  screen.addEventListener("submit", event => {
    if (event.target.id !== "identity-form") return;
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    if (!name && !email) return submit(null);
    submit({ name, email, source: config.collectionMode });
  });

  document.addEventListener("keydown", event => {
    if (event.target.matches("button, input, textarea, select")) return;
    const number = Number(event.key);
    if (number >= 1 && number <= 9) screen.querySelectorAll(".option")[number - 1]?.click();
  });

  document.querySelector(".text-size")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-font]");
    if (!button) return;
    document.documentElement.style.setProperty("--font-scale", button.dataset.font === "large" ? "1.16" : "1");
    document.querySelectorAll("button[data-font]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  });

  intro();
}
