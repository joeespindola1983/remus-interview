import { mountQuestionnaire } from "./questionnaire-engine.js";

const has = (answers, field, value) => Array.isArray(answers[field]) && answers[field].includes(value);

const questions = [
  {
    id: "participantRoles", section: "Seu contexto",
    title: "Quais relações você tem com o esporte hoje?",
    helper: "Marque todas as que fazem parte da sua rotina.", multiple: true,
    options: [["athlete", "Atleta ou praticante"], ["coach", "Treinador(a)"], ["club_leader", "Gestor(a) de clube ou equipe"], ["equipment_manager", "Responsável por equipamentos"], ["other", "Outra relação"]]
  },
  {
    id: "sportDisciplines", section: "Seu contexto",
    title: "Quais modalidades fazem parte da sua rotina?", multiple: true,
    options: [["rowing", "Remo"], ["vaa", "Va'a / canoa havaiana"], ["indoor_rowing", "Remo indoor"], ["other", "Outra modalidade"]]
  },
  {
    id: "rowingDisciplines", section: "Seu contexto",
    title: "No Remo, quais tipos de palamenta fazem parte da sua rotina?",
    helper: "Palamenta dupla é o sculling; palamenta simples é o sweep.", multiple: true,
    exclusiveValues: ["not_sure"], when: answers => has(answers, "sportDisciplines", "rowing"),
    options: [["sculling", "Palamenta dupla"], ["sweep", "Palamenta simples"], ["not_sure", "Não tenho certeza"]]
  },
  {
    id: "vaaTrainingContexts", section: "Seu contexto",
    title: "No Va'a, quais contextos fazem parte da sua rotina?", multiple: true,
    exclusiveValues: ["not_sure"], when: answers => has(answers, "sportDisciplines", "vaa"),
    options: [["one_paddler", "Embarcação para um remador"], ["crew_craft", "Embarcação de equipe"], ["not_sure", "Não tenho certeza"]]
  },
  {
    id: "experienceLevel", section: "Seu contexto",
    title: "Há quanto tempo você pratica ou trabalha com essas modalidades?",
    options: [["less_than_1_year", "Menos de 1 ano"], ["1_to_3_years", "De 1 a 3 anos"], ["4_to_7_years", "De 4 a 7 anos"], ["8_years_or_more", "8 anos ou mais"]]
  },
  {
    id: "athleteWeeklyTrainingFrequency", section: "Seu contexto",
    title: "Em uma semana comum, quantas vezes você treina?", when: answers => has(answers, "participantRoles", "athlete"),
    options: [["1_or_less", "1 vez ou menos"], ["2_to_3", "2 a 3 vezes"], ["4_to_5", "4 a 5 vezes"], ["6_or_more", "6 vezes ou mais"]]
  },
  {
    id: "coachWeeklyTrainingFrequency", section: "Seu contexto",
    title: "Em uma semana comum, quantos treinos você orienta?", when: answers => has(answers, "participantRoles", "coach"),
    options: [["1_or_less", "1 treino ou menos"], ["2_to_3", "2 a 3 treinos"], ["4_to_5", "4 a 5 treinos"], ["6_or_more", "6 treinos ou mais"]]
  },
  {
    id: "participationContexts", section: "Seu contexto",
    title: "Quais contextos descrevem sua participação hoje?", helper: "Escolha até duas opções.", multiple: true, maxSelections: 2,
    options: [["recreation", "Lazer e prática recreativa"], ["health_fitness", "Saúde e condicionamento"], ["amateur_competition", "Competição amadora"], ["high_performance", "Alto rendimento"], ["professional_role", "Atuação profissional no esporte"]]
  },
  {
    id: "workoutRecordingFrequency", section: "Como você acompanha treinos",
    title: "Durante ou depois dos treinos, com que frequência algum dado é registrado?",
    helper: "Pode ser um registro automático, manual ou feito por outra pessoa.",
    options: [["every_workout", "Em todo treino"], ["most_workouts", "Na maioria dos treinos"], ["some_workouts", "Somente em alguns treinos"], ["rarely", "Raramente"], ["never", "Nunca"]]
  },
  {
    id: "noWorkoutRecordingReasons", section: "Como você acompanha treinos",
    title: "Por que esses treinos não são registrados?", multiple: true, maxSelections: 3,
    when: answers => answers.workoutRecordingFrequency === "never",
    options: [["no_need", "Não sinto necessidade"], ["no_equipment", "Não tenho equipamento adequado"], ["too_complex", "É complicado ou dá trabalho"], ["too_expensive", "As opções são caras"], ["dont_know_how", "Não sei bem como fazer"], ["other", "Outro motivo"]]
  },
  {
    id: "workoutRecordingTools", section: "Como você acompanha treinos",
    title: "O que é usado para registrar os treinos?", multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [["speedcoach", "SpeedCoach"], ["mobile_phone", "Celular"], ["sports_watch", "Relógio esportivo"], ["rowerg_pm5", "RowErg com PM5"], ["other_dedicated_instrument", "Outro instrumento dedicado"], ["training_platform", "Aplicativo, planilha ou plataforma"], ["manual_notes", "Anotações manuais"], ["other", "Outro recurso"]]
  },
  {
    id: "recordedWorkoutInformation", section: "Como você acompanha treinos",
    title: "Quais informações você costuma registrar ou consultar?", multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [["elapsed_time", "Tempo"], ["distance", "Distância"], ["pace", "Parcial (tempo/500 m)"], ["stroke_rate", "Voga / cadência de remada"], ["heart_rate", "Frequência cardíaca"], ["route", "Percurso"], ["power", "Potência"], ["workout_notes", "Anotações sobre o treino"]]
  },
  {
    id: "workoutReviewMoments", section: "Como você acompanha treinos",
    title: "Em quais momentos você costuma olhar para essas informações?", multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [["during_workout", "Durante o treino"], ["immediately_after", "Logo depois do treino"], ["same_day", "Mais tarde, no mesmo dia"], ["before_next_workout", "Antes do próximo treino"], ["periodic_review", "Em uma revisão periódica"], ["rarely_review", "Registro, mas raramente volto a consultar"]]
  },
  {
    id: "workoutDataUse", section: "Como você acompanha treinos",
    title: "O que você normalmente faz com essas informações?", multiple: true,
    when: answers => answers.workoutRecordingFrequency && answers.workoutRecordingFrequency !== "never",
    options: [["review_own_workout", "Reviso o meu próprio treino"], ["compare_workouts", "Comparo com outros treinos"], ["share_with_coach", "Compartilho com o treinador"], ["share_with_athlete_or_crew", "Compartilho com atleta, equipe ou guarnição"], ["plan_next_workout", "Uso para planejar o próximo treino"], ["archive_only", "Apenas guardo o registro"], ["rarely_use", "Raramente faço algo com os dados"]]
  },
  {
    id: "workoutTrackingNeeds", section: "Necessidades e valor",
    title: "Por quais razões você gostaria de acompanhar melhor um treino?", helper: "Escolha até três opções.",
    multiple: true, maxSelections: 3, exclusiveValues: ["no_clear_need"],
    options: [["track_progress", "Perceber evolução ao longo do tempo"], ["execute_training_plan", "Saber se o treino planejado foi realizado"], ["compare_workouts", "Comparar treinos"], ["review_technique", "Apoiar a revisão da técnica"], ["review_crew", "Entender o desempenho da equipe ou guarnição"], ["prepare_competition", "Preparar testes ou competições"], ["support_coaching", "Dar suporte ao trabalho do treinador"], ["no_clear_need", "Não sinto uma necessidade clara"]]
  },
  {
    id: "currentTrackingGaps", section: "Necessidades e valor",
    title: "O que falta na forma como você acompanha os treinos hoje?", helper: "Escolha até três opções.",
    multiple: true, maxSelections: 3, exclusiveValues: ["nothing_missing"],
    options: [["easier_recording", "Registrar com menos esforço"], ["unified_information", "Reunir as informações em um só lugar"], ["trustworthy_data", "Confiar mais nos dados"], ["clear_interpretation", "Entender melhor o que os dados significam"], ["workout_comparison", "Comparar treinos com facilidade"], ["technique_context", "Relacionar dados e técnica"], ["sharing", "Compartilhar com facilidade"], ["nothing_missing", "Nada importante"]]
  },
  {
    id: "mostUsefulOutcomes", section: "Necessidades e valor",
    title: "Quais resultados do Remus seriam mais úteis para você?", helper: "Escolha até três opções.", multiple: true, maxSelections: 3,
    options: [["clear_workout_summary", "Resumo claro de cada treino"], ["progress_over_time", "Evolução ao longo do tempo"], ["technique_review", "Revisão da técnica apoiada por dados"], ["training_plan_comparison", "Comparação entre treino planejado e realizado"], ["crew_review", "Revisão da equipe ou guarnição"], ["conditions_equipment_context", "Relação com condições e equipamento"], ["research_evidence", "Evidências rastreáveis para pesquisa"]]
  },
  {
    id: "desiredTimings", section: "Necessidades e valor",
    title: "Em quais momentos essa informação teria valor para você?", multiple: true,
    options: [["during_workout", "Durante o treino"], ["immediately_after", "Logo depois do treino"], ["same_day", "Mais tarde, no mesmo dia"], ["before_next_workout", "Antes do próximo treino"], ["periodic_review", "Em uma revisão periódica"]]
  },
  {
    id: "primaryBarriers", section: "Adoção e piloto",
    title: "O que poderia impedir você de usar o Remus?", helper: "Escolha até três opções.", multiple: true, maxSelections: 3,
    options: [["complex_setup", "Instalação ou preparação complicada"], ["hard_to_understand", "Resultados difíceis de entender"], ["lack_of_trust", "Falta de confiança nos resultados"], ["battery", "Autonomia insuficiente"], ["water_resistance", "Resistência inadequada à água"], ["compatibility", "Incompatibilidade com meu equipamento"], ["price", "Preço"]]
  },
  {
    id: "expectedPayer", section: "Adoção e piloto",
    title: "Se você decidisse usar o Remus, quem provavelmente pagaria?",
    options: [["self", "Eu mesmo(a)"], ["shared_with_others", "Eu dividiria o custo com outras pessoas"], ["club_or_team", "Clube ou equipe"], ["sponsor", "Patrocinador"], ["other", "Outra pessoa ou organização"], ["unknown", "Ainda não sei"]]
  },
  {
    id: "purchaseIntent", section: "Adoção e piloto",
    title: "Se isso resolvesse suas principais dificuldades, você consideraria pagar?",
    options: [["definitely", "Sim, com certeza"], ["probably", "Provavelmente sim"], ["depends", "Dependeria do preço e da comprovação"], ["probably_not", "Provavelmente não"], ["no", "Não"]]
  },
  {
    id: "monthlyServicePriceCeiling", section: "Adoção e piloto",
    title: "Qual seria o valor máximo que você pagaria por mês pelo aplicativo do Remus?",
    helper: "Considere histórico de treinos, comparações e análises para uso individual.",
    options: [["would_not_pay_monthly", "Não pagaria mensalidade"], ["brl_5_to_15", "De R$ 5 a R$ 15 por mês"], ["brl_16_to_30", "De R$ 16 a R$ 30 por mês"], ["brl_31_to_60", "De R$ 31 a R$ 60 por mês"], ["brl_61_to_100", "De R$ 61 a R$ 100 por mês"], ["above_brl_100", "Mais de R$ 100 por mês"]]
  },
  {
    id: "pilotInterest", section: "Adoção e piloto",
    title: "Você toparia testar um protótipo do Remus e conversar por 20 minutos?",
    options: [["yes", "Sim, quero participar"], ["maybe", "Talvez, preciso saber mais"], ["questionnaire_only", "Prefiro responder somente este questionário"]]
  }
];

mountQuestionnaire({
  instrumentId: "initial_market_questionnaire",
  revision: "2026-10-09.v5",
  displayName: "Pesquisa inicial Remus — revisão 5",
  collectionMode: "remote_self_service",
  defaultSource: "personal_invitation",
  allowPersonalizedName: true,
  eyebrow: "Pesquisa inicial · 7 a 10 minutos",
  heading: "Ajude a construir o próximo Remus.",
  personalizedHeading: "ajude a construir o próximo Remus.",
  introduction: "Queremos entender como atletas, treinadores e clubes acompanham treinos hoje — e quais problemas realmente merecem uma solução.",
  meta: ["Percurso personalizado", "Respostas objetivas", "Sem cadastro"],
  consentText: "As respostas serão usadas para pesquisa de mercado e decisões sobre produto, preço, posicionamento e aquisição do Remus. No final, você poderá informar nome e e-mail opcionalmente. Você pode responder sem se identificar e parar a qualquer momento antes do envio.",
  questions
});
