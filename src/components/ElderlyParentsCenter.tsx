import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Pill,
  ShieldAlert,
  Heart,
  Calendar,
  Share2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { FamilyMember } from "../types";
import { ELDERLY_CHECKLIST } from "../data/initialData";
import { copyTextToClipboard } from "../utils/medicalUtils";

interface ElderlyParentsCenterProps {
  member: FamilyMember;
  onConsultDoctor: (prompt: string) => void;
}

export const ElderlyParentsCenter: React.FC<ElderlyParentsCenterProps> = ({
  member,
  onConsultDoctor,
}) => {
  const [checklist, setChecklist] = useState(ELDERLY_CHECKLIST);
  const [copiedShare, setCopiedShare] = useState(false);

  // CDC STEADI Fall risk questions
  const [fallRisk, setFallRisk] = useState({
    fallenPastYear: false,
    feelsUnsteady: true,
    worriesAboutFalling: false,
  });

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.done).length;

  const handleCopyCaregiverUpdate = async () => {
    const text = `🏥 PersonalDoc Family Health Update for ${member.name} (Age ${member.age})
Date: ${new Date().toLocaleDateString()}
Daily Care Tasks Completed: ${completedCount}/${checklist.length}
- Morning Meds: Done
- Hydration Target: Active (Goal 1.5L)
- Fall Risk Status: ${fallRisk.feelsUnsteady ? "Mild unsteadiness noted - using support" : "Steady"}
Active Medications: ${member.medications.join(", ") || "None"}
Status: Resting comfortably.`;

    if (await copyTextToClipboard(text)) {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Elderly Parents & Senior Health Companion
              </h2>
              <p className="text-xs text-slate-500">
                Care recipient: {member.name} ({member.age}y) • Medication Safety, Fall Prevention, & Caregiver Routine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCaregiverUpdate}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Update</span>
                </>
              )}
            </button>
            <button
              onClick={() =>
                onConsultDoctor(
                  `Dr. Ananya, I need a geriatric review for ${member.name} (${member.age} yrs). We are managing medications (${member.medications.join(", ")}). Could you review any potential drug interactions, orthostatic dizziness risks, and cognitive check-ins?`
                )
              }
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Geriatric Consult</span>
            </button>
          </div>
        </div>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Today's Caregiver Routine
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
                {completedCount}/{checklist.length}
                <span className="text-xs font-sans text-slate-500 font-normal">Completed</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-[#176b4d] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Essential daily medication, hydration, and mobility check.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              CDC STEADI Fall Risk
            </span>
            <div className="my-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border inline-block ${
                fallRisk.fallenPastYear || (fallRisk.feelsUnsteady && fallRisk.worriesAboutFalling)
                  ? "bg-rose-50 text-rose-800 border-rose-200 font-bold"
                  : fallRisk.feelsUnsteady
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
                {fallRisk.feelsUnsteady ? "Moderate Vigilance" : "Low Risk"}
              </span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Remove loose rugs and cords. Bathroom night lights prevent 60% of senior night falls.
              </p>
            </div>
            <span className="text-[10px] text-slate-400">
              CDC STEADI Evidence-based protocol.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 flex flex-col justify-between text-xs">
            <span className="font-semibold text-[#176b4d] flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              Polypharmacy Vigilance
            </span>
            <p className="text-slate-700 my-1 leading-relaxed">
              Managing {member.medications.length} daily medications. Age-related metabolic slowdown increases drug sensitivity and dizziness risk.
            </p>
            <span className="text-[10px] text-slate-400">
              Consult Dr. Ananya before adding supplements.
            </span>
          </div>
        </div>

        {/* Daily Senior Care Checklist */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">
            Daily Senior Health Routine Checklist:
          </h3>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  item.done
                    ? "bg-slate-50/90 border-slate-200 text-slate-800"
                    : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      item.done ? "bg-[#176b4d] text-white" : "border border-slate-300 bg-white"
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-xs font-medium block ${item.done ? "line-through text-slate-500" : "text-slate-900"}`}>
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.detail}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-slate-400">
                  {item.done ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Polypharmacy & Medication Schedule Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Pill className="w-4 h-4 text-[#176b4d]" />
          Current Senior Medication Regimen ({member.name})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {member.medications.map((med, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-xs block">
                  {med}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Take with full glass of water. Report any lightheadedness or nausea to Dr. Ananya.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fall Risk Screener (CDC STEADI) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          Fall Risk Screening (CDC STEADI Protocol)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Answering "Yes" indicates higher fall probability, recommending supportive mobility aids and home adaptations.
        </p>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 cursor-pointer">
            <span className="text-xs text-slate-800 font-medium">
              1. Has {member.name.split(" ")[0]} fallen in the past 12 months?
            </span>
            <input
              type="checkbox"
              checked={fallRisk.fallenPastYear}
              onChange={(e) => setFallRisk({ ...fallRisk, fallenPastYear: e.target.checked })}
              className="w-4 h-4 accent-[#176b4d] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 cursor-pointer">
            <span className="text-xs text-slate-800 font-medium">
              2. Does {member.name.split(" ")[0]} feel unsteady when standing up or walking?
            </span>
            <input
              type="checkbox"
              checked={fallRisk.feelsUnsteady}
              onChange={(e) => setFallRisk({ ...fallRisk, feelsUnsteady: e.target.checked })}
              className="w-4 h-4 accent-[#176b4d] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 cursor-pointer">
            <span className="text-xs text-slate-800 font-medium">
              3. Does {member.name.split(" ")[0]} worry about falling during normal daily tasks?
            </span>
            <input
              type="checkbox"
              checked={fallRisk.worriesAboutFalling}
              onChange={(e) => setFallRisk({ ...fallRisk, worriesAboutFalling: e.target.checked })}
              className="w-4 h-4 accent-[#176b4d] cursor-pointer"
            />
          </label>
        </div>
      </div>

    </div>
  );
};
