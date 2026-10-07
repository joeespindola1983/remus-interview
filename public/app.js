const questionnaireVersion = "2026-10-07.v3";
const responseEndpoint = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "/api/responses"
  : "https://remus-app-recorder-backend.onrender.com/api/questionnaire/responses";
const personalizedName = new URLSearchParams(window.location.search).get("name")?.trim().slice(0, 120) || "";

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
    title: "Com qual modalidade você tem mais contato?",
    helper: "Escolha a modalidade que mais faz parte da sua rotina.",
    options: [
      ["rowing", "Remo"],
      ["vaa", "Va'a / canoa havaiana"],
      ["rowing_and_vaa", "Remo e Va'a"],
      ["other", "Outra modalidade"]
    ]
  },
  {
    id: "rowingDiscipline",
    title: "No Remo, qual tipo de palamenta faz mais parte da sua rotina?",
    helper: "Palamenta dupla é o sculling; palamenta simples é o sweep.",
    when: answers => ["rowing", "rowing_and_vaa"].includes(answers.sportDiscipline),
    options: [
      ["sculling", "Palamenta dupla"],
      ["sweep", "Palamenta simples"],
      ["sculling_and_sweep", "As duas"],
      ["not_sure", "Não tenho certeza"]
    ]
  },
  {
    id: "vaaTrainingContext",
    title: "No Va'a, você treina principalmente em qual contexto?",
    helper: "As classes informadas pelos praticantes serão preservadas sem converter V, OC e W entre si.",
    when: answers => ["vaa", "rowing_and_vaa"].includes(answers.sportDiscipline),
    options: [
      ["one_paddler", "Embarcação para um remador"],
      ["crew_craft", "Embarcação de equipe"],
      ["both", "Nos dois contextos"],
      ["not_sure", "Não tenho certeza"]
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
    id: "weeklyTrainingFrequency",
    title: answers => answers.participantRole === "coach"
      ? "Em uma semana comum, quantos treinos você orienta?"
      : "Em uma semana comum, quantas vezes você treina?",
    when: answers => ["athlete", "coach"].includes(answers.participantRole),
    options: [
      ["1_or_less", "1 vez ou menos"],
      ["2_to_3", "2 a 3 vezes"],
      ["4_to_5", "4 a 5 vezes"],
      ["6_or_more", "6 vezes ou mais"]
    ]
  },
  {
    id: "participationContext",
    title: "O que melhor descreve sua participação hoje?",
    options: [
      ["recreation", "Lazer e prática recreativa"],
      ["health_fitness", "Saúde e condicionamento"],
      ["amateur_competition", "Competição amadora"],
      ["high_performance", "Alto rendimento"],
      ["professional_role", "Atuação profissional no esporte"]
    ]
  },
  {
    id: "workoutRecordingFrequency",
    title: answers => {
      if (answers.participantRole === "coach") return "Nos treinos que você orienta, com que frequência algum dado é registrado?";
      if (["club_leader", "equipment_manager"].includes(answers.participantRole)) return "Nos treinos do clube ou da equipe, com que frequência algum dado é registrado?";
      return "Durante ou depois dos seus treinos, com que frequência você registra algum dado?";
    },
    helper: "Pode ser um registro automático, manual ou feito por outra pessoa.",
    options: [
      ["every_workout", "Em todo treino"],
      ["most_workouts", "Na maioria dos treinos"],
      ["some_workouts", "Somente em alguns treinos"],
      ["rarely", "Raramente"],
      ["never", "Nunca"]
    ]
  },
  {
    id: "noWorkoutRecordingReason",
    title: "Qual é o principal motivo para não registrar os treinos?",
    when: answers => answers.workoutRecordingFrequency === "never",
    options: [
      ["no_need", "Não sinto necessidade"],
      ["no_equipment", "Não tenho equipamento adequado"],
      ["too_complex", "É complicado ou dá trabalho"],
      ["too_expensive", "As opções são caras"],
      ["dont_know_how", "Não sei bem como fazer"],
      ["other", "Outro motivo"]
    ]
  },
  {
    id: "workoutRecordingTools",
    title: "O que é usado para registrar os treinos?",
    helper: "Você pode marcar mais de uma opção.",
    multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [
      ["speedcoach", "SpeedCoach"],
      ["mobile_phone", "Celular"],
      ["sports_watch", "Relógio esportivo"],
      ["rowerg_pm5", "RowErg com PM5"],
      ["other_dedicated_instrument", "Outro instrumento dedicado"],
      ["training_platform", "Aplicativo, planilha ou plataforma"],
      ["manual_notes", "Anotações manuais"],
      ["other", "Outro recurso"]
    ]
  },
  {
    id: "recordedWorkoutInformation",
    title: "Quais informações você costuma registrar ou consultar?",
    helper: "Marque todas as que fazem parte da sua rotina.",
    multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [
      ["elapsed_time", "Tempo"],
      ["distance", "Distância"],
      ["pace", "Parcial (tempo/500 m)"],
      ["stroke_rate", "Voga / cadência de remada"],
      ["heart_rate", "Frequência cardíaca"],
      ["route", "Percurso"],
      ["power", "Potência"],
      ["workout_notes", "Anotações sobre o treino"]
    ]
  },
  {
    id: "workoutReviewMoment",
    title: "Quando você costuma olhar para essas informações?",
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [
      ["during_workout", "Durante o treino"],
      ["immediately_after", "Logo depois do treino"],
      ["same_day", "Mais tarde, no mesmo dia"],
      ["before_next_workout", "Antes do próximo treino"],
      ["rarely_review", "Registro, mas raramente volto a consultar"]
    ]
  },
  {
    id: "workoutDataUse",
    title: "O que você normalmente faz com essas informações?",
    helper: "Marque as opções que realmente fazem parte da sua rotina.",
    multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [
      ["review_own_workout", "Reviso o meu próprio treino"],
      ["compare_workouts", "Comparo com outros treinos"],
      ["share_with_coach", "Compartilho com o treinador"],
      ["share_with_athlete_or_crew", "Compartilho com atleta, equipe ou guarnição"],
      ["plan_next_workout", "Uso para planejar o próximo treino"],
      ["archive_only", "Apenas guardo o registro"],
      ["rarely_use", "Raramente faço algo com os dados"]
    ]
  },
  {
    id: "workoutTrackingNeed",
    title: "Qual é a principal razão para você querer acompanhar um treino?",
    options: [
      ["track_progress", "Perceber evolução ao longo do tempo"],
      ["execute_training_plan", "Saber se o treino planejado foi realizado"],
      ["compare_workouts", "Comparar treinos"],
      ["review_technique", "Apoiar a revisão da técnica"],
      ["review_crew", "Entender o desempenho da equipe ou guarnição"],
      ["prepare_competition", "Preparar-se para testes ou competições"],
      ["support_coaching", "Dar suporte ao trabalho do treinador"],
      ["no_clear_need", "Não sinto uma necessidade clara"]
    ]
  },
  {
    id: "currentTrackingGap",
    title: "O que mais falta na forma como você acompanha os treinos hoje?",
    options: [
      ["easier_recording", "Registrar com menos esforço"],
      ["unified_information", "Reunir as informações em um só lugar"],
      ["trustworthy_data", "Confiar mais nos dados"],
      ["clear_interpretation", "Entender melhor o que os dados significam"],
      ["workout_comparison", "Comparar treinos com facilidade"],
      ["technique_context", "Relacionar dados e técnica"],
      ["sharing", "Compartilhar com facilidade"],
      ["nothing_missing", "Nada importante"]
    ]
  },
  {
    id: "mostUsefulOutcome",
    title: "Qual resultado do Remus seria mais útil para você?",
    options: [
      ["clear_workout_summary", "Resumo claro de cada treino"],
      ["progress_over_time", "Evolução ao longo do tempo"],
      ["technique_review", "Revisão da técnica apoiada por dados"],
      ["training_plan_comparison", "Comparação entre treino planejado e realizado"],
      ["crew_review", "Revisão da equipe ou guarnição"],
      ["conditions_equipment_context", "Relação com condições e equipamento"],
      ["research_evidence", "Evidências rastreáveis para pesquisa"]
    ]
  },
  {
    id: "desiredTiming",
    title: "Quando essa informação teria mais valor para você?",
    options: [
      ["during_workout", "Durante o treino"],
      ["immediately_after", "Logo depois do treino"],
      ["same_day", "Mais tarde, no mesmo dia"],
      ["before_next_workout", "Antes do próximo treino"],
      ["periodic_review", "Em uma revisão periódica"]
    ]
  },
  {
    id: "primaryBarrier",
    title: "O que mais poderia impedir você de usar o Remus?",
    options: [
      ["complex_setup", "Instalação ou preparação complicada"],
      ["hard_to_understand", "Resultados difíceis de entender"],
      ["lack_of_trust", "Falta de confiança nos resultados"],
      ["battery", "Autonomia insuficiente"],
      ["water_resistance", "Resistência inadequada à água"],
      ["compatibility", "Incompatibilidade com meu equipamento"],
      ["price", "Preço"]
    ]
  },
  {
    id: "likelyBuyer",
    title: "Quem provavelmente decidiria pela compra de uma solução como o Remus?",
    options: [
      ["athlete", "O próprio atleta"],
      ["coach", "Treinador(a)"],
      ["club", "Clube ou equipe"],
      ["equipment_manager", "Responsável pelos equipamentos"],
      ["sponsor", "Patrocinador"],
      ["unknown", "Ainda não sei"]
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
    title: "Se houvesse uma mensalidade, qual faixa pareceria razoável?",
    helper: "Considere uma solução que entregue o resultado escolhido por você.",
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

const state = { index: -1, answers: {}, consent: false, busy: false, respondent: null };
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

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  })[character]);
}

function intro() {
  progressRegion.hidden = true;
  setScreen(`
    <p class="eyebrow">Pesquisa inicial · 7 a 10 minutos</p>
    <h1>${personalizedName ? `${escapeHtml(personalizedName)}, ajude a construir o próximo Remus.` : "Ajude a construir o próximo Remus."}</h1>
    <p class="lead">Queremos entender como atletas, treinadores e clubes acompanham treinos hoje — e quais problemas realmente merecem uma solução.</p>
    <div class="meta-row"><span>Percurso personalizado</span><span>Respostas objetivas</span><span>Sem cadastro</span></div>
    <div class="actions"><button class="primary" type="button" data-action="start">Começar</button></div>
  `);
}

function consent() {
  setScreen(`
    <p class="eyebrow">Antes de começar</p>
    <h2>Sua participação é voluntária.</h2>
    <div class="consent-box">As respostas serão usadas para pesquisa de mercado e decisões sobre produto, preço, posicionamento e aquisição do Remus. No final, você poderá informar nome e e-mail opcionalmente para receber um contato sobre a pesquisa. Você pode responder sem se identificar e parar a qualquer momento antes do envio. As respostas serão armazenadas por até 30 dias após o encerramento desta pesquisa.</div>
    <div class="actions">
      <button class="primary" type="button" data-action="consent">Concordo e quero participar</button>
      <button class="secondary" type="button" data-action="decline">Agora não</button>
    </div>
  `);
}

function updateProgress() {
  const percent = Math.round(((state.index + 1) / questions.length) * 100);
  progressRegion.hidden = false;
  progressLabel.textContent = "Progresso da pesquisa";
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(percent));
}

function question() {
  updateProgress();
  const item = questions[state.index];
  const title = typeof item.title === "function" ? item.title(state.answers) : item.title;
  const selectedValues = item.multiple ? (state.answers[item.id] || []) : [];
  const options = item.options.map(([value, label], index) => `
    <button class="option${selectedValues.includes(value) ? " selected" : ""}" type="button" style="--order:${index}" data-value="${value}" aria-pressed="${selectedValues.includes(value)}">
      <span class="option-key">${index + 1}</span>
      <span class="option-label">${label}</span>
      <span class="option-check" aria-hidden="true">✓</span>
    </button>
  `).join("");
  setScreen(`
    <p class="eyebrow">Conte para a gente</p>
    <h2 id="question-title">${title}</h2>
    <div class="options" role="group" aria-labelledby="question-title">${options}</div>
    ${item.helper ? `<p class="helper">${item.helper}</p>` : ""}
    ${item.multiple ? `<div class="actions"><button class="primary" type="button" data-action="continue"${selectedValues.length ? "" : " disabled"}>Continuar</button></div>` : ""}
  `);
}

function advanceToNextQuestion() {
  state.index += 1;
  while (state.index < questions.length) {
    const candidate = questions[state.index];
    if (!candidate.when || candidate.when(state.answers)) break;
    state.index += 1;
  }
  if (state.index < questions.length) question();
  else identify();
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
  if (item.multiple) {
    const selected = new Set(state.answers[item.id] || []);
    if (selected.has(button.dataset.value)) selected.delete(button.dataset.value);
    else selected.add(button.dataset.value);
    state.answers[item.id] = [...selected];
    button.classList.toggle("selected", selected.has(button.dataset.value));
    button.setAttribute("aria-pressed", String(selected.has(button.dataset.value)));
    const continueButton = screen.querySelector("[data-action='continue']");
    continueButton.disabled = selected.size === 0;
    status.textContent = selected.size === 1 ? "1 opção selecionada" : `${selected.size} opções selecionadas`;
    return;
  }
  state.answers[item.id] = button.dataset.value;
  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");
  status.textContent = `Resposta selecionada: ${button.querySelector(".option-label").textContent}`;
  await new Promise(resolve => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 5 : 380));
  transition(() => {
    advanceToNextQuestion();
  });
}

function identify() {
  progressRegion.hidden = true;
  const safeName = escapeHtml(personalizedName);
  setScreen(`
    <p class="eyebrow">Última etapa</p>
    <h2>${personalizedName ? `Este convite foi preparado para ${safeName}.` : "Quer se identificar?"}</h2>
    <p class="lead">Nome e e-mail são opcionais. Se você informar algum deles, usaremos esses dados somente para conversar sobre esta pesquisa e um possível piloto.</p>
    <form class="identity-form" id="identity-form">
      <label for="respondent-name">Nome</label>
      <input id="respondent-name" name="name" type="text" maxlength="120" autocomplete="name" value="${safeName}" placeholder="Seu nome" />
      <label for="respondent-email">E-mail</label>
      <input id="respondent-email" name="email" type="email" maxlength="254" autocomplete="email" placeholder="voce@exemplo.com" />
      <p class="helper">Ao enviar com seus dados, você autoriza o Remus a entrar em contato sobre esta pesquisa. Seu e-mail nunca é colocado no link.</p>
      <div class="actions">
        <button class="primary" type="submit">Enviar com meus dados</button>
        <button class="secondary" type="button" data-action="submit-anonymous">Enviar sem me identificar</button>
      </div>
    </form>
  `);
}

async function submit(respondent = null) {
  state.respondent = respondent;
  progressRegion.hidden = true;
  setScreen(`<p class="eyebrow">Enviando</p><h2>Guardando suas respostas…</h2><p class="lead">Isso deve levar apenas alguns segundos.</p>`);
  try {
    const response = await fetch(responseEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionnaireVersion,
        consent: state.consent,
        locale: document.documentElement.lang,
        contactConsent: Boolean(respondent),
        respondent,
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
  } else if (button.dataset.action === "retry") submit(state.respondent);
  else if (button.dataset.action === "submit-anonymous") submit(null);
  else if (button.dataset.action === "continue") transition(advanceToNextQuestion);
  else if (button.classList.contains("option")) choose(button);
});

screen.addEventListener("submit", event => {
  if (event.target.id !== "identity-form") return;
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  if (!name && !email) {
    submit(null);
    return;
  }
  submit({
    name,
    email,
    source: personalizedName ? "personalized_link" : "questionnaire_form"
  });
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
