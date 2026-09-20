import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: "ok",
      hasGeminiKey: hasKey,
      timestamp: new Date().toISOString(),
    });
  });

  // Hackathon Presentation Deck & Printable PDF Route
  app.get("/presentation", (_req, res) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PersonalDoc — Project Architecture & Presentation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 24px;
      line-height: 1.5;
    }
    .toolbar {
      position: fixed;
      top: 16px;
      right: 20px;
      z-index: 1000;
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #f59e0b; color: #0f172a; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4); }
    .btn-primary:hover { background: #d97706; }
    .btn-secondary { background: #1e293b; color: #f8fafc; border: 1px solid #334155; }
    .btn-secondary:hover { background: #334155; }
    .container { max-width: 960px; margin: 0 auto 60px auto; }
    .slide-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 36px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
    }
    .slide-tag {
      display: inline-block;
      padding: 4px 12px;
      background: #f59e0b;
      color: #0f172a;
      font-weight: 800;
      font-size: 11px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .slide-title { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
    .slide-subtitle { font-size: 16px; color: #38bdf8; font-weight: 600; margin-bottom: 20px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .feature-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 16px;
    }
    .feature-box h4 { font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 6px; }
    .feature-box p { font-size: 12px; color: #94a3b8; line-height: 1.5; }
    .speaker-note {
      margin-top: 24px;
      padding: 16px;
      background: #0284c715;
      border-left: 4px solid #38bdf8;
      border-radius: 0 10px 10px 0;
      font-size: 12px;
      color: #bae6fd;
    }
    .speaker-note strong { color: #38bdf8; }
    .qa-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 14px;
    }
    .qa-box h4 { font-size: 14px; font-weight: 700; color: #f59e0b; margin-bottom: 8px; }
    .qa-box p { font-size: 13px; color: #cbd5e1; line-height: 1.6; }
    
    @media print {
      body { background: #ffffff !important; color: #000000 !important; padding: 0 !important; }
      .toolbar { display: none !important; }
      .container { max-width: 100% !important; margin: 0 !important; }
      .slide-card {
        background: #ffffff !important;
        color: #000000 !important;
        border: 2px solid #e2e8f0 !important;
        box-shadow: none !important;
        padding: 30px !important;
        margin-bottom: 0 !important;
        page-break-after: always !important;
        break-after: page !important;
        height: 100vh !important;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .slide-title { color: #0f172a !important; }
      .slide-subtitle { color: #0284c7 !important; }
      .feature-box { background: #f8fafc !important; border: 1px solid #cbd5e1 !important; }
      .feature-box h4 { color: #0f172a !important; }
      .feature-box p { color: #475569 !important; }
      .speaker-note { background: #f0f9ff !important; color: #0369a1 !important; border-left: 4px solid #0284c7 !important; }
      .qa-box { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; page-break-inside: avoid; }
      .qa-box h4 { color: #b45309 !important; }
      .qa-box p { color: #334155 !important; }
    }
    @page { size: A4 landscape; margin: 10mm; }
  </style>
</head>
<body>

  <div class="toolbar">
    <a href="/" class="btn btn-secondary">⬅️ Open App</a>
    <button onclick="window.print()" class="btn btn-primary">🖨️ Save as PDF / Print</button>
  </div>

  <div class="container">

    <!-- SLIDE 1 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 1 • Title & Introduction</span>
        <h1 class="slide-title">PersonalDoc</h1>
        <div class="slide-subtitle">Intelligent Family Clinical Companion & Doctor Preparation System</div>
        <p style="color: #cbd5e1; font-size: 14px; max-width: 650px;">
          Bridging the critical gap between home symptom anxiety and crowded outpatient doctor consultations with multilingual AI triage and clinical prep sheets.
        </p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8;">
        <div><strong>Presenter:</strong> Aarav Singh Hada (Founder & Developer)</div>
        <div><strong>Contact:</strong> +91-9828263561 • aaravpratapsinghhada07@gmail.com</div>
      </div>

      <div class="speaker-note">
        <strong>🎙️ 45-Second Pitch Script:</strong> "Good morning, judges. In India, over 70% of households face panic when a family member falls sick at night. They Google blindly, and by the time they reach a busy clinic, the doctor has only 5 minutes. Today I present PersonalDoc: an intelligent family clinical companion that triages symptoms in Hindi and English, tracks chronic vitals, and hands the doctor a structured 1-page clinical prep sheet."
      </div>
    </div>

    <!-- SLIDE 2 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 2 • Problem Statement</span>
        <h2 class="slide-title">The Healthcare Bottleneck in Indian Households</h2>
        <div class="slide-subtitle">Why Medical Consultations Fail Before Entering the Clinic</div>
      </div>

      <div class="grid-2">
        <div class="feature-box">
          <h4>⏱️ The 5-Minute OPD Crunch</h4>
          <p>Indian outpatient physicians consult 60–80 patients per shift. Anxious patients forget symptom timelines, previous blood pressure readings, and current medications under pressure.</p>
        </div>
        <div class="feature-box">
          <h4>🔍 The Google Panic Trap</h4>
          <p>Unguided online searches catastrophize common complaints into worst-case scenarios, amplifying family stress without clinical triage.</p>
        </div>
        <div class="feature-box">
          <h4>📋 Fragmented Chronic Care</h4>
          <p>Hypertension and diabetes logs are scattered across paper slips or lost WhatsApp chats, preventing doctors from spotting critical longitudinal trends.</p>
        </div>
        <div class="feature-box">
          <h4>🗣️ Vernacular & Senior Accessibility</h4>
          <p>Millions of senior parents cannot articulate symptoms in English. They need intuitive voice interaction in Hindi and Hinglish.</p>
        </div>
      </div>

      <div class="speaker-note">
        <strong>🎙️ Speaker Note:</strong> "The problem isn't a lack of competent doctors; it's the missing bridge between the patient's home and the 5-minute physical consultation."
      </div>
    </div>

    <!-- SLIDE 3 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 3 • The Solution</span>
        <h2 class="slide-title">PersonalDoc: The Intelligent Clinical Bridge</h2>
        <div class="slide-subtitle">Empowering Patients and Streamlining Doctor Workflows</div>
      </div>

      <div class="grid-3">
        <div class="feature-box">
          <h4>👩‍⚕️ Dr. Ananya Sharma (AI Triage)</h4>
          <p>Guided step-by-step clinical intake analyzing duration, pain scale, and red flags following ICMR guidelines.</p>
        </div>
        <div class="feature-box">
          <h4>📄 1-Click Doctor Prep Sheet</h4>
          <p>Generates a printable clinical intake note summarizing HPI, vitals history, and physician talking points.</p>
        </div>
        <div class="feature-box">
          <h4>🎙️ Vernacular Voice Input</h4>
          <p>Speech-to-text in Hindi, Hinglish, and English for senior accessibility with zero typing hurdles.</p>
        </div>
        <div class="feature-box">
          <h4>💊 Daily Meds Schedule</h4>
          <p>Prescription checklist with dose adherence tracking and family accountability.</p>
        </div>
        <div class="feature-box">
          <h4>🚨 Emergency WhatsApp SOS</h4>
          <p>1-tap broadcast of patient blood group, allergies, conditions, and national 112/108 protocols.</p>
        </div>
        <div class="feature-box">
          <h4>💾 Offline Privacy First</h4>
          <p>100% client-side data sovereignty with one-click JSON backup and restore.</p>
        </div>
      </div>

      <div class="speaker-note">
        <strong>🎙️ Speaker Note:</strong> "PersonalDoc does not replace doctors — it equips them with structured patient data so consultations start on minute 1 rather than minute 5."
      </div>
    </div>

    <!-- SLIDE 4 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 4 • Current Architecture</span>
        <h2 class="slide-title">A focused, privacy-aware application architecture</h2>
        <div class="slide-subtitle">React, Node.js, Express, Gemini, and browser-first data storage</div>
      </div>

      <div class="grid-2">
        <div class="feature-box">
          <h4 style="color: #f59e0b;">Google Gemini</h4>
          <p>Provides the AI consultation, lab explanation, and visit-summary generation through the server-side Gemini client.</p>
        </div>
        <div class="feature-box">
          <h4 style="color: #f59e0b;">React + TypeScript</h4>
          <p>Provides the responsive family dashboard, health tools, modals, and guided user workflows.</p>
        </div>
        <div class="feature-box">
          <h4 style="color: #f59e0b;">Node.js + Express</h4>
          <p>Serves the application, exposes the AI routes, loads environment secrets, and supports local or hosted deployment.</p>
        </div>
        <div class="feature-box">
          <h4 style="color: #f59e0b;">Browser-first privacy</h4>
          <p>Family profiles and vitals persist in localStorage, with JSON export and restore so users retain control of their records.</p>
        </div>
      </div>

      <div class="speaker-note">
        <strong>🎙️ Speaker Note:</strong> "The current prototype keeps its architecture focused: Gemini handles AI generation on the server, while family records stay in the user's browser. For deployment, the existing Node server can run on AWS App Runner with the Gemini key stored as a managed secret."
      </div>
    </div>

    <!-- SLIDE 5 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 5 • Safety & Ethics</span>
        <h2 class="slide-title">Clinical Guardrails & Ethical Boundaries</h2>
        <div class="slide-subtitle">Deterministic Safety Protocols for Healthcare AI</div>
      </div>

      <div class="feature-box" style="margin-bottom: 12px;">
        <h4 style="color: #10b981;">🛡️ Strict Non-Prescription Policy</h4>
        <p>PersonalDoc never prescribes Schedule H/X pharmaceutical drugs. It restricts guidance to clinical triage, comfort care, and doctor consultation preparation.</p>
      </div>
      <div class="feature-box" style="margin-bottom: 12px;">
        <h4 style="color: #ef4444;">🚨 Automated Red-Flag Escalation Engine</h4>
        <p>Deterministic regex and semantic filters intercept acute distress (crushing chest pain, FAST stroke symptoms) and instantly launch emergency ambulance protocols.</p>
      </div>
      <div class="feature-box">
        <h4 style="color: #38bdf8;">🇮🇳 Grounded in Indian Clinical Standards</h4>
        <p>Protocols strictly align with ICMR, RSSDI (Diabetes), and CSI (Cardiology) guidelines tailored for South Asian metabolic risk profiles.</p>
      </div>

      <div class="speaker-note">
        <strong>🎙️ Speaker Note:</strong> "Safety was our absolute first line of code. If an acute symptom is recognized, conversational AI stops, and emergency medical triage takes over."
      </div>
    </div>

    <!-- SLIDE 6 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 6 • Business Model & Roadmap</span>
        <h2 class="slide-title">Market Potential & 90-Day Execution Plan</h2>
        <div class="slide-subtitle">Capturing Value Across Families and Healthcare Providers</div>
      </div>

      <div class="grid-2">
        <div class="feature-box">
          <h4>💼 B2B Hospital & Clinic OPD SaaS</h4>
          <p>Hospitals subscribe to PersonalDoc intake terminals to pre-triage patients, eliminating front-desk bottlenecks and generating standardized EHR summaries.</p>
        </div>
        <div class="feature-box">
          <h4>📱 B2C Freemium Family Health Tier</h4>
          <p>Free for 4 family members; premium tier includes automated WhatsApp reminders, unlimited cloud storage, and pediatrician check-ins.</p>
        </div>
      </div>

      <div style="margin-top: 18px; padding: 16px; background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
        <h4 style="font-size: 13px; color: #f8fafc; margin-bottom: 8px;">Honest AWS deployment path:</h4>
        <p style="font-size: 12px; color: #94a3b8;">Deploy the existing Node/Express server to Amazon App Runner, store GEMINI_API_KEY in App Runner secrets, and add CloudWatch monitoring. Future AWS services can be introduced only when the corresponding product requirements are implemented.</p>
      </div>
    </div>

    <!-- SLIDE 7 -->
    <div class="slide-card">
      <div>
        <span class="slide-tag">Slide 7 • Conclusion</span>
        <h2 class="slide-title">PersonalDoc: Healthcare from the Home to the Hospital</h2>
        <div class="slide-subtitle">Empowering Families, Accelerating Clinical Decisions</div>
        <p style="color: #cbd5e1; font-size: 14px; margin-top: 16px; line-height: 1.6;">
          PersonalDoc transforms home health anxiety into structured medical intelligence. It respects doctor time, protects patient safety, and is ready for honest deployment on AWS without overstating the services currently in use.
        </p>
      </div>

      <div style="background: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="font-size: 16px; color: #f59e0b; font-weight: 800;">Aarav Singh Hada</h3>
          <p style="font-size: 12px; color: #94a3b8;">Founder & Full-Stack Developer</p>
        </div>
        <div style="font-size: 12px; color: #cbd5e1; text-align: right;">
          <p>������ +91-9828263561</p>
          <p>✉️ aaravpratapsinghhada07@gmail.com</p>
        </div>
      </div>
    </div>

    <!-- BONUS: JUDGE Q&A SECTION -->
    <div style="margin-top: 40px;">
      <h2 style="font-size: 20px; font-weight: 800; color: #f59e0b; margin-bottom: 16px;">
        🎯 Hackathon Judge Q&A Defense Sheet
      </h2>

      <div class="qa-box">
        <h4>Q1: How do you prevent AI hallucinations or dangerous medical advice?</h4>
        <p><strong>Answer:</strong> PersonalDoc never provides final clinical diagnoses or prescribes Schedule H/X drugs. It strictly conducts structured triage and prepares a patient briefing for an in-person physician. Furthermore, deterministic red-flag filters intercept cardiac or stroke symptoms and immediately display emergency ambulance numbers (112, 108).</p>
      </div>

      <div class="qa-box">
        <h4>Q2: How is the current AI architecture implemented?</h4>
        <p><strong>Answer:</strong> The Node/Express server calls Google Gemini through the official SDK. The browser never receives the Gemini key. The app adds structured prompts, red-flag guidance, and clear medical disclaimers around the AI experience.</p>
      </div>

      <div class="qa-box">
        <h4>Q3: How does this comply with India's DPDP Act and health privacy laws?</h4>
        <p><strong>Answer:</strong> By default, all patient records and vitals live in encrypted client-side storage. Users can export their full health record as an offline JSON file or wipe it in one click, ensuring complete data sovereignty.</p>
      </div>

      <div class="qa-box">
        <h4>Q4: How does this differ from Practo or 1mg?</h4>
        <p><strong>Answer:</strong> Practo and 1mg focus on appointment booking and medicine delivery. PersonalDoc solves the actual 5-minute consultation dilemma by synthesizing unstructured symptoms into a 1-page clinical prep sheet that physical doctors can read in 20 seconds.</p>
      </div>
    </div>

  </div>

</body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });

  // Doctor Consultation Chat
  app.post("/api/doctor/consult", async (req, res) => {
    try {
      const {
        patientProfile,
        messages = [],
        vitals = {},
        mode = "general_consultation",
        categoryFocus,
        language = "English",
      } = req.body;

      const ai = getAi();

      const systemPrompt = `You are Dr. Ananya Sharma, MD, along with Dr. Julian Reyes, MD, compassionate and experienced clinical physicians acting as the Personal Doctor Companion in "PersonalDoc" (India & Global Health Edition).
Your clinical practice strictly follows the guidelines of the Indian Council of Medical Research (ICMR), Research Society for the Study of Diabetes in India (RSSDI), Cardiological Society of India (CSI), and Indian Academy of Pediatrics (IAP).

CONSULTATION PREFERRED LANGUAGE: ${language}
- If language is "Hinglish": Reply in warm, conversational Hinglish (mixing colloquial Hindi & medical English terms like "Aapka blood pressure thoda elevated hai", "Crocin/Paracetamol le sakte hain", "Aapko koi chest pain ya dizziness feel ho rahi hai?").
- If language is "Hindi": Reply in polite, clear Hindi with medical terms in brackets if helpful.
- If language is "English": Reply in empathetic, articulate clinical English.

Your mission: Provide an authentic, culturally attuned, reassuring, and clinically rigorous doctor consultation experience for Indian individuals and families that saves them anxiety, organizes their history, and prepares them thoroughly for physical OPD visits.

PATIENT PROFILE:
- Name: ${patientProfile?.name || "Patient"}
- Age: ${patientProfile?.age || "Not specified"}
- Biological Sex: ${patientProfile?.gender || "Not specified"}
- Family Member Role: ${patientProfile?.memberType || "self"} (e.g. self, beti/child, pitaji/mataji/elderly parent, spouse)
- Known Medical Conditions: ${patientProfile?.conditions?.length ? patientProfile.conditions.join(", ") : "None reported"}
- Current Medications: ${patientProfile?.medications?.length ? patientProfile.medications.join(", ") : "None reported"}
- Allergies: ${patientProfile?.allergies?.length ? patientProfile.allergies.join(", ") : "None reported"}
- Recent Vitals logged:
  * Blood Pressure: ${vitals?.bp ? `${vitals.bp.systolic}/${vitals.bp.diastolic} mmHg` : "Not recorded today"}
  * Blood Sugar: ${vitals?.sugar ? `${vitals.sugar.value} mg/dL (${vitals.sugar.timing || "random"})` : "Not recorded"}
  * Heart Rate: ${vitals?.heartRate ? `${vitals.heartRate} bpm` : "Not recorded"}
  * Temperature: ${vitals?.temperature ? `${vitals.temperature} °F` : "Not recorded"}

CONSULTATION CONTEXT:
- Mode: ${mode}
- Category Focus: ${categoryFocus || "Comprehensive Family Care"}

CULTURAL & CLINICAL EXPERTISE FOR INDIAN PATIENTS:
1. Language & Communication:
   - You effortlessly understand English, Hinglish (e.g. "sir dard", "chakkar aa rahe hain", "pet kharab", "khansi bukhar", "gas/acidity ho gayi hai", "sugar badh gayi", "kamzori lag rahi hai"), and Hindi.
   - You reply warmly in clear, accessible language, explaining clinical terms in empathetic terms that Indian patients and their families readily understand.
2. Asian Indian Phenotype & Cardiometabolic Vulnerability:
   - High risk of early-onset Type 2 Diabetes and Coronary Artery Disease (CAD) at younger ages and lower BMIs (overweight threshold is BMI > 23 kg/m² in India per ICMR).
   - High prevalence of severe Vitamin D3 deficiency (>70% of Indians) and Vitamin B12 deficiency (especially among vegetarians).
   - Post-prandial glycemic spikes due to carbohydrate-heavy Indian staples (white rice, wheat phulkas, potatoes, mithai).
3. Tropical & Seasonal Illness Awareness:
   - Differentiate viral fever from Dengue, Malaria, Typhoid, and Chikungunya during post-monsoon and seasonal shifts.
   - For Dengue: Alert patients on red flags (platelet drop < 1 Lakh, severe abdominal pain, persistent vomiting, mucosal bleeding). Strictly caution against taking NSAIDs (Ibuprofen, Brufen, Aspirin) during fever/dengue suspicion; advise safe Paracetamol (Crocin/Dolo 650) only.
4. Indian Dietary & Home Supportive Care:
   - Offer evidence-based medical advice harmonized with safe, traditional home comfort measures: warm ginger-tulsi water, steam inhalation, haldi doodh (turmeric milk) for throat irritation, ORS (Electral / WHO-ORS) or thin chaas/coconut water for dehydration, and light moong dal khichdi.
   - Advise on salt reduction (cutting down achar/pickles, papad, namkeens, restricting total salt to < 5g/1 tsp daily per WHO/ICMR).
5. Triage Levels (Indian Emergency Context):
   * 'emergency': Immediate hospital / ER needed. Instruct to call 112 (National Emergency) or 108 (Ambulance) immediately (e.g., crushing chest pain radiating to left jaw/arm, F.A.S.T. stroke signs, respiratory failure, severe uncontrolled bleeding).
   * 'urgent': Needs in-person clinical review at clinic/OPD within 12-24 hours.
   * 'routine': Can be addressed at scheduled doctor appointment or regular monitoring.
   * 'self_care': Benign, self-limiting issue manageable with supportive home measures.

Response Format: Return VALID JSON ONLY with this exact JSON structure:
{
  "reply": "Your warm, natural doctor voice response. Mention clinical possibilities, dietary guidance, and reassurance clearly.",
  "triageLevel": "emergency" | "urgent" | "routine" | "self_care",
  "triageLabel": "Short summary label like 'Routine Follow-up' or 'Urgent 112/108 Emergency Protocol'",
  "redFlagsIdentified": ["list of red flag symptoms to immediately watch for"],
  "probableConsiderations": ["1-3 potential clinical possibilities or physiological explanations in Indian health context"],
  "suggestedNextReplies": ["3 short convenient reply options the patient can tap with one touch"],
  "doctorVisitQuestions": ["2-3 specific questions for their consulting Indian physician at the clinic"],
  "homeCareSteps": ["2-3 practical, safe comfort, hydration, or dietary steps"]
}`;

      if (!ai) {
        // High quality medical simulation fallback if key is missing
        const lastUserMsg = messages[messages.length - 1]?.content || "";
        const isChild = patientProfile?.memberType === "child";
        const isElderly = patientProfile?.memberType === "elderly";

        let fallbackReply = `Namaste ${patientProfile?.name?.split(" ")[0] || "there"}, I'm Dr. Ananya Sharma. Thank you for sharing what you're experiencing. `;
        let triage = "routine";
        let triageLabel = "Clinical Guidance & Monitoring";
        let considerations = ["Symptomatic evaluation in progress", "Common physiological response in Indian climate & diet"];
        let redFlags = ["Sudden crushing chest tightness or pain radiating to left arm", "Acute breathlessness at rest", "Signs of stroke (F.A.S.T.)"];
        let suggestions = ["It started yesterday morning", "It feels moderate, about 4/10", "I have taken Paracetamol only"];
        let doctorQuestions = ["Should we run a routine CBC, HbA1c, and Vitamin D3/B12 panel?", "Are there specific dietary triggers in my meals I should modify?"];
        let homeCare = ["Rest in a well-ventilated, quiet room", "Stay well-hydrated with warm water, thin chaas, or coconut water", "Keep a symptom log with time and meals"];

        if (lastUserMsg.toLowerCase().includes("pressure") || mode === "blood_pressure") {
          fallbackReply += `Regarding your blood pressure: I'm reviewing your latest readings. For South Asian individuals, maintaining BP under 130/80 mmHg per Indian Hypertension Guidelines (IHG-IV) is critical to protect kidneys and heart health. Have you noticed any morning headaches, neck tension, or dizziness? Also, please watch your daily sodium intake from pickles (achar), papad, and packaged namkeens.`;
          considerations = ["Essential hypertension variance", "Workplace or traffic stress / autonomic fluctuation", "High dietary sodium (achar, papad, namkeen)"];
          suggestions = ["No headache or vision changes", "Stress and long commute recently", "Took my Telmisartan / morning BP medicine"];
          doctorQuestions = ["Is my current dosage keeping me safely below 130/80 mmHg?", "Should we check serum electrolytes and kidney function (KFT)?"];
          homeCare = ["Practice 15 minutes of calming Anulom-Vilom pranayama", "Restrict table salt to under 1 flat teaspoon (5g) daily", "Take regular brisk morning walks"];
        } else if (lastUserMsg.toLowerCase().includes("sugar") || lastUserMsg.toLowerCase().includes("glucose") || mode === "blood_sugar") {
          fallbackReply += `Blood sugar regulation is a key pillar of Indian family health. Per RSSDI guidelines, our goal for fasting is 80-115 mg/dL, and under 140-160 mg/dL two hours post-meal. Indian meals with high refined carbohydrate content (white rice, maida, potatoes) often trigger quick post-meal spikes. Pairing rotis with whole dal, sprouts, or paneer significantly blunts this spike. Are you feeling any shakiness, sudden sweating, or excessive thirst?`;
          considerations = ["Post-prandial glycemic spike following carb-rich meal", "Medication timing relative to breakfast/dinner", "Metabolic glycemic variability"];
          suggestions = ["Fasting reading before breakfast", "2 hours post-dinner check", "Feeling mild dizziness / hunger pangs"];
          doctorQuestions = ["What is my target HbA1c goal?", "Do I need to adjust medication timing (e.g. Metformin / Teneligliptin)?"];
          homeCare = ["Take a gentle 15-minute walk after lunch and dinner", "Include high-fiber salads, cucumber, and moong dal in meals", "Keep glucose tablets or sugar handy for hypoglycemia"];
        } else if (isChild || mode === "child_milestone") {
          fallbackReply += `When assessing little ones like ${patientProfile?.name || "your child"}, alertness and hydration are our foremost clinical guideposts. Is the child active, playful, making regular wet diapers, and accepting fluids like coconut water, milk, or nimbu pani? In India, seasonal viral fevers and mosquito-borne illnesses are common, so we monitor fever patterns and hydration closely.`;
          considerations = ["Common pediatric viral illness", "Teething or growth spurt", "Seasonal weather change / allergic reaction"];
          suggestions = ["Active, drinking fluids normally", "Fussy with mild fever, sleeping more", "Normal wet diapers and appetite"];
          doctorQuestions = ["What is the exact weight-based Paracetamol / Crocin dosage?", "Are all IAP vaccines up to date for this age?"];
          homeCare = ["Ensure frequent sips of ORS, coconut water, or warm milk", "Give Paracetamol strictly per weight if fever exceeds 100°F", "Use full-sleeve cotton clothing for mosquito protection"];
        } else if (isElderly || mode === "elderly_care") {
          fallbackReply += `For our respected senior family members, we pay close attention to medication timings, joint care, and balance. Have there been any recent stumbles, dizziness when rising from bed, or difficulty with knees (Sandhivaat)? Also ensure the bathroom floor has dry anti-skid mats, and they drink adequate fluids throughout the day.`;
          considerations = ["Knee Osteoarthritis (Sandhivaat) exacerbation", "Postural hypotension on standing", "Mild electrolyte or hydration deficit"];
          suggestions = ["Mild knee stiffness, but walking with support", "Taking morning diabetes & BP medicines regularly", "Appetite has been slightly lower"];
          doctorQuestions = ["Can we review all daily tablets to avoid polypharmacy interactions?", "Would physical therapy or knee strengthening exercises help?"];
          homeCare = ["Use Western commode height and bathroom grab-bars", "Encourage 6-8 glasses of warm water or thin buttermilk", "15 minutes of gentle morning sunlight"];
        } else {
          fallbackReply += `I hear your concern about "${lastUserMsg.slice(0, 45)}...". To understand this clearly, could you tell me how long this has been present, and whether you've noticed any fever, body ache, or changes after food?`;
        }

        return res.json({
          reply: fallbackReply,
          triageLevel: triage,
          triageLabel,
          redFlagsIdentified: redFlags,
          probableConsiderations: considerations,
          suggestedNextReplies: suggestions,
          doctorVisitQuestions: doctorQuestions,
          homeCareSteps: homeCare,
        });
      }

      // Convert conversation history into Gemini format
      const formattedHistory = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedHistory,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        return res.json({
          reply: responseText,
          triageLevel: "routine",
          triageLabel: "Doctor Consultation",
          redFlagsIdentified: [],
          probableConsiderations: ["Comprehensive medical evaluation recommended"],
          suggestedNextReplies: ["Tell me more about what to expect", "What should I monitor next?", "Can you prepare a note for my clinic visit?"],
          doctorVisitQuestions: ["What diagnostic tests would be most helpful?", "When should I schedule a follow-up?"],
          homeCareSteps: ["Keep comfortable and hydrated", "Track any new changes in your symptom log"],
        });
      }
    } catch (err: unknown) {
      console.error("Consultation error:", err);
      const errMsg = err instanceof Error ? err.message : "Consultation service encountered an issue";
      return res.status(500).json({
        error: errMsg,
        reply: "I am having a brief connection delay with the medical knowledge system. In the meantime, if you are experiencing severe chest pain, shortness of breath, sudden numbness, or heavy bleeding, please call emergency services immediately.",
        triageLevel: "routine",
      });
    }
  });

  // Clinical Visit Summary Generator
  app.post("/api/doctor/generate-summary", async (req, res) => {
    try {
      const { patientProfile, messages = [], vitals = {}, chiefComplaint } = req.body;
      const ai = getAi();

      const consultationLog = messages
        .map((m: { role: string; content: string }) => `${m.role === "assistant" ? "Doctor" : "Patient"}: ${m.content}`)
        .join("\n\n");

      const prompt = `Synthesize a professional, concise, clinical "Patient Visit Prep & Intake Handoff Sheet" for an in-person physician based on this patient consultation.

Patient: ${patientProfile?.name || "Anonymous"}, Age: ${patientProfile?.age || "N/A"}, Sex: ${patientProfile?.gender || "N/A"}, Member Role: ${patientProfile?.memberType || "Self"}
Known Conditions: ${patientProfile?.conditions?.join(", ") || "None reported"}
Medications: ${patientProfile?.medications?.join(", ") || "None"}
Allergies: ${patientProfile?.allergies?.join(", ") || "NKDA"}
Chief Complaint: ${chiefComplaint || "General consultation"}
Vitals on Record: BP ${vitals?.bp ? `${vitals.bp.systolic}/${vitals.bp.diastolic} mmHg` : "N/A"}, Sugar ${vitals?.sugar ? `${vitals.sugar.value} mg/dL` : "N/A"}, Heart Rate ${vitals?.heartRate ? `${vitals.heartRate} bpm` : "N/A"}

Consultation transcript:
${consultationLog}

Return a valid JSON object with:
{
  "visitTitle": "Concise summary title, e.g., 'Primary Care Visit Preparation - Recurrent Tension Headaches'",
  "historyOfPresentIllness": "A 2-3 sentence clinical HPI summary written in professional medical terminology for a physician to read in 20 seconds.",
  "pertinentPositives": ["list of positive symptoms reported by patient"],
  "pertinentNegatives": ["pertinent negatives ruled out or denied"],
  "recommendedDoctorQuestions": ["4-5 high-yield, specific questions the patient should ask their doctor"],
  "differentialToExplore": ["2-4 potential diagnoses for the physician to evaluate"],
  "suggestedWorkup": ["Relevant tests or exams to consider, e.g. Basic Metabolic Panel, EKG, Thyroid panel"],
  "emergencyRedFlags": ["Specific warning signs that warrant ER evaluation before the appointment"]
}`;

      if (!ai) {
        return res.json({
          visitTitle: `Clinical Handoff & Visit Preparation for ${patientProfile?.name || "Patient"}`,
          historyOfPresentIllness: `Patient presents for clinical consultation regarding ${chiefComplaint || "health monitoring and symptom evaluation"}. Symptoms discussed with PersonalDoc physician companion. Pertinent timeline and functional impact logged for primary physician review.`,
          pertinentPositives: ["Symptom onset discussed", "Active vitals tracking"],
          pertinentNegatives: ["No reported sudden loss of consciousness", "No unmanageable acute respiratory distress reported"],
          recommendedDoctorQuestions: [
            "Given my symptom frequency, what is the most likely etiology?",
            "Are there baseline laboratory panels or imaging studies recommended?",
            "Do any of my current daily medications or supplements interact with my symptoms?",
            "What specific threshold of change should prompt me to contact your on-call clinic line?",
          ],
          differentialToExplore: ["Primary symptom investigation", "Lifestyle/stress-induced exacerbation", "Metabolic/hydration variance"],
          suggestedWorkup: ["Comprehensive Physical Examination", "Targeted vital trend review", "Routine metabolic blood profile if indicated"],
          emergencyRedFlags: ["Sudden severe worsening of pain", "Difficulty breathing or chest tightness", "High fever with neck stiffness"],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: unknown) {
      console.error("Summary error:", err);
      return res.status(500).json({ error: "Failed to generate visit summary" });
    }
  });

  // Lab Report & Medication Explainer
  app.post("/api/doctor/explain-lab", async (req, res) => {
    try {
      const { labText, labCategory } = req.body;
      const ai = getAi();

      const prompt = `You are Dr. Ananya Sharma, MD, an expert clinical physician at PersonalDoc India. A patient or their family has brought in the following medical diagnostic report (e.g. from Dr Lal PathLabs, Metropolis, SRL, Apollo Diagnostics, Thyrocare, or hospital lab) or prescription to understand:
Category: ${labCategory || "General Lab / Health Package Panel"}
Content:
"""${labText}"""

Explain this in crystal-clear, reassuring language tailored for Indian patients. Reference Indian clinical diagnostic standards (ICMR, RSSDI for HbA1c/Sugar, CSI for Lipid profiles, IAP for pediatric reports).
Cover what each test measures, normal reference limits in India, what borderline/elevated numbers mean (e.g., Vitamin D deficiency, elevated HbA1c, fatty liver markers like SGPT/ALT, high triglycerides, Dengue NS1/platelets), and practical, polite questions to ask their consulting doctor in the physical OPD visit.

Return a valid JSON object:
{
  "overview": "2-3 sentences summarizing the overall panel and its primary clinical significance in the Indian health context",
  "analyzedItems": [
    {
      "name": "Test or biomarker name",
      "value": "Value reported if found, or parameter description",
      "normalRange": "Standard reference range in Indian diagnostic labs",
      "status": "normal" | "borderline" | "elevated" | "low" | "information",
      "explanation": "Plain, friendly explanation of what this test does and why it matters"
    }
  ],
  "doctorTalkingPoints": ["3-4 clear questions to ask their doctor about these results at their OPD visit"],
  "lifestyleSupport": ["2-3 evidence-based dietary (e.g. Indian meals, fiber, dal/sprouts) or daily habits that support healthy ranges here"]
}`;

      if (!ai) {
        return res.json({
          overview: "This laboratory review translates clinical diagnostic biomarkers into clear insights according to Indian clinical standards, so you can have an informed, productive conversation with your doctor.",
          analyzedItems: [
            {
              name: "Key Biomarkers in Diagnostic Report",
              value: "Documented in report",
              normalRange: "Per ICMR / NABL Accredited Indian Diagnostic Standards",
              status: "information",
              explanation: "Laboratory numbers reflect dynamic snapshots of metabolic, liver, kidney, or cardiovascular health.",
            },
          ],
          doctorTalkingPoints: [
            "How do these numbers compare to my previous baseline tests?",
            "Do we need a repeat check for HbA1c, Lipid Profile, or Vitamin D3 in 3 months?",
            "What specific dietary adjustments in my daily Indian meals would best support these numbers?",
          ],
          lifestyleSupport: ["Stay well hydrated with warm water and thin chaas", "Maintain regular morning walks and balanced whole-grain meals with dal/sprouts"],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: unknown) {
      console.error("Lab explain error:", err);
      return res.status(500).json({ error: "Failed to analyze lab" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PersonalDoc server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
