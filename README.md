# REMUS QUESTIONNAIRE

Questionário temporário de pesquisa de mercado para o OKR KAN-41: validar necessidades, disposição de pagamento e interesse em piloto com 15–20 potenciais usuários do Remus.

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

`POST /api/responses` recebe uma resposta consentida e grava um registro NDJSON por linha. O caminho é definido por `RESPONSES_FILE` e, localmente, usa `data/responses.ndjson`.

No Render, o `render.yaml` monta um disco persistente em `/var/data`. Configure também `ADMIN_TOKEN` como secret. A exportação exige `Authorization: Bearer <ADMIN_TOKEN>`:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://remus-interview.onrender.com/api/responses/export \
  --output remus-questionnaire-responses.ndjson
```

O endpoint de exportação permanece desabilitado quando `ADMIN_TOKEN` não está configurado.

## Decisões do MVP

- Interface em português do Brasil, responsiva e centrada.
- Perguntas entram pela direita; opções aparecem em sequência; a resposta selecionada sai pela esquerda.
- Teclado, foco visível, alvos de toque grandes, texto ampliável e `prefers-reduced-motion`.
- Consentimento antes das perguntas e retenção comunicada de 30 dias após o encerramento.
- Identificadores duráveis em inglês; Remo, Va'a e remo indoor permanecem segmentos distintos.
- Nenhuma resposta é tratada como telemetria ou medição esportiva.

## Plano de duas semanas

1. **Dias 1–2:** revisão interna do questionário, teste em celular e publicação.
2. **Dias 3–8:** recrutamento balanceado entre atletas/praticantes, treinadores e gestores; buscar cobertura de Remo e Va'a.
3. **Dias 5–10:** entrevistas profundas de 20 minutos com participantes que aceitarem uma etapa separada de contato.
4. **Dias 11–12:** segmentar respostas por papel, modalidade, experiência e frequência.
5. **Dias 13–14:** sintetizar implicações para produto, preço, posicionamento e aquisição; registrar limitações da amostra.

Meta mínima: 15 respostas válidas. Meta desejada: 20. Não interpretar esta amostra intencional como representativa do mercado inteiro.
