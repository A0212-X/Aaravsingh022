import React, { useState } from "react";
import {
  Baby,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  Calculator,
  ShieldAlert,
  Calendar,
  HeartHandshake,
} from "lucide-react";
import { FamilyMember } from "../types";
import { CHILD_MILESTONES_CATALOG } from "../data/initialData";

interface ChildMilestonesCenterProps {
  member: FamilyMember;
  onConsultDoctor: (prompt: string) => void;
}

export const ChildMilestonesCenter: React.FC<ChildMilestonesCenterProps> = ({
  member,
  onConsultDoctor,
}) => {
  const [selectedAge, setSelectedAge] = useState("4 Years");
  const [milestones, setMilestones] = useState(CHILD_MILESTONES_CATALOG);
  const [childWeightLbs, setChildWeightLbs] = useState<number>(34); // ~15.4 kg

  const toggleMilestone = (index: number) => {
    const updated = [...milestones];
    updated[index].checked = !updated[index].checked;
    setMilestones(updated);
  };

  const completedCount = milestones.filter((m) => m.checked).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  // Dosage math
  const weightKg = childWeightLbs * 0.453592;
  const acetaminophenMinMg = Math.round(weightKg * 10);
  const acetaminophenMaxMg = Math.round(weightKg * 15);
  const ibuprofenMinMg = Math.round(weightKg * 5);
  const ibuprofenMaxMg = Math.round(weightKg * 10);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
              <Baby className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pediatric Health & Developmental Milestones Hub
              </h2>
              <p className="text-xs text-slate-500">
                Child: {member.name} ({member.age}y) • CDC & Indian Academy of Pediatrics (IAP) Developmental Framework
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onConsultDoctor(
                  `Dr. Ananya, I'd like a pediatric check for ${member.name} (age ${member.age}). We have completed ${completedCount} of ${milestones.length} developmental milestones for this age stage. What are the key developmental markers we should look for next?`
                )
              }
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Pediatric Consult</span>
            </button>
          </div>
        </div>

        {/* Milestone Progress Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Milestone Progress ({selectedAge})
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
                {progressPercent}%
                <span className="text-xs font-sans text-slate-500 font-normal">
                  ({completedCount}/{milestones.length} logged)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-[#176b4d] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Tracks language, fine motor, social-emotional, and cognitive progress.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Age Stage Evaluation
            </span>
            <div className="my-2">
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-[#176b4d] cursor-pointer"
              >
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year (12 Months)</option>
                <option value="2 Years">2 Years (24 Months)</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years (Kindergarten)</option>
              </select>
              <span className="text-xs text-emerald-700 font-medium mt-2 inline-block">
                IAP / CDC Standard Benchmark
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Children develop in ranges. Share specific delay patterns with Dr. Ananya.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between text-xs">
            <span className="font-semibold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Pediatric Red Flags
            </span>
            <ul className="space-y-1 text-rose-900 my-1 text-[11px]">
              <li>• Fever &ge; 100.4°F (38°C) in infant under 3 months</li>
              <li>• Chest wall indrawing / fast breathing</li>
              <li>• High lethargy, difficult to arouse</li>
              <li>• Inability to keep fluids down / &lt;3 wet diapers in 24h</li>
            </ul>
            <span className="text-[10px] text-rose-700 font-medium">
              Requires immediate clinical triage or urgent care.
            </span>
          </div>
        </div>

        {/* Milestone Checklist */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">
            {selectedAge} Developmental Milestones Checklist:
          </h3>
          <div className="space-y-2">
            {milestones.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleMilestone(idx)}
                className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  item.checked
                    ? "bg-slate-50/90 border-slate-200 text-slate-800"
                    : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      item.checked ? "bg-[#176b4d] text-white" : "border border-slate-300 bg-white"
                    }`}
                  >
                    {item.checked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#176b4d] uppercase tracking-wide block">
                      {item.category}
                    </span>
                    <span className={`text-xs ${item.checked ? "font-medium text-slate-900 line-through opacity-80" : "text-slate-700"}`}>
                      {item.milestone}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-slate-400">
                  {item.checked ? "Achieved" : "In progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pediatric Fever & Weight-Based Safe Medication Dosage Calculator */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pediatric Weight-Based Fever Medication Reference
            </h3>
            <p className="text-xs text-slate-500">
              Pediatric dosages are determined strictly by current body weight, not age alone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Child's Weight (Pounds / lbs):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="6"
                max="120"
                value={childWeightLbs}
                onChange={(e) => setChildWeightLbs(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 font-mono focus:ring-1 focus:ring-[#176b4d]"
              />
              <span className="text-xs font-medium text-slate-500">lbs</span>
            </div>
            <span className="text-xs text-slate-500 block mt-2">
              Equivalent: ~{weightKg.toFixed(1)} kg
            </span>
          </div>

          {/* Acetaminophen (Paracetamol / Crocin / Tylenol) */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs flex flex-col justify-between">
            <div>
              <span className="font-semibold text-slate-900 block text-xs mb-1">
                Paracetamol / Acetaminophen
              </span>
              <span className="text-slate-500 block mb-1.5 text-[11px]">
                Standard: 10–15 mg/kg per dose
              </span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {acetaminophenMinMg} – {acetaminophenMaxMg} mg
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Every 4 to 6 hours as needed. Maximum 4–5 doses per 24 hours.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 mt-2">
              Use syringe / dropper provided with bottle.
            </span>
          </div>

          {/* Ibuprofen (Ibugesic / Motrin) */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs flex flex-col justify-between">
            <div>
              <span className="font-semibold text-slate-900 block text-xs mb-1">
                Ibuprofen (Children 6+ months)
              </span>
              <span className="text-slate-500 block mb-1.5 text-[11px]">
                Standard: 5–10 mg/kg per dose
              </span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {ibuprofenMinMg} – {ibuprofenMaxMg} mg
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Every 6 to 8 hours as needed with milk or food.
              </p>
            </div>
            <span className="text-[10px] text-amber-700 font-medium mt-2">
              Strictly avoid in infants younger than 6 months.
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Safety Advisory:</strong> Never administer Aspirin to children or teenagers due to the risk of Reye's syndrome. Double check the concentration (e.g. 120mg/5mL or 250mg/5mL) before dosing.
          </span>
        </div>
      </div>

    </div>
  );
};
