# PersonalDoc

**AI-powered family health companion for clearer everyday decisions and better doctor visits.**

PersonalDoc helps families keep member profiles, symptoms, medicines, allergies, vitals, lab explanations, emergency guidance, and doctor-ready visit notes together in one place.

## Honest Architecture

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, and `tsx`
- **AI:** Google Gemini through `@google/genai`
- **Local data:** Browser `localStorage` with JSON backup and restore
- **Optional hosting:** AWS App Runner can host the existing Node/Express server
- **Secrets:** Store `GEMINI_API_KEY` in the hosting provider's secret manager, not in source control

This version does not claim to use Amazon Bedrock, DynamoDB, Lambda, Transcribe, Polly, or Comprehend Medical. Those are possible future integrations, not current dependencies.

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

2. Create `.env` in the project root:

   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3001
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Open `http://localhost:3001/`.

## Demo Presentation

Open `http://localhost:3001/demo.html` for the self-running project presentation. It covers the problem, product flow, technology stack, architecture, and the honest AWS deployment path. Use **Play narration**, the arrow keys, or the Previous/Next controls to present it.

The current prototype uses Google Gemini, Node/Express, browser localStorage, and optional AWS App Runner hosting. AWS services such as Bedrock, DynamoDB, Lambda, Transcribe, and Polly are future integration options, not current dependencies.

## Validation

```bash
npm run lint
npm run build
```

## Safety

PersonalDoc is an AI-assisted preparation and organization tool. It is not a doctor, does not replace professional medical care, and should not be used for emergencies. Call local emergency services immediately for urgent symptoms.
