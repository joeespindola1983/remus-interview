# REMUS QUESTIONNAIRE

Instrumentos de pesquisa de mercado do Remus. O vocabulário e os limites dos campos estão documentados em [`docs/QUESTIONNAIRE_DATA_DICTIONARY.md`](docs/QUESTIONNAIRE_DATA_DICTIONARY.md).

## Instrumentos ativos

| Endereço | Instrumento | Revisão | Uso |
|---|---|---|---|
| `/` | — | — | Seletor dos questionários ativos |
| `/initial/` | `initial_market_questionnaire` | `2026-10-09.v4` | Pesquisa inicial remota |
| `/club/` | `club_detailed_questionnaire` | `2026-10-09.v1` | Pesquisa detalhada aplicada presencialmente no clube |
| `/admin/` | — | — | Área administrativa de respostas |

Cada resposta nova inclui `answers.researchInstrument` e `answers.instrumentRevision`. Respostas anteriores que não possuem esses campos são apresentadas no painel como `legacy_initial_questionnaire`. O valor de transporte `questionnaireVersion: 2026-10-07.v3` é mantido temporariamente para compatibilidade com o backend implantado e não deve ser usado para distinguir os instrumentos atuais.

## Executar localmente

Requer Node.js 20 ou superior e não possui dependências externas.

```bash
npm start
```

Abra `http://localhost:3000`. Para verificar o backend:

```bash
npm test
```

## Armazenamento das respostas

Em produção, o navegador envia as respostas para `POST https://remus-app-recorder-backend.onrender.com/api/questionnaire/responses`. O backend mantém um arquivo JSON por resposta no diretório persistente separado `questionnaire/`. O endpoint local `/api/responses` permanece apenas para desenvolvimento isolado.

O backend precisa de Persistent Disk no Render. Sem o disco, respostas podem ser perdidas em reinicializações ou deploys. Configure `QUESTIONNAIRE_ADMIN_TOKEN` no serviço do backend. A exportação usa `X-Admin-Token`:

```bash
curl -H "X-Admin-Token: $QUESTIONNAIRE_ADMIN_TOKEN" \
  https://remus-app-recorder-backend.onrender.com/api/questionnaire/responses \
  --output remus-questionnaire-responses.json
```

O endpoint de exportação permanece desabilitado quando `QUESTIONNAIRE_ADMIN_TOKEN` não está configurado.

## Convites personalizados

O parâmetro opcional `name` personaliza o convite e preenche o nome na etapa final:

```text
https://remus-interview.onrender.com/initial/?name=Ana%20Silva
```

O nome só é armazenado se a pessoa escolher enviar a resposta identificada. Nunca coloque e-mail no link: parâmetros de URL podem aparecer no histórico do navegador e em logs de acesso.

## Área de respostas

Acesse `https://remus-interview.onrender.com/admin/` e informe o `QUESTIONNAIRE_ADMIN_TOKEN`. A página apresenta totais, filtros por instrumento, modalidade e perfil, respostas individuais e exportação JSON/CSV. O CSV coloca `researchInstrument` e `instrumentRevision` nas primeiras colunas de identificação. O endereço antigo `/responses/` redireciona para `/admin/`.

Para um link administrativo temporário, use o token no fragmento, não na query string:

```text
https://remus-interview.onrender.com/admin/#token=SEU_TOKEN
```

O fragmento não é enviado ao servidor e é removido da barra de endereço assim que a página o lê. O token fica somente no `sessionStorage` da aba até “Sair” ou o fechamento da sessão.

## Decisões do MVP

- Interface em português do Brasil, responsiva e centrada.
- Perguntas entram pela direita; opções aparecem em sequência; a resposta selecionada sai pela esquerda.
- Teclado, foco visível, alvos de toque grandes, texto ampliável e `prefers-reduced-motion`.
- Consentimento antes das perguntas e retenção comunicada de 30 dias após o encerramento.
- Identificadores duráveis em inglês; Remo, Va'a e remo indoor permanecem segmentos distintos.
- Nenhuma resposta é tratada como telemetria ou medição esportiva.
- Perguntas de realidades simultâneas usam múltipla escolha; perguntas de prioridade e de um episódio específico permanecem únicas.
- Toda pergunta permite voltar; uma revisão completa precede o envio.
- Rascunhos são separados por instrumento e revisão no armazenamento local. Após envio confirmado, o rascunho é removido.
- A coleta presencial oferece “Preparar para a próxima pessoa” e nunca reutiliza respostas do participante anterior.

## Plano de duas semanas

1. **Dias 1–2:** revisão interna do questionário, teste em celular e publicação.
2. **Dias 3–8:** recrutamento balanceado entre atletas/praticantes, treinadores e gestores; buscar cobertura de Remo e Va'a.
3. **Dias 5–10:** entrevistas profundas de 20 minutos com participantes que aceitarem uma etapa separada de contato.
4. **Dias 11–12:** segmentar respostas por papel, modalidade, experiência e frequência.
5. **Dias 13–14:** sintetizar implicações para produto, preço, posicionamento e aquisição; registrar limitações da amostra.

Meta mínima: 15 respostas válidas. Meta desejada: 20. Não interpretar esta amostra intencional como representativa do mercado inteiro.
