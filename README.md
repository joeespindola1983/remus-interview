# REMUS QUESTIONNAIRE

Questionário temporário de pesquisa de mercado para o OKR KAN-41: validar necessidades, disposição de pagamento e interesse em piloto com 15–20 potenciais usuários do Remus. O vocabulário e os limites dos campos estão documentados em [`docs/QUESTIONNAIRE_DATA_DICTIONARY.md`](docs/QUESTIONNAIRE_DATA_DICTIONARY.md).

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
https://remus-interview.onrender.com/?name=Ana%20Silva
```

O nome só é armazenado se a pessoa escolher enviar a resposta identificada. Nunca coloque e-mail no link: parâmetros de URL podem aparecer no histórico do navegador e em logs de acesso.

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
