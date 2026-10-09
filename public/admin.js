const endpoint = "https://remus-app-recorder-backend.onrender.com/api/questionnaire/responses";

const fieldLabels = {
  researchInstrument: "Instrumento de pesquisa",
  instrumentRevision: "Revisão do instrumento",
  collectionMode: "Modo de coleta",
  sourceCampaign: "Origem da coleta",
  sourceClub: "Clube informado",
  participantRoles: "Relações com o esporte",
  primaryParticipantRole: "Relação principal",
  participantRole: "Relação com o esporte",
  sportDisciplines: "Modalidades",
  primarySportDiscipline: "Modalidade principal",
  sportDiscipline: "Modalidade",
  rowingDisciplines: "Tipos de palamenta",
  rowingDiscipline: "Tipo de palamenta",
  rowingBoatClasses: "Classes de barco no Remo",
  vaaBoatClasses: "Classes no Va'a",
  vaaTrainingContexts: "Contextos no Va'a",
  vaaTrainingContext: "Contexto no Va'a",
  experienceLevel: "Tempo na modalidade",
  athleteWeeklyTrainingFrequency: "Treinos realizados por semana",
  coachWeeklyTrainingFrequency: "Treinos orientados por semana",
  weeklyTrainingFrequency: "Treinos por semana",
  participationContexts: "Contextos de participação",
  participationContext: "Contexto de participação",
  workoutRecordingFrequency: "Frequência de registro",
  noWorkoutRecordingReason: "Motivo para não registrar",
  workoutRecordingTools: "Ferramentas utilizadas",
  recordedWorkoutInformation: "Informações consultadas",
  workoutReviewMoment: "Momento de consulta",
  workoutDataUse: "Uso das informações",
  workoutTrackingNeed: "Principal necessidade",
  currentTrackingGap: "Principal lacuna",
  mostUsefulOutcome: "Resultado mais útil",
  desiredTiming: "Momento de maior valor",
  primaryBarrier: "Barreira de adoção",
  likelyBuyer: "Provável comprador",
  purchaseIntent: "Intenção de pagamento",
  monthlyPrice: "Faixa mensal",
  pilotInterest: "Interesse no piloto"
};

const valueLabels = {
  initial_market_questionnaire: "Pesquisa inicial",
  club_detailed_questionnaire: "Pesquisa detalhada no clube",
  remote_self_service: "Resposta remota",
  club_intercept: "Coleta presencial no clube",
  athlete: "Atleta ou praticante", coach: "Treinador(a)", club_leader: "Gestor(a) de clube ou equipe", equipment_manager: "Responsável por equipamentos",
  rowing: "Remo", vaa: "Va'a / canoa havaiana", rowing_and_vaa: "Remo e Va'a", other: "Outro",
  sculling: "Palamenta dupla", sweep: "Palamenta simples", sculling_and_sweep: "Palamenta dupla e simples", not_sure: "Não tem certeza",
  one_paddler: "Embarcação para um remador", crew_craft: "Embarcação de equipe", both: "Ambos",
  less_than_1_year: "Menos de 1 ano", "1_to_3_years": "1 a 3 anos", "4_to_7_years": "4 a 7 anos", "8_years_or_more": "8 anos ou mais",
  "1_or_less": "1 vez ou menos", "2_to_3": "2 a 3 vezes", "4_to_5": "4 a 5 vezes", "6_or_more": "6 vezes ou mais",
  recreation: "Lazer e prática recreativa", health_fitness: "Saúde e condicionamento", amateur_competition: "Competição amadora", high_performance: "Alto rendimento", professional_role: "Atuação profissional",
  every_workout: "Em todo treino", most_workouts: "Na maioria dos treinos", some_workouts: "Em alguns treinos", rarely: "Raramente", never: "Nunca",
  no_need: "Não sente necessidade", no_equipment: "Não tem equipamento adequado", too_complex: "Complicado ou trabalhoso", too_expensive: "Opções caras", dont_know_how: "Não sabe como fazer",
  speedcoach: "SpeedCoach", mobile_phone: "Celular", sports_watch: "Relógio esportivo", rowerg_pm5: "RowErg com PM5", other_dedicated_instrument: "Outro instrumento dedicado", training_platform: "Aplicativo, planilha ou plataforma", manual_notes: "Anotações manuais",
  elapsed_time: "Tempo", distance: "Distância", pace: "Parcial (tempo/500 m)", stroke_rate: "Voga / cadência de remada", heart_rate: "Frequência cardíaca", route: "Percurso", power: "Potência", workout_notes: "Anotações sobre o treino",
  during_workout: "Durante o treino", immediately_after: "Logo depois", same_day: "No mesmo dia", before_next_workout: "Antes do próximo treino", rarely_review: "Raramente consulta",
  review_own_workout: "Revisa o próprio treino", compare_workouts: "Compara treinos", share_with_coach: "Compartilha com treinador", share_with_athlete_or_crew: "Compartilha com atleta/equipe", plan_next_workout: "Planeja o próximo treino", archive_only: "Apenas guarda", rarely_use: "Raramente usa",
  track_progress: "Perceber evolução", execute_training_plan: "Verificar o treino planejado", review_technique: "Apoiar revisão da técnica", review_crew: "Entender equipe/guarnição", prepare_competition: "Preparar testes/competições", support_coaching: "Apoiar o treinador", no_clear_need: "Sem necessidade clara",
  easier_recording: "Registrar com menos esforço", unified_information: "Reunir informações", trustworthy_data: "Confiar nos dados", clear_interpretation: "Entender os dados", workout_comparison: "Comparar treinos", technique_context: "Relacionar dados e técnica", sharing: "Compartilhar", nothing_missing: "Nada importante",
  clear_workout_summary: "Resumo do treino", progress_over_time: "Evolução no tempo", technique_review: "Revisão da técnica", training_plan_comparison: "Planejado × realizado", crew_review: "Revisão da equipe", conditions_equipment_context: "Condições e equipamento", research_evidence: "Evidências para pesquisa",
  periodic_review: "Revisão periódica", complex_setup: "Preparação complicada", hard_to_understand: "Resultados difíceis", lack_of_trust: "Falta de confiança", battery: "Autonomia", water_resistance: "Resistência à água", compatibility: "Compatibilidade", price: "Preço",
  self: "O próprio atleta", club: "Clube ou equipe", sponsor: "Patrocinador", unknown: "Não sabe",
  definitely: "Sim, com certeza", probably: "Provavelmente sim", depends: "Depende do preço/comprovação", probably_not: "Provavelmente não", no: "Não",
  free_only: "Somente gratuito", brl_20_to_49: "R$ 20–49", brl_50_to_99: "R$ 50–99", brl_100_to_199: "R$ 100–199", brl_200_or_more: "R$ 200 ou mais", organization_pays: "Clube/equipe pagaria",
  yes: "Sim", maybe: "Talvez", questionnaire_only: "Somente questionário"
};

const instrumentLabels = {
  initial_market_questionnaire: "Pesquisa inicial",
  club_detailed_questionnaire: "Pesquisa detalhada no clube",
  legacy_initial_questionnaire: "Pesquisa inicial anterior"
};

let allResponses = [];
let currentToken = "";

const login = document.querySelector("#login");
const dashboard = document.querySelector("#dashboard");
const loginError = document.querySelector("#login-error");
const responsesElement = document.querySelector("#responses");
const emptyElement = document.querySelector("#empty");

function text(value) {
  if (Array.isArray(value)) return value.map(item => valueLabels[item] || item).join(", ");
  return valueLabels[value] || String(value ?? "—");
}

function instrumentFor(item) {
  return item.answers?.researchInstrument || "legacy_initial_questionnaire";
}

function valuesFor(item, pluralField, legacyField) {
  const value = item.answers?.[pluralField] ?? item.answers?.[legacyField];
  return Array.isArray(value) ? value : value ? [value] : [];
}

function date(value) {
  if (!value) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

async function loadResponses(token) {
  loginError.hidden = true;
  const response = await fetch(endpoint, { headers: { "X-Admin-Token": token } });
  if (response.status === 401) throw new Error("Token incorreto ou ainda não configurado no backend.");
  if (!response.ok) throw new Error(`Não foi possível carregar as respostas (${response.status}).`);
  allResponses = await response.json();
  currentToken = token;
  sessionStorage.setItem("remusQuestionnaireToken", token);
  login.hidden = true;
  dashboard.hidden = false;
  document.querySelector("#updated-at").textContent = `Atualizado em ${date(new Date().toISOString())}`;
  populateFilters();
  render();
}

function populateFilters() {
  const instrument = document.querySelector("#instrument");
  const discipline = document.querySelector("#discipline");
  const role = document.querySelector("#role");
  const instruments = [...new Set(allResponses.map(instrumentFor))];
  const disciplines = [...new Set(allResponses.flatMap(item => valuesFor(item, "sportDisciplines", "sportDiscipline")))];
  const roles = [...new Set(allResponses.flatMap(item => valuesFor(item, "participantRoles", "participantRole")))];
  instrument.replaceChildren(new Option("Todos", ""), ...instruments.map(value => new Option(instrumentLabels[value] || value, value)));
  discipline.replaceChildren(new Option("Todas", ""), ...disciplines.map(value => new Option(text(value), value)));
  role.replaceChildren(new Option("Todos", ""), ...roles.map(value => new Option(text(value), value)));
}

function filteredResponses() {
  const query = document.querySelector("#search").value.trim().toLocaleLowerCase("pt-BR");
  const instrument = document.querySelector("#instrument").value;
  const discipline = document.querySelector("#discipline").value;
  const role = document.querySelector("#role").value;
  return allResponses.filter(item => {
    const searchable = JSON.stringify(item).toLocaleLowerCase("pt-BR");
    return (!query || searchable.includes(query))
      && (!instrument || instrumentFor(item) === instrument)
      && (!discipline || valuesFor(item, "sportDisciplines", "sportDiscipline").includes(discipline))
      && (!role || valuesFor(item, "participantRoles", "participantRole").includes(role));
  });
}

function render() {
  const visible = filteredResponses();
  renderSummary();
  document.querySelector("#result-count").textContent = `${visible.length} de ${allResponses.length} respostas`;
  responsesElement.replaceChildren(...visible.map(responseCard));
  emptyElement.hidden = visible.length !== 0;
}

function renderSummary() {
  const identified = allResponses.filter(item => item.respondent?.name || item.respondent?.email).length;
  const rowing = allResponses.filter(item => valuesFor(item, "sportDisciplines", "sportDiscipline").some(value => ["rowing", "rowing_and_vaa"].includes(value))).length;
  const vaa = allResponses.filter(item => valuesFor(item, "sportDisciplines", "sportDiscipline").some(value => ["vaa", "rowing_and_vaa"].includes(value))).length;
  const values = [[allResponses.length, "Total"], [identified, "Identificadas"], [rowing, "Remo"], [vaa, "Va'a"]];
  document.querySelector("#summary").replaceChildren(...values.map(([number, label]) => {
    const card = document.createElement("div"); card.className = "summary-card";
    const strong = document.createElement("strong"); strong.textContent = number;
    const span = document.createElement("span"); span.textContent = label;
    card.append(strong, span); return card;
  }));
}

function responseCard(item, index) {
  const article = document.createElement("article"); article.className = "response-card";
  const summary = document.createElement("button"); summary.type = "button"; summary.className = "response-summary"; summary.setAttribute("aria-expanded", "false");
  const respondent = document.createElement("span"); respondent.className = "respondent";
  const name = document.createElement("strong"); name.textContent = item.respondent?.name || `Resposta ${allResponses.length - index}`;
  const email = document.createElement("span"); email.textContent = item.respondent?.email || "Resposta anônima";
  respondent.append(name, email);
  const tags = document.createElement("span"); tags.className = "tags";
  [instrumentLabels[instrumentFor(item)], ...valuesFor(item, "participantRoles", "participantRole"), ...valuesFor(item, "sportDisciplines", "sportDiscipline")].filter(Boolean).forEach(value => { const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = text(value); tags.append(tag); });
  const received = document.createElement("span"); received.className = "response-date"; received.textContent = date(item.receivedAt);
  summary.append(respondent, tags, received);

  const detail = document.createElement("div"); detail.className = "response-detail"; detail.hidden = true;
  const list = document.createElement("dl"); list.className = "answer-grid";
  Object.entries(item.answers || {}).forEach(([key, value]) => { const dt = document.createElement("dt"); dt.textContent = fieldLabels[key] || key; const dd = document.createElement("dd"); dd.textContent = text(value); list.append(dt, dd); });
  detail.append(list);
  summary.addEventListener("click", () => { detail.hidden = !detail.hidden; summary.setAttribute("aria-expanded", String(!detail.hidden)); });
  article.append(summary, detail); return article;
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

function csv() {
  const fields = [...new Set(allResponses.flatMap(item => Object.keys(item.answers || {})))];
  const answerFields = fields.filter(field => !["researchInstrument", "instrumentRevision"].includes(field));
  const header = ["responseId", "receivedAt", "researchInstrument", "instrumentRevision", "name", "email", ...answerFields];
  const escape = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = allResponses.map(item => [item.responseId, item.receivedAt, instrumentFor(item), item.answers?.instrumentRevision || item.questionnaireVersion, item.respondent?.name, item.respondent?.email, ...answerFields.map(field => text(item.answers?.[field]))]);
  return [header, ...rows].map(row => row.map(escape).join(",")).join("\n");
}

document.querySelector("#login-form").addEventListener("submit", async event => {
  event.preventDefault();
  try { await loadResponses(document.querySelector("#token").value); }
  catch (error) { loginError.textContent = error.message; loginError.hidden = false; }
});
document.querySelectorAll("#search, #instrument, #discipline, #role").forEach(control => control.addEventListener("input", render));
document.querySelector("#export-json").addEventListener("click", () => download("remus-questionnaire-responses.json", JSON.stringify(allResponses, null, 2), "application/json"));
document.querySelector("#export-csv").addEventListener("click", () => download("remus-questionnaire-responses.csv", csv(), "text/csv;charset=utf-8"));
document.querySelector("#logout").addEventListener("click", () => { sessionStorage.removeItem("remusQuestionnaireToken"); location.reload(); });

const hashToken = new URLSearchParams(location.hash.slice(1)).get("token");
if (hashToken) history.replaceState(null, "", location.pathname);
const savedToken = hashToken || sessionStorage.getItem("remusQuestionnaireToken");
if (savedToken) loadResponses(savedToken).catch(error => { loginError.textContent = error.message; loginError.hidden = false; });
