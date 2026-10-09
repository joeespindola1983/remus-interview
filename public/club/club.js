import { mountQuestionnaire } from "../questionnaire-engine.js";

const has = (answers, field, value) => Array.isArray(answers[field]) && answers[field].includes(value);
const selectedOptions = (answers, field, catalog) => (answers[field] || []).map(value => [value, catalog[value] || value]);

const roleLabels = {
  athlete: "Atleta ou praticante", coach: "Treinador(a)", club_leader: "Gestor(a) de clube ou equipe",
  equipment_manager: "Responsável por equipamentos", other: "Outra relação"
};
const disciplineLabels = { rowing: "Remo", vaa: "Va'a / canoa havaiana", indoor_rowing: "Remo indoor", other: "Outra modalidade" };
const outcomeLabels = {
  clear_workout_summary: "Resumo claro de cada treino", progress_over_time: "Evolução ao longo do tempo",
  training_plan_comparison: "Comparação entre treino planejado e realizado", technique_review: "Revisão técnica apoiada por dados",
  crew_review: "Revisão da equipe ou guarnição", conditions_equipment_context: "Relação com condições e equipamento",
  easier_sharing: "Compartilhamento mais fácil", trustworthy_record: "Registro confiável do que aconteceu"
};
const timingLabels = {
  during_workout: "Durante o treino", immediately_after: "Logo depois do treino", same_day: "Mais tarde, no mesmo dia",
  before_next_workout: "Antes do próximo treino", periodic_review: "Em uma revisão periódica"
};

const questions = [
  {
    id: "participantRoles", section: "1 · Você e sua prática",
    title: "Quais relações você tem com o esporte hoje?", helper: "Escolha até duas opções.", multiple: true, maxSelections: 2,
    options: Object.entries(roleLabels)
  },
  {
    id: "primaryParticipantRole", section: "1 · Você e sua prática",
    title: "Qual dessas é sua relação principal hoje?",
    when: answers => (answers.participantRoles || []).length > 1,
    options: answers => selectedOptions(answers, "participantRoles", roleLabels)
  },
  {
    id: "sportDisciplines", section: "1 · Você e sua prática",
    title: "Quais modalidades fazem parte da sua rotina?", multiple: true,
    options: Object.entries(disciplineLabels)
  },
  {
    id: "primarySportDiscipline", section: "1 · Você e sua prática",
    title: "Qual é sua modalidade principal atualmente?",
    when: answers => (answers.sportDisciplines || []).length > 1,
    options: answers => selectedOptions(answers, "sportDisciplines", disciplineLabels)
  },
  {
    id: "experienceLevel", section: "1 · Você e sua prática",
    title: "Há quanto tempo você pratica ou trabalha com essas modalidades?",
    options: [["less_than_1_year", "Menos de 1 ano"], ["1_to_3_years", "De 1 a 3 anos"], ["4_to_7_years", "De 4 a 7 anos"], ["8_years_or_more", "8 anos ou mais"]]
  },
  {
    id: "athleteWeeklyTrainingFrequency", section: "1 · Você e sua prática",
    title: "Em uma semana comum, quantas vezes você treina?", when: answers => has(answers, "participantRoles", "athlete"),
    options: [["1_or_less", "1 vez ou menos"], ["2_to_3", "2 a 3 vezes"], ["4_to_5", "4 a 5 vezes"], ["6_or_more", "6 vezes ou mais"]]
  },
  {
    id: "coachWeeklyTrainingFrequency", section: "1 · Você e sua prática",
    title: "Em uma semana comum, quantos treinos você orienta?", when: answers => has(answers, "participantRoles", "coach"),
    options: [["1_or_less", "1 treino ou menos"], ["2_to_3", "2 a 3 treinos"], ["4_to_5", "4 a 5 treinos"], ["6_or_more", "6 treinos ou mais"]]
  },
  {
    id: "participationContexts", section: "1 · Você e sua prática",
    title: "Quais contextos descrevem melhor sua participação?", helper: "Escolha até duas opções.", multiple: true, maxSelections: 2,
    options: [["recreation", "Lazer e prática recreativa"], ["health_fitness", "Saúde e condicionamento"], ["amateur_competition", "Competição amadora"], ["high_performance", "Alto rendimento"], ["professional_role", "Atuação profissional no esporte"]]
  },
  {
    id: "rowingDisciplines", section: "1 · Você e sua prática",
    title: "No Remo, quais tipos de palamenta você utiliza?", helper: "Palamenta dupla é o sculling; palamenta simples é o sweep.",
    multiple: true, exclusiveValues: ["not_sure"], when: answers => has(answers, "sportDisciplines", "rowing"),
    options: [["sculling", "Palamenta dupla"], ["sweep", "Palamenta simples"], ["not_sure", "Não tenho certeza"]]
  },
  {
    id: "rowingBoatClasses", section: "1 · Você e sua prática",
    title: "Quais classes de barco fazem parte da sua rotina no Remo?", multiple: true,
    when: answers => has(answers, "sportDisciplines", "rowing"),
    options: [["single_sculls", "Single skiff (1x)"], ["double_sculls", "Double skiff (2x)"], ["pair_or_coxed_pair", "Dois sem ou dois com (2− / 2+)"], ["quadruple_sculls", "Four skiff (4x / 4x+)"], ["four_or_coxed_four", "Quatro sem ou quatro com (4− / 4+)"], ["eight", "Oito com (8+)"], ["octuple_sculls", "Oito com palamenta dupla (8x+)"], ["other", "Outra classe"]]
  },
  {
    id: "vaaBoatClasses", section: "1 · Você e sua prática",
    title: "Quais classes fazem parte da sua rotina no Va'a?", helper: "As nomenclaturas V e OC são preservadas separadamente.", multiple: true,
    when: answers => has(answers, "sportDisciplines", "vaa"),
    options: [["vaa_v:v1", "V1"], ["vaa_v:v2", "V2"], ["vaa_v:v3", "V3"], ["vaa_v:v6", "V6"], ["outrigger_oc:oc1", "OC1"], ["outrigger_oc:oc2", "OC2"], ["outrigger_oc:oc6", "OC6"], ["custom", "Outra classe"]]
  },
  {
    id: "trainingArrangements", section: "1 · Você e sua prática",
    title: "Como seus treinos normalmente acontecem?", multiple: true,
    options: [["alone", "Sozinho(a)"], ["with_crew", "Com equipe ou guarnição"], ["coach_present", "Com treinador presente"], ["remote_coaching", "Com orientação à distância"], ["informal_group", "Em grupo, sem orientação estruturada"]]
  },
  {
    id: "recentWorkoutRecency", section: "2 · Seu treino mais recente",
    title: "Quando aconteceu seu treino mais recente?", helper: "Nas próximas perguntas, pense somente nesse treino.",
    options: [["today", "Hoje"], ["last_3_days", "Nos últimos 3 dias"], ["last_7_days", "Na última semana"], ["last_30_days", "No último mês"], ["more_than_30_days", "Há mais de um mês"]]
  },
  {
    id: "recentWorkoutDiscipline", section: "2 · Seu treino mais recente",
    title: "Qual modalidade você praticou nesse treino?",
    options: answers => selectedOptions(answers, "sportDisciplines", disciplineLabels)
  },
  {
    id: "recentWorkoutPattern", section: "2 · Seu treino mais recente",
    title: "O que melhor descreve esse treino?",
    options: [["steady_state", "Treino contínuo"], ["intervals", "Intervalos"], ["technical_drill", "Treino técnico"], ["starts_or_race_simulation", "Largadas ou simulação de prova"], ["time_trial", "Teste de tempo ou distância"], ["competition", "Competição"], ["recovery_session", "Treino de recuperação"], ["unstructured", "Treino sem estrutura definida"]]
  },
  {
    id: "recentWorkoutPlanSource", section: "2 · Seu treino mais recente",
    title: "Quem definiu o treino que seria realizado?",
    options: [["coach", "Treinador(a)"], ["athlete", "Eu mesmo(a)"], ["club_or_team", "Clube ou equipe"], ["training_group", "Grupo de treino"], ["no_plan", "Não havia um treino definido"]]
  },
  {
    id: "recentWorkoutTargets", section: "2 · Seu treino mais recente",
    title: "Quais alvos estavam definidos antes do treino?", multiple: true, exclusiveValues: ["no_target"],
    options: [["elapsed_time", "Tempo"], ["distance", "Distância"], ["stroke_rate", "Voga / cadência de remada"], ["pace", "Parcial"], ["ground_speed", "Velocidade"], ["power", "Potência"], ["heart_rate", "Frequência cardíaca"], ["perceived_effort", "Esforço percebido"], ["technical_objective", "Objetivo técnico"], ["no_target", "Nenhum alvo definido"]]
  },
  {
    id: "recentWorkoutRecordingTools", section: "2 · Seu treino mais recente",
    title: "O que foi usado para registrar esse treino?", multiple: true, exclusiveValues: ["nothing_used"],
    options: [["speedcoach", "SpeedCoach"], ["mobile_phone", "Celular"], ["sports_watch", "Relógio esportivo"], ["rowerg_pm5", "RowErg com PM5"], ["other_dedicated_instrument", "Outro instrumento dedicado"], ["training_platform", "Aplicativo ou plataforma"], ["manual_notes", "Anotações manuais"], ["someone_else", "Registro feito por outra pessoa"], ["nothing_used", "Nada foi usado"]]
  },
  {
    id: "recentWorkoutLiveInformation", section: "2 · Seu treino mais recente",
    title: "Quais informações você conseguiu consultar durante o treino?", multiple: true, exclusiveValues: ["none_available"],
    when: answers => !has(answers, "recentWorkoutRecordingTools", "nothing_used"),
    options: [["elapsed_time", "Tempo"], ["distance", "Distância"], ["pace", "Parcial"], ["stroke_rate", "Voga / cadência de remada"], ["ground_speed", "Velocidade"], ["heart_rate", "Frequência cardíaca"], ["power", "Potência"], ["route", "Percurso"], ["none_available", "Não consultei informações durante o treino"]]
  },
  {
    id: "recentWorkoutDataDecision", section: "2 · Seu treino mais recente",
    title: "Alguma informação fez você mudar o que estava fazendo durante o treino?",
    options: [["yes", "Sim"], ["no", "Não"], ["no_live_information", "Eu não tinha informações disponíveis durante o treino"]]
  },
  {
    id: "recentWorkoutChanges", section: "2 · Seu treino mais recente",
    title: "O que você mudou com base nessas informações?", multiple: true,
    when: answers => answers.recentWorkoutDataDecision === "yes",
    options: [["pace_or_speed", "Ritmo ou velocidade"], ["stroke_rate", "Voga / cadência de remada"], ["effort", "Intensidade"], ["duration_or_distance", "Duração ou distância"], ["route", "Percurso"], ["technique", "Execução técnica"], ["recovery", "Recuperação entre esforços"], ["stopped", "Interrompi o treino"]]
  },
  {
    id: "recentWorkoutFriction", section: "2 · Seu treino mais recente",
    title: "O que dificultou registrar ou consultar esse treino?", helper: "Escolha até três opções.", multiple: true, maxSelections: 3, exclusiveValues: ["no_friction"],
    options: [["setup", "Preparação ou instalação"], ["connection", "Conexão"], ["screen_readability", "Leitura da tela"], ["water_handling", "Uso com água ou mãos molhadas"], ["battery", "Bateria"], ["compatibility", "Compatibilidade"], ["interruption", "Interrupção do registro"], ["untrustworthy_data", "Dados que pareciam incorretos"], ["no_friction", "Nada dificultou"]]
  },
  {
    id: "recentWorkoutReviewTiming", section: "2 · Seu treino mais recente",
    title: "Quando você reviu esse treino?",
    options: [["immediately_after", "Logo depois"], ["same_day", "Mais tarde, no mesmo dia"], ["later", "Em outro dia"], ["not_reviewed_yet", "Ainda não revi"], ["do_not_intend_to_review", "Não pretendo revisar"]]
  },
  {
    id: "recentWorkoutReviewSurfaces", section: "2 · Seu treino mais recente",
    title: "Onde você reviu as informações?", multiple: true,
    when: answers => ["immediately_after", "same_day", "later"].includes(answers.recentWorkoutReviewTiming),
    options: [["device_screen", "No próprio dispositivo"], ["mobile_app", "Em um aplicativo no celular"], ["website", "Em um site"], ["spreadsheet", "Em uma planilha"], ["coach_conversation", "Em conversa com o treinador"], ["crew_conversation", "Em conversa com equipe ou guarnição"], ["manual_notes", "Em anotações manuais"]]
  },
  {
    id: "recentWorkoutDataActions", section: "2 · Seu treino mais recente",
    title: "O que você fez com as informações desse treino?", multiple: true, exclusiveValues: ["no_action"],
    options: [["checked_execution", "Conferi se o treino foi realizado"], ["compared", "Comparei com outra referência"], ["shared", "Compartilhei"], ["received_feedback", "Recebi feedback"], ["planned_next", "Usei para planejar o próximo treino"], ["archived", "Apenas guardei"], ["no_action", "Não fiz nada com as informações"]]
  },
  {
    id: "recentWorkoutComparisonBasis", section: "2 · Seu treino mais recente",
    title: "Com o que você conseguiu comparar esse treino?", multiple: true, exclusiveValues: ["nothing_to_compare"],
    options: [["planned_workout", "Com o treino planejado"], ["previous_workout", "Com um treino anterior"], ["personal_best", "Com meu melhor resultado"], ["crew_or_peer", "Com colega, equipe ou guarnição"], ["coach_reference", "Com uma referência do treinador"], ["competition_result", "Com resultado de competição"], ["nothing_to_compare", "Não consegui comparar"]]
  },
  {
    id: "recentWorkoutUnderstanding", section: "2 · Seu treino mais recente",
    title: "Depois desse treino, ficou claro o que melhorou ou piorou?",
    options: [["clear", "Sim, ficou claro"], ["partial", "Ficou parcialmente claro"], ["unclear", "Não ficou claro"], ["not_reviewed", "Não revisei o treino"]]
  },
  {
    id: "recentWorkoutUnansweredQuestions", section: "2 · Seu treino mais recente",
    title: "Quais perguntas ficaram sem resposta?", helper: "Escolha até três opções.", multiple: true, maxSelections: 3, exclusiveValues: ["none"],
    options: [["progress", "Estou evoluindo?"], ["plan_execution", "Realizei o que estava planejado?"], ["technique", "O que aconteceu com minha técnica?"], ["crew_performance", "Como a equipe ou guarnição trabalhou?"], ["conditions", "Quanto as condições influenciaram?"], ["equipment", "Quanto o equipamento influenciou?"], ["data_trust", "Posso confiar nos dados?"], ["next_decision", "O que devo fazer no próximo treino?"], ["none", "Nenhuma pergunta importante ficou em aberto"]]
  },
  {
    id: "dataTrustConcerns", section: "2 · Seu treino mais recente",
    title: "O que costuma diminuir sua confiança nos dados?", helper: "Escolha até três opções.", multiple: true, maxSelections: 3, exclusiveValues: ["no_concern"],
    options: [["missing_sections", "Partes do treino ausentes"], ["different_devices", "Valores diferentes entre dispositivos"], ["unexpected_values", "Valores inesperados"], ["unknown_source", "Não saber de onde veio o dado"], ["hard_to_repeat", "Resultado difícil de repetir"], ["conditions_not_recorded", "Condições não registradas"], ["hard_to_interpret", "Dificuldade para interpretar"], ["no_concern", "Normalmente confio nos dados"]]
  },
  {
    id: "valuableOutcomes", section: "3 · Remus, piloto e preço",
    title: "Quais resultados do Remus teriam valor real para você?", helper: "Considere um sistema que registra o treino e organiza a revisão. Escolha até três.",
    multiple: true, maxSelections: 3, options: Object.entries(outcomeLabels)
  },
  {
    id: "primaryValuableOutcome", section: "3 · Remus, piloto e preço",
    title: "Qual desses resultados seria o mais importante?",
    options: answers => selectedOptions(answers, "valuableOutcomes", outcomeLabels)
  },
  {
    id: "valuableTimings", section: "3 · Remus, piloto e preço",
    title: "Em quais momentos você gostaria de receber essas informações?", multiple: true,
    options: Object.entries(timingLabels)
  },
  {
    id: "primaryValuableTiming", section: "3 · Remus, piloto e preço",
    title: "Qual desses momentos seria prioritário?",
    options: answers => selectedOptions(answers, "valuableTimings", timingLabels)
  },
  {
    id: "acceptableSetupTime", section: "3 · Remus, piloto e preço",
    title: "Antes de cada treino, quanto tempo você aceitaria gastar para instalar e conferir o Remus?",
    options: [["up_to_1_minute", "Até 1 minuto"], ["2_to_3_minutes", "De 2 a 3 minutos"], ["4_to_5_minutes", "De 4 a 5 minutos"], ["6_to_10_minutes", "De 6 a 10 minutos"], ["would_not_use_if_setup", "Eu não usaria se precisasse preparar a cada treino"]]
  },
  {
    id: "adoptionBlockers", section: "3 · Remus, piloto e preço",
    title: "O que faria você abandonar o uso do Remus?", helper: "Escolha até três opções.", multiple: true, maxSelections: 3,
    options: [["installation", "Instalação trabalhosa"], ["equipment_interference", "Interferência no barco, remo ou pá"], ["water_resistance", "Resistência inadequada à água"], ["battery", "Autonomia insuficiente"], ["phone_dependency", "Dependência do celular"], ["connection", "Falhas de conexão"], ["hard_to_understand", "Resultados difíceis de entender"], ["lack_of_trust", "Falta de confiança"], ["price", "Preço"]]
  },
  {
    id: "pilotCommitment", section: "3 · Remus, piloto e preço",
    title: "Você participaria de um piloto usando o Remus em pelo menos três atividades durante 30 dias?",
    options: [["yes", "Sim"], ["maybe_with_conditions", "Talvez, dependendo das condições"], ["no", "Não"]]
  },
  {
    id: "pilotConditions", section: "3 · Remus, piloto e preço",
    title: "Quais condições seriam necessárias para você participar?", multiple: true,
    when: answers => answers.pilotCommitment === "maybe_with_conditions",
    options: [["initial_support", "Suporte inicial"], ["installation_help", "Ajuda na instalação"], ["equipment_provided", "Equipamento fornecido pelo Remus"], ["data_privacy", "Explicação sobre privacidade dos dados"], ["compatibility", "Confirmação de compatibilidade"], ["no_cost", "Participação sem custo"], ["club_or_coach_approval", "Autorização do clube ou treinador"]]
  },
  {
    id: "expectedPayer", section: "3 · Remus, piloto e preço",
    title: "Se você decidisse usar o Remus, quem provavelmente pagaria?",
    options: [["self", "Eu mesmo(a)"], ["shared_with_others", "Eu dividiria o custo com outras pessoas"], ["club_or_team", "Clube ou equipe"], ["sponsor", "Patrocinador"], ["other", "Outra pessoa ou organização"], ["unknown", "Ainda não sei"]]
  },
  {
    id: "preferredCommercialModel", section: "3 · Remus, piloto e preço",
    title: "Qual modelo de acesso faria mais sentido?",
    options: [["one_time_purchase", "Compra única com recursos essenciais incluídos"], ["purchase_optional_service", "Compra do equipamento com serviço opcional"], ["rental", "Aluguel do equipamento"], ["subscription_with_device", "Assinatura com equipamento cedido"], ["club_owned", "Equipamento adquirido e compartilhado pelo clube"]]
  },
  {
    id: "hardwarePriceRange", section: "3 · Remus, piloto e preço",
    title: "Quanto você consideraria pagar pelo equipamento, se ele entregasse o resultado prioritário escolhido?",
    options: [["up_to_brl_499", "Até R$ 499"], ["brl_500_to_999", "R$ 500 a R$ 999"], ["brl_1000_to_1499", "R$ 1.000 a R$ 1.499"], ["brl_1500_to_2499", "R$ 1.500 a R$ 2.499"], ["brl_2500_or_more", "R$ 2.500 ou mais"], ["organization_should_pay", "Esperaria que clube, equipe ou patrocinador pagasse"], ["would_not_buy", "Eu não compraria"]]
  },
  {
    id: "monthlyServicePriceCeiling", section: "3 · Remus, piloto e preço",
    title: "Qual seria o valor máximo que você pagaria por mês pelo aplicativo do Remus?",
    helper: "Considere histórico de treinos, comparações e análises para uso individual.",
    options: [["would_not_pay_monthly", "Não pagaria mensalidade"], ["brl_5_to_15", "De R$ 5 a R$ 15 por mês"], ["brl_16_to_30", "De R$ 16 a R$ 30 por mês"], ["brl_31_to_60", "De R$ 31 a R$ 60 por mês"], ["brl_61_to_100", "De R$ 61 a R$ 100 por mês"], ["above_brl_100", "Mais de R$ 100 por mês"]]
  }
];

mountQuestionnaire({
  instrumentId: "club_detailed_questionnaire",
  revision: "2026-10-09.v2",
  displayName: "Pesquisa detalhada Remus — clube",
  collectionMode: "club_intercept",
  defaultSource: "club_intercept",
  allowPersonalizedName: false,
  eyebrow: "Pesquisa detalhada · cerca de 12 minutos",
  heading: "Conte como seu treino realmente acontece.",
  introduction: "Vamos partir do seu treino mais recente para entender decisões, dificuldades e o que o Remus precisaria entregar para ser útil.",
  meta: ["Aplicação presencial", "Percurso adaptativo", "Respostas revisáveis"],
  consentText: "As respostas serão usadas para pesquisa e decisões sobre produto, piloto e preço do Remus. No final, você poderá informar nome e e-mail opcionalmente. Você pode responder sem se identificar e parar a qualquer momento antes do envio.",
  questions
});
