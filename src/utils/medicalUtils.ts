export function getBloodPressureCategory(systolic: number, diastolic: number): {
  category: "Normal" | "Elevated" | "Stage 1" | "Stage 2" | "Crisis";
  color: string;
  badgeBg: string;
  description: string;
  recommendation: string;
} {
  if (systolic > 180 || diastolic > 120) {
    return {
      category: "Crisis",
      color: "text-rose-700",
      badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
      description: "Hypertensive Crisis: Critical elevation requiring emergency medical evaluation.",
      recommendation: "If accompanied by chest tightness, breathing trouble, back pain, or limb numbness, dial 112 / 108 immediately.",
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: "Stage 2",
      color: "text-amber-700",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      description: "Stage 2 Hypertension (IHG-IV Guidelines): High cardiovascular strain for Asian Indian phenotype.",
      recommendation: "Consult your physician for medication review (e.g. Telmisartan/Amlodipine). Cut down pickles (achar), papad, and namkeen; restrict salt to < 5g/day.",
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: "Stage 1",
      color: "text-yellow-700",
      badgeBg: "bg-yellow-100 text-yellow-800 border-yellow-300",
      description: "Stage 1 Hypertension: Above optimal CSI (Cardiological Society of India) target.",
      recommendation: "Adopt DASH-Indian diet: increase green leafy vegetables, reduce fried snacks, practice 30 mins brisk walking or Anulom-Vilom pranayama.",
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: "Elevated",
      color: "text-sky-700",
      badgeBg: "bg-sky-100 text-sky-800 border-sky-300",
      description: "Pre-Hypertension: Slightly elevated above ideal Indian baseline (<120/80 mmHg).",
      recommendation: "Keep dietary sodium low (watch hidden salt in chaat masala & processed foods), maintain healthy hydration, and manage work stress.",
    };
  }
  return {
    category: "Normal",
    color: "text-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Optimal Blood Pressure: Well within healthy Indian cardiometabolic targets.",
    recommendation: "Continue balanced Indian home meals, daily physical movement, and regular blood pressure monitoring.",
  };
}

export function getBloodSugarStatus(value: number, timing: string): {
  status: "hypo" | "optimal" | "elevated" | "hyper";
  label: string;
  badgeBg: string;
  advice: string;
} {
  if (value < 70) {
    return {
      status: "hypo",
      label: "Hypoglycemia (Low Sugar)",
      badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
      advice: "Rule of 15: Immediately consume 15g fast-acting sugar (3 tsp sugar in water, 1/2 glass fruit juice, or 4-5 glucose biscuits). Recheck in 15 minutes.",
    };
  }

  const isFasting = timing === "fasting";
  // Per RSSDI Guidelines for Indian patients
  const upperLimit = isFasting ? 115 : 160;

  if (value <= upperLimit) {
    return {
      status: "optimal",
      label: "Within RSSDI Target",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      advice: "Excellent control! This value aligns with RSSDI (Research Society for the Study of Diabetes in India) targets.",
    };
  }
  if (value <= (isFasting ? 160 : 220)) {
    return {
      status: "elevated",
      label: "Elevated",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      advice: "Post-prandial glycemic spike. Balance carbohydrate-heavy meals (rice/roti) with protein (dal, sprouts, paneer, eggs) and take a 15-min walk.",
    };
  }
  return {
    status: "hyper",
    label: "Marked Hyperglycemia",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
    advice: "Significantly high blood sugar. Drink plenty of warm water to flush ketones, check for urine ketones if Type 1, and alert your consulting physician.",
  };
}

// Convert average glucose (mg/dL) to estimated HbA1c
export function calculateEstimatedA1c(avgGlucoseMgDl: number): number {
  // ADAG formula: eAG = (28.7 * A1c) - 46.7  =>  A1c = (eAG + 46.7) / 28.7
  return Math.round(((avgGlucoseMgDl + 46.7) / 28.7) * 10) / 10;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back when clipboard permissions are unavailable.
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);
  return copied;
}
