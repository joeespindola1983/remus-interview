const questionnaireVersion = "2026-10-07.v1";

const questions = [
  {
    id: "participantRole",
    title: "Qual é a sua relação principal com o esporte?",
    helper: "Escolha a opção que mais representa você hoje.",
    options: [
      ["athlete", "Atleta ou praticante"],
      ["coach", "Treinador(a)"],
      ["club_leader", "Gestor(a) de clube ou equipe"],
      ["equipment_manager", "Responsável por equipamentos"],
      ["other", "Outra relação"]
    ]
  },
  {
    id: "sportDiscipline",
    title: "Em qual modalidade você atua com mais frequência?",
    helper: "Mantemos Remo e Va'a separados para entender necessidades diferentes.",
    options: [
      ["rowing", "Remo na água"],
      ["vaa", "Va'a / canoa havaiana"],
      ["indoor_rowing", "Remo indoor / ergômetro"],
      ["multiple", "Atuo em mais de uma modalidade"],
      ["other", "Outra modalidade"]
    ]
  },
  {
    id: "experienceLevel",
    title: "Há quanto tempo você pratica ou trabalha com a modalidade?",
    options: [
      ["less_than_1_year", "Menos de 1 ano"],
      ["1_to_3_years", "De 1 a 3 anos"],
      ["4_to_7_years", "De 4 a 7 anos"],
      ["8_years_or_more", "8 anos ou mais"]
    ]
  },
  {
    id: "weeklyFrequency",
    title: "Em uma semana comum, quantas sessões você acompanha ou realiza?",
    options: [
      ["1_or_less", "1 ou menos"],
      ["2_to_3", "2 a 3"],
      ["4_to_5", "4 a 5"],
      ["6_or_more", "6 ou mais"]
    ]
  },
  {
    id: "currentTracking",
    title: "Como você acompanha a evolução dos treinos hoje?",
    helper: "Escolha o método principal.",
    options: [
      ["memory_notes", "Memória, conversa ou anotações"],
      ["watch_app", "Relógio ou aplicativo esportivo"],
      ["boat_instrument", "Instrumento no barco"],
      ["ergometer", "Dados do ergômetro"],
      ["spreadsheet_platform", "Planilha ou plataforma de treino"],
      ["not_tracking", "Não acompanho de forma estruturada"]
    ]
  },
  {
    id: "primaryChallenge",
    title: "Qual é a maior dificuldade depois de uma sessão?",
    options: [
      ["understand_performance", "Entender o que realmente aconteceu"],
      ["compare_sessions", "Comparar sessões e perceber evolução"],
      ["connect_context", "Relacionar dados, contexto e condições"],
      ["share_feedback", "Compartilhar feedback com atleta ou equipe"],
      ["trust_data", "Confiar na qualidade dos dados"],
      ["no_major_challenge", "Não tenho uma dificuldade relevante"]
    ]
  },
  {
    id: "mostUsefulOutcome",
    title: "Qual resultado do Remus seria mais útil para você?",
    options: [
      ["clear_session_summary", "Resumo claro de cada sessão"],
      ["progress_over_time", "Evolução ao longo do tempo"],
      ["technique_review", "Revisão de técnica com evidências"],
      ["training_plan_comparison", "Comparação entre treino planejado e realizado"],
      ["crew_equipment_context", "Contexto de guarnição e equipamento"],
      ["research_quality_data", "Dados confiáveis para pesquisa"]
    ]
  },
  {
    id: "purchaseIntent",
    title: "Se isso resolvesse sua principal dificuldade, você consideraria pagar?",
    options: [
      ["definitely", "Sim, com certeza"],
      ["probably", "Provavelmente sim"],
      ["depends", "Dependeria do preço e da comprovação"],
      ["probably_not", "Provavelmente não"],
      ["no", "Não"]
    ]
  },
  {
    id: "monthlyPrice",
    title: "Qual faixa mensal pareceria razoável para começar?",
    helper: "Considere uma solução que entregue o resultado escolhido anteriormente.",
    options: [
      ["free_only", "Usaria somente uma versão gratuita"],
      ["brl_20_to_49", "R$ 20 a R$ 49"],
      ["brl_50_to_99", "R$ 50 a R$ 99"],
      ["brl_100_to_199", "R$ 100 a R$ 199"],
      ["brl_200_or_more", "R$ 200 ou mais"],
      ["organization_pays", "Esperaria que clube ou equipe pagasse"]
    ]
  },
  {
    id: "pilotInterest",
    title: "Você toparia testar um protótipo do Remus e conversar por 20 minutos?",
    options: [
      ["yes", "Sim, quero participar"],
      ["maybe", "Talvez, preciso saber mais"],
      ["questionnaire_only", "Prefiro responder somente este questionário"]
    ]
  }
];

const state = { index: -1, answers: {}, consent: false, busy: false };
const screen = document.querySelector("#screen");
const status = document.querySelector("#status");
const progressRegion = document.querySelector("#progress-region");
const progressLabel = document.querySelector("#progress-label");
const progressPercent = document.querySelector("#progress-percent");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector("[role='progressbar']");

function setScreen(content) {
  screen.className = "screen entering";
  screen.innerHTML = content;
  requestAnimationFrame(() => screen.querySelector("button")?.focus({ preventScroll: true }));
}

function intro() {
  progressRegion.hidden = true;
  setScreen(`
    <p class="eyebrow">Pesquisa inicial · 4 minutos</p>
    <h1>Ajude a construir o próximo Remus.</h1>
    <p class="lead">Queremos entender como atletas, treinadores e clubes acompanham treinos hoje — e quais problemas realmente merecem uma solução.</p>
    <div class="meta-row"><span>10 perguntas</span><span>Respostas objetivas</span><span>Sem cadastro</span></div>
    <div class="actions"><button class="primary" type="button" data-action="start">Começar</button></div>
  `);
}

function consent() {
  setScreen(`
    <p class="eyebrow">Antes de começar</p>
    <h2>Sua participação é voluntária.</h2>
    <div class="consent-box">As respostas serão usadas para pesquisa de mercado e decisões sobre produto, preço, posicionamento e aquisição do Remus. Não pedimos dados sensíveis neste questionário. Você pode parar a qualquer momento antes do envio. As respostas serão armazenadas por até 30 dias após o encerramento desta pesquisa.</div>
    <div class="actions">
      <button class="primary" type="button" data-action="consent">Concordo e quero participar</button>
      <button class="secondary" type="button" data-action="decline">Agora não</button>
    </div>
  `);
}

function updateProgress() {
  const current = state.index + 1;
  const percent = Math.round((current / questions.length) * 100);
  progressRegion.hidden = false;
  progressLabel.textContent = `Pergunta ${current} de ${questions.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(percent));
}

function question() {
  updateProgress();
  const item = questions[state.index];
  const options = item.options.map(([value, label], index) => `
    <button class="option" type="button" style="--order:${index}" data-value="${value}" aria-pressed="false">
      <span class="option-key">${index + 1}</span>
      <span class="option-label">${label}</span>
      <span class="option-check" aria-hidden="true">✓</span>
    </button>
  `).join("");
  setScreen(`
    <p class="eyebrow">Conte para a gente</p>
    <h2 id="question-title">${item.title}</h2>
    <div class="options" role="group" aria-labelledby="question-title">${options}</div>
    ${item.helper ? `<p class="helper">${item.helper}</p>` : ""}
  `);
}

async function transition(next) {
  if (state.busy) return;
  state.busy = true;
  screen.classList.remove("entering");
  screen.classList.add("leaving");
  await new Promise(resolve => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 5 : 330));
  next();
  state.busy = false;
}

async function choose(button) {
  if (state.busy) return;
  const item = questions[state.index];
  state.answers[item.id] = button.dataset.value;
  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");
  status.textContent = `Resposta selecionada: ${button.querySelector(".option-label").textContent}`;
  await new Promise(resolve => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 5 : 380));
  transition(() => {
    state.index += 1;
    if (state.index < questions.length) question();
    else submit();
  });
}

async function submit() {
  progressRegion.hidden = true;
  setScreen(`<p class="eyebrow">Enviando</p><h2>Guardando suas respostas…</h2><p class="lead">Isso deve levar apenas alguns segundos.</p>`);
  try {
    const response = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionnaireVersion,
        consent: state.consent,
        locale: document.documentElement.lang,
        answers: state.answers
      })
    });
    if (!response.ok) throw new Error("SUBMISSION_FAILED");
    complete();
  } catch {
    failure();
  }
}

function complete() {
  setScreen(`
    <div class="success-mark" aria-hidden="true">✓</div>
    <p class="eyebrow">Resposta recebida</p>
    <h2>Obrigado por remar com a gente.</h2>
    <p class="lead">Sua experiência vai ajudar a decidir o que o Remus deve construir primeiro. Se você indicou interesse no piloto, o convite será organizado em uma etapa separada.</p>
  `);
}

function failure() {
  setScreen(`
    <p class="eyebrow error">Não foi possível enviar</p>
    <h2>Suas respostas ainda estão nesta tela.</h2>
    <p class="lead">Verifique sua conexão e tente novamente. Nada foi marcado como recebido.</p>
    <div class="actions"><button class="primary" type="button" data-action="retry">Tentar novamente</button></div>
  `);
}

screen.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action === "start") transition(consent);
  else if (button.dataset.action === "consent") {
    state.consent = true;
    state.index = 0;
    transition(question);
  } else if (button.dataset.action === "decline") {
    transition(() => setScreen(`<p class="eyebrow">Tudo bem</p><h2>Obrigado pelo seu tempo.</h2><p class="lead">Nenhuma resposta foi enviada.</p>`));
  } else if (button.dataset.action === "retry") submit();
  else if (button.classList.contains("option")) choose(button);
});

document.addEventListener("keydown", event => {
  if (event.target.matches("button, input, textarea, select")) return;
  const number = Number(event.key);
  if (number >= 1 && number <= 9) screen.querySelectorAll(".option")[number - 1]?.click();
});

document.querySelector(".text-size").addEventListener("click", event => {
  const button = event.target.closest("button[data-font]");
  if (!button) return;
  document.documentElement.style.setProperty("--font-scale", button.dataset.font === "large" ? "1.16" : "1");
  document.querySelectorAll("button[data-font]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
});

intro();
