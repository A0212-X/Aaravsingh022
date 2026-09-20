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

## Validation

```bash
npm run lint
npm run build
```

## Safety

PersonalDoc is an AI-assisted preparation and organization tool. It is not a doctor, does not replace professional medical care, and should not be used for emergencies. Call local emergency services immediately for urgent symptoms.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/bd5476f2-9b4f-49d6-922a-56084d8e61d6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
