import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Info,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_LAB_REPORTS } from "../data/initialData";
import { LabAnalysisResult } from "../types";

interface LabExplainerCenterProps {
  onConsultDoctor: (prompt: string) => void;
}

export const LabExplainerCenter: React.FC<LabExplainerCenterProps> = ({
  onConsultDoctor,
}) => {
  const [labText, setLabText] = useState(SAMPLE_LAB_REPORTS[0].text);
  const [category, setCategory] = useState("Metabolic Panel");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LabAnalysisResult | null>({
    overview:
      "This Comprehensive Metabolic Panel provides a vital snapshot of kidney function, electrolyte balance, blood sugar homeostasis, and liver enzymes.",
    analyzedItems: [
      {
        name: "Fasting Glucose",
        value: "104 mg/dL",
        normalRange: "70 - 99 mg/dL",
        status: "elevated",
        explanation:
          "Slightly above the normal fasting ceiling, indicating mild impaired fasting glucose (prediabetic zone). Worth monitoring with HbA1c.",
      },
      {
        name: "eGFR (Kidney Filtration)",
        value: ">90 mL/min",
        normalRange: ">60 mL/min",
        status: "normal",
        explanation: "Excellent filtration rate indicating robust, healthy renal function.",
      },
      {
        name: "Electrolytes (Sodium / Potassium)",
        value: "140 / 4.3 mEq/L",
        normalRange: "135-145 / 3.5-5.0",
        status: "normal",
        explanation: "Normal physiological balance supporting nerve signaling, hydration, and cardiac rhythm.",
      },
      {
        name: "Liver Enzymes (ALT / AST)",
        value: "28 / 24 U/L",
        normalRange: "7-56 / 10-40",
        status: "normal",
        explanation: "Within optimal reference limits; no signs of active hepatic inflammation or cellular stress.",
      },
    ],
    doctorTalkingPoints: [
      "Should we check a baseline HbA1c to get a 3-month average of my blood sugar?",
      "Are there specific dietary changes like lowering simple refined sugars that would bring fasting glucose under 100?",
      "When is the recommended date for repeat follow-up lab screening?",
    ],
    lifestyleSupport: [
      "Emphasize fiber-rich vegetables, legumes, and lean proteins at breakfast to stabilize glucose curves.",
      "Take a 10-15 minute walk after main meals to encourage muscle glucose uptake.",
    ],
  });

  const handleAnalyze = async () => {
    if (!labText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/doctor/explain-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labText,
          labCategory: category,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Lab explain error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lab Report & Biomarker Decryptor
            </h2>
            <p className="text-xs text-slate-500">
              Translate diagnostic lab values and pathology panels into plain, clinically grounded explanations.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Sample Reports:</span>
          {SAMPLE_LAB_REPORTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setLabText(sample.text);
                setCategory(sample.title);
              }}
              className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Paste diagnostic lab test values or type biomarkers:
          </label>
          <textarea
            rows={4}
            value={labText}
            onChange={(e) => setLabText(e.target.value)}
            placeholder="e.g. Total Cholesterol 220, HDL 45, LDL 140, Fasting Blood Sugar 105..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !labText.trim()}
            className="bg-[#176b4d] hover:bg-[#12583f] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span>Dr. Ananya is reviewing biomarkers...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain in Plain Language</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#176b4d]" />
              Clinical Biomarker Analysis
            </h3>
            <button
              onClick={() =>
                onConsultDoctor(
                  `Dr. Ananya, regarding these lab results (${category}): ${result.overview} Can we explore these findings further?`
                )
              }
              className="text-xs font-medium text-[#176b4d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Discuss in Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-sky-50/50 border border-sky-100 text-xs text-slate-800 leading-relaxed">
            <span className="font-semibold text-[#176b4d] block mb-1">Executive Summary:</span>
            {result.overview}
          </div>

          {/* Itemized Breakdown Table / Cards */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-3">
              Biomarker Breakdown:
            </h4>
            <div className="space-y-2.5">
              {result.analyzedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="sm:w-1/3">
                    <span className="font-semibold text-slate-900 text-xs block">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-slate-800">
                        {item.value}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Ref: {item.normalRange}
                      </span>
                    </div>
                  </div>

                  <div className="sm:w-1/6">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase tracking-wide border ${
                        item.status === "normal"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : item.status === "elevated" || item.status === "high"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : item.status === "low"
                          ? "bg-sky-50 text-sky-800 border-sky-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="sm:w-1/2 text-slate-600 text-xs leading-relaxed">
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions to ask in-person doctor */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
            <span className="font-semibold text-slate-800 block text-xs mb-2">
              High-Yield Questions to Ask Your Primary Care Physician:
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {result.doctorTalkingPoints.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="text-[#176b4d] font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
