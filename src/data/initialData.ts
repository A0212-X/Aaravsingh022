import { FamilyMember, VitalRecord } from "../types";

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: "member-self",
    name: "Aarav (You)",
    age: 36,
    gender: "male",
    memberType: "self",
    relationship: "Self",
    bloodType: "B+",
    conditions: ["Mild Stage 1 Hypertension", "Vitamin D3 Deficiency (Common Indian Profile)"],
    medications: ["Telmisartan 40mg (Morning post-breakfast)", "Vitamin D3 60,000 IU (Weekly sachet in milk)"],
    allergies: ["Penicillin (mild skin rash)"],
    avatarColor: "bg-blue-600",
  },
  {
    id: "member-child",
    name: "Maya (Beti / Daughter)",
    age: 4,
    gender: "female",
    memberType: "child",
    relationship: "Daughter (4 yrs, 15.5 kg)",
    bloodType: "B+",
    conditions: ["Seasonal allergic rhinitis (Pollution & seasonal change)"],
    medications: ["Pediatric Cetirizine syrup 2.5ml as needed", "Calpol / Paracetamol 120mg/5ml SOS for fever"],
    allergies: ["No known drug allergies (NKDA)"],
    avatarColor: "bg-emerald-600",
  },
  {
    id: "member-elderly",
    name: "Ramesh (Pitaji / Father)",
    age: 71,
    gender: "male",
    memberType: "elderly",
    relationship: "Father (71 yrs)",
    bloodType: "O+",
    conditions: [
      "Type 2 Diabetes Mellitus (12 yrs)",
      "Bilateral Knee Osteoarthritis (Sandhivaat)",
      "Hypertension",
    ],
    medications: [
      "Metformin 500mg (Glycomet) twice daily with meals",
      "Teneligliptin 20mg daily with breakfast",
      "Telmisartan 40mg daily morning",
      "Calcium + Vitamin D3 (Shelcal 500)",
      "Low-dose Ecosprin 75mg post-lunch",
    ],
    allergies: ["Sulfa drugs (co-trimoxazole)"],
    avatarColor: "bg-amber-600",
  },
];

export const INITIAL_VITALS: VitalRecord[] = [
  // Blood pressure for Self (Aarav) - IHG targets
  {
    id: "v-bp-1",
    memberId: "member-self",
    timestamp: "2026-09-18T08:30:00.000Z",
    type: "bp",
    systolic: 126,
    diastolic: 82,
    heartRate: 72,
    notes: "Morning reading after 10 mins quiet rest & light yoga. Post morning black tea without sugar.",
  },
  {
    id: "v-bp-2",
    memberId: "member-self",
    timestamp: "2026-09-17T20:15:00.000Z",
    type: "bp",
    systolic: 134,
    diastolic: 86,
    heartRate: 78,
    notes: "Evening reading after long work commute in heavy traffic. Ate light dinner.",
  },
  {
    id: "v-bp-3",
    memberId: "member-self",
    timestamp: "2026-09-16T08:45:00.000Z",
    type: "bp",
    systolic: 122,
    diastolic: 80,
    heartRate: 70,
    notes: "Restful sleep, morning walk completed.",
  },
  {
    id: "v-bp-4",
    memberId: "member-self",
    timestamp: "2026-09-15T08:15:00.000Z",
    type: "bp",
    systolic: 130,
    diastolic: 84,
    heartRate: 74,
    notes: "Routine check before taking Telmisartan 40mg.",
  },

  // Blood sugar for Father (Ramesh) - RSSDI targets
  {
    id: "v-sugar-1",
    memberId: "member-elderly",
    timestamp: "2026-09-18T07:45:00.000Z",
    type: "sugar",
    sugarValue: 112,
    sugarTiming: "fasting",
    notes: "Fasting morning capillary blood glucose (Accu-Chek). Had methi water at 6 AM.",
  },
  {
    id: "v-sugar-2",
    memberId: "member-elderly",
    timestamp: "2026-09-17T14:00:00.000Z",
    type: "sugar",
    sugarValue: 148,
    sugarTiming: "post_meal_2h",
    notes: "2 hours post-lunch (2 phulkas, moong dal, bhindi sabzi, and fresh cucumber raita).",
  },
  {
    id: "v-sugar-3",
    memberId: "member-elderly",
    timestamp: "2026-09-16T08:00:00.000Z",
    type: "sugar",
    sugarValue: 124,
    sugarTiming: "fasting",
    notes: "Fasting morning reading before breakfast.",
  },
  {
    id: "v-sugar-4",
    memberId: "member-elderly",
    timestamp: "2026-09-15T21:30:00.000Z",
    type: "sugar",
    sugarValue: 142,
    sugarTiming: "post_meal_2h",
    notes: "2 hours post-dinner (vegetable khichdi with 1 tsp cow ghee).",
  },

  // Child vitals (Maya)
  {
    id: "v-temp-1",
    memberId: "member-child",
    timestamp: "2026-09-17T18:30:00.000Z",
    type: "temperature",
    temperature: 99.1,
    notes: "Mild evening body warmth, energetic, drinking nimbu pani and milk.",
  },
];

export const CHILD_MILESTONES_CATALOG = [
  {
    ageRange: "4-5 Years",
    category: "IAP Immunization & Prevention",
    milestone: "DPT 2nd Booster & OPV/IPV booster dose (per Indian Academy of Pediatrics IAP schedule)",
    checked: true,
  },
  {
    ageRange: "4 Years",
    category: "IAP Immunization & Prevention",
    milestone: "Typhoid Conjugate Vaccine (TCV) booster / MMR dose verification",
    checked: true,
  },
  {
    ageRange: "4 Years",
    category: "Social & Emotional",
    milestone: "Plays cooperatively with peers, shares toys, and engages in pretend family play",
    checked: true,
  },
  {
    ageRange: "4 Years",
    category: "Language & Communication",
    milestone: "Speaks fluently in home language (Hindi/English/regional), tells stories, understands 4-step instructions",
    checked: true,
  },
  {
    ageRange: "4 Years",
    category: "Cognitive & Learning",
    milestone: "Identifies colors, counts up to 10, understands morning vs evening concepts",
    checked: true,
  },
  {
    ageRange: "4 Years",
    category: "Physical & Motor",
    milestone: "Hops on one foot, climbs stairs alternately, pours water from small jug without spilling",
    checked: false,
  },
  {
    ageRange: "4 Years",
    category: "Tropical Disease Precautions",
    milestone: "Mosquito bite protection (full sleeves in evening, mosquito screen/repellent for Dengue/Malaria prevention)",
    checked: true,
  },
];

export const ELDERLY_CHECKLIST = [
  {
    id: "med-1",
    title: "Morning Diabetes & BP Medication Verification",
    detail: "Metformin 500mg (Glycomet) with breakfast + Teneligliptin 20mg + Telmisartan 40mg with warm water",
    done: true,
  },
  {
    id: "med-2",
    title: "Adequate Hydration (Goal: 1.5 - 2 Liters)",
    detail: "Seniors feel less thirst. Offer warm water, thin chaas (buttermilk with jeera), or coconut water across the day",
    done: true,
  },
  {
    id: "fall-1",
    title: "Bathroom & Floor Anti-Skid Safety Check",
    detail: "Ensure dry bathroom floors, anti-skid bathroom chappals/footwear, and secure wall grab-bars near commode",
    done: true,
  },
  {
    id: "knee-1",
    title: "Knee Osteoarthritis (Sandhivaat) Joint Care",
    detail: "Prefer Western commode/chair height; avoid deep floor squatting or sitting cross-legged for long periods",
    done: true,
  },
  {
    id: "mob-1",
    title: "Gentle Morning Sunlight & Stroll",
    detail: "15-20 mins mild walking in morning sun for natural Vitamin D3 synthesis and joint mobility",
    done: false,
  },
  {
    id: "med-3",
    title: "Evening Medication Verification",
    detail: "Metformin 500mg with dinner + Shelcal 500 (Calcium + D3) post-dinner",
    done: false,
  },
  {
    id: "help-1",
    title: "Govt Elderline Awareness",
    detail: "National Helpline for Senior Citizens: 14567 (free confidential medical and emotional support)",
    done: true,
  },
];

export const SAMPLE_LAB_REPORTS = [
  {
    id: "lab-metabolic",
    title: "Diabetes & Glycemic Panel (Dr Lal PathLabs / Metropolis standard)",
    text: `PATIENT: Ramesh (Age: 71 Y / Male)
Fasting Plasma Glucose (FBS): 118 mg/dL (Reference: 70 - 100 mg/dL) [ELEVATED - IMPAIRED FASTING]
Post-Prandial Blood Sugar (PPBS - 2 hrs post meal): 154 mg/dL (Reference: < 140 mg/dL) [ELEVATED]
HbA1c (Glycated Hemoglobin): 7.2 % (RSSDI Diabetic Target: < 7.0%, Optimal Senior: 7.0 - 7.5%) [FAIR CONTROL]
Estimated Average Glucose (eAG): 160 mg/dL
Serum Creatinine: 1.02 mg/dL (Reference: 0.7 - 1.2 mg/dL) [NORMAL]
Blood Urea Nitrogen (BUN): 18 mg/dL (Reference: 7 - 20 mg/dL) [NORMAL]
Urine Microalbumin / Creatinine Ratio: 24 mcg/mg (Reference: < 30 mcg/mg) [NORMAL - NO KIDNEY LEAK]`,
  },
  {
    id: "lab-cbc",
    title: "Complete Blood Count (CBC) with Platelet Count & ESR",
    text: `PATIENT: Aarav (Age: 36 Y / Male)
Hemoglobin: 14.6 g/dL (Reference: 13.0 - 17.0 g/dL) [NORMAL]
Total Leukocyte Count (WBC): 6,400 /uL (Reference: 4,000 - 11,000) [NORMAL]
Platelet Count: 2.35 Lakhs /uL (Reference: 1.50 - 4.50 Lakhs /uL) [NORMAL - DENGUE SCREEN NEGATIVE]
Erythrocyte Sedimentation Rate (ESR - Westergren): 12 mm/1st hr (Reference: < 15) [NORMAL]
Packed Cell Volume (PCV): 44.2 % (Reference: 40 - 50 %) [NORMAL]
Neutrophils: 62 % | Lymphocytes: 30 % | Eosinophils: 4 % | Monocytes: 4 %`,
  },
  {
    id: "lab-vitamins",
    title: "Vitamin D3 (25-OH) & Vitamin B12 Deficiency Panel",
    text: `PATIENT: Aarav (Age: 36 Y / Male)
25-Hydroxy Vitamin D (Total): 14.2 ng/mL (Deficiency: < 20 ng/mL, Insufficiency: 20-30, Sufficiency: 30-100) [DEFICIENT - WIDESPREAD INDIAN PHENOTYPE]
Vitamin B12 (Cyanocobalamin): 178 pg/mL (Reference: 211 - 911 pg/mL) [LOW / BORDERLINE DEFICIENT]
Serum Calcium: 9.3 mg/dL (Reference: 8.8 - 10.2 mg/dL) [NORMAL]
Serum Ferritin: 68 ng/mL (Reference: 30 - 400 ng/mL) [NORMAL]`,
  },
  {
    id: "lab-lipid",
    title: "Lipid Profile (Cardiological Society of India - Asian Indian Risk)",
    text: `PATIENT: Aarav (Age: 36 Y / Male)
Total Cholesterol: 214 mg/dL (Desirable: < 200 mg/dL) [BORDERLINE HIGH]
Triglycerides: 186 mg/dL (Normal: < 150 mg/dL) [ELEVATED - TYPICAL INDIAN ATHEROGENIC DYSLIPIDEMIA]
HDL Cholesterol ("Good"): 41 mg/dL (Optimal Men: > 40 mg/dL) [BORDERLINE LOW]
LDL Cholesterol ("Calculated"): 136 mg/dL (Optimal Indian Target: < 100 mg/dL) [ELEVATED]
Non-HDL Cholesterol: 173 mg/dL (Optimal: < 130 mg/dL) [ELEVATED]
VLDL Cholesterol: 37.2 mg/dL (Normal: 5 - 30 mg/dL) [ELEVATED]`,
  },
  {
    id: "lab-thyroid",
    title: "Thyroid Profile (T3, T4, Ultrasensitive TSH)",
    text: `PATIENT: Aarav (Age: 36 Y / Male)
Total Triiodothyronine (T3): 1.15 ng/mL (Reference: 0.80 - 2.00 ng/mL) [NORMAL]
Total Thyroxine (T4): 7.8 ug/dL (Reference: 5.1 - 14.1 ug/dL) [NORMAL]
TSH (Ultrasensitive Thyroid Stimulating Hormone): 3.24 uIU/mL (Reference: 0.35 - 4.94 uIU/mL) [NORMAL EUTHYROID]`,
  },
];

