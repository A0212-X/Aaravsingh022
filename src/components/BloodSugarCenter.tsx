import React, { useState } from "react";
import {
  Droplets,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Clock,
  Info,
  TrendingUp,
} from "lucide-react";
import { FamilyMember, VitalRecord } from "../types";
import { getBloodSugarStatus, calculateEstimatedA1c } from "../utils/medicalUtils";

interface BloodSugarCenterProps {
  member: FamilyMember;
  vitals: VitalRecord[];
  onAddVital: (vital: Omit<VitalRecord, "id" | "timestamp">) => void;
  onConsultDoctor: (prompt: string) => void;
}

export const BloodSugarCenter: React.FC<BloodSugarCenterProps> = ({
  member,
  vitals,
  onAddVital,
  onConsultDoctor,
}) => {
  const [sugarValue, setSugarValue] = useState<number>(110);
  const [sugarTiming, setSugarTiming] = useState<"fasting" | "before_meal" | "post_meal_2h" | "bedtime" | "random">("fasting");
  const [notes, setNotes] = useState("");
  const [showLogForm, setShowLogForm] = useState(false);

  // Filter blood sugar records
  const sugarRecords = vitals
    .filter((v) => v.memberId === member.id && v.type === "sugar" && v.sugarValue)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const latestSugar = sugarRecords[0] || {
    sugarValue: 108,
    sugarTiming: "fasting",
    timestamp: new Date().toISOString(),
  };

  const status = getBloodSugarStatus(latestSugar.sugarValue!, latestSugar.sugarTiming || "fasting");

  // Calculate average glucose of recorded entries
  const avgGlucose =
    sugarRecords.length > 0
      ? Math.round(sugarRecords.reduce((acc, curr) => acc + (curr.sugarValue || 0), 0) / sugarRecords.length)
      : latestSugar.sugarValue!;

  const estA1c = calculateEstimatedA1c(avgGlucose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVital({
      memberId: member.id,
      type: "sugar",
      sugarValue: Number(sugarValue),
      sugarTiming,
      notes: notes.trim() || undefined,
    });
    setNotes("");
    setShowLogForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
              <Droplets className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Blood Sugar & Glycemic Metabolic Hub
              </h2>
              <p className="text-xs text-slate-500">
                Patient: {member.name} • Clinical standards based on ADA & RSSDI Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Glucose</span>
            </button>
            <button
              onClick={() =>
                onConsultDoctor(
                  `Dr. Ananya, for ${member.name}, our latest blood sugar check is ${latestSugar.sugarValue} mg/dL (${latestSugar.sugarTiming}). Can you provide your clinical insight on this reading and dietary guidance?`
                )
              }
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#176b4d]" />
              <span>Discuss with Dr. Ananya</span>
            </button>
          </div>
        </div>

        {/* Current Reading Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Latest Glucose
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-1">
                {latestSugar.sugarValue}
                <span className="text-xs font-sans text-slate-500 font-normal ml-1">mg/dL</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${status.badgeBg}`}>
                  {status.label}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {latestSugar.sugarTiming?.replace("_", " ")}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              {new Date(latestSugar.timestamp).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Estimated HbA1c
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-1">
                ~{estA1c}
                <span className="text-xs font-sans text-slate-500 font-normal ml-1">%</span>
              </div>
              <span className={`text-xs font-medium mt-1.5 inline-block ${
                estA1c < 5.7 ? "text-emerald-700" : estA1c < 6.5 ? "text-amber-700" : "text-rose-700"
              }`}>
                {estA1c < 5.7 ? "Normal (<5.7%)" : estA1c < 6.5 ? "Prediabetes (5.7-6.4%)" : "Diabetic range (6.5%+)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Calculated via ADAG formula from logged glucose history.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Average Glucose
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-1">
                {avgGlucose}
                <span className="text-xs font-sans text-slate-500 font-normal ml-1">mg/dL</span>
              </div>
              <span className="text-xs text-slate-500 mt-1.5 inline-block">
                Across {sugarRecords.length || 1} logged checks
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Target: 80-130 fasting, &lt;180 2h post-meal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between text-xs">
            <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Clinical Guidance
            </span>
            <p className="text-slate-700 my-2 leading-relaxed">
              {status.advice}
            </p>
            <span className="text-[10px] text-slate-400">
              Always discuss with your doctor before changing medication dosages.
            </span>
          </div>
        </div>

        {/* Hypoglycemia Emergency Protocol Banner (Rule of 15) */}
        <div className="mt-5 p-3.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-900">
              Hypoglycemia Safety: Rule of 15 (Blood Sugar &lt; 70 mg/dL):
            </span>
            <p className="text-amber-800 leading-relaxed">
              If feeling shaky, sweaty, or reading is &lt;70: take 15g fast carbs (half cup juice, 3-4 glucose tabs, or 1 spoon sugar/honey). Rest 15 min, recheck. If still &lt;70, repeat once. If unresponsive, call 112 / 108 immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Log Form */}
      {showLogForm && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#176b4d]" />
              Record Glucose for {member.name}
            </h3>
            <button
              onClick={() => setShowLogForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Glucose Reading (mg/dL)
                </label>
                <input
                  type="number"
                  min="30"
                  max="600"
                  value={sugarValue}
                  onChange={(e) => setSugarValue(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Timing of Check
                </label>
                <select
                  value={sugarTiming}
                  onChange={(e) => setSugarTiming(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#176b4d]"
                >
                  <option value="fasting">Fasting (Morning before food)</option>
                  <option value="before_meal">Pre-Meal</option>
                  <option value="post_meal_2h">2 Hours After Meal</option>
                  <option value="bedtime">Bedtime</option>
                  <option value="random">Random / As-Needed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Notes (Meal content, insulin dose, physical activity)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 2 rotis with dal and salad, taken 1h after morning walk"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-[#176b4d] hover:bg-[#12583f] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Reading
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Log */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Blood Sugar History</span>
          <span className="text-xs text-slate-500 font-normal">
            {sugarRecords.length} recorded entries
          </span>
        </h3>

        {sugarRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No glucose entries yet for {member.name}. Click "Log Glucose" above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sugarRecords.map((item) => {
              const itemStatus = getBloodSugarStatus(item.sugarValue!, item.sugarTiming || "fasting");
              return (
                <div key={item.id} className="py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-base font-bold text-slate-900 font-mono">
                      {item.sugarValue}
                      <span className="text-xs text-slate-400 font-normal ml-1">mg/dL</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${itemStatus.badgeBg}`}>
                      {itemStatus.label}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {item.sugarTiming?.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.notes && (
                      <span className="max-w-xs truncate italic text-slate-600">
                        "{item.notes}"
                      </span>
                    )}
                    <span className="font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
