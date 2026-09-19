import React, { useState } from "react";
import { 
  Activity, 
  Heart, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Stethoscope,
  Calendar,
  Sparkles
} from "lucide-react";
import { FamilyMember, VitalRecord } from "../types";
import { getBloodPressureCategory } from "../utils/medicalUtils";

interface BloodPressureCenterProps {
  member: FamilyMember;
  vitals: VitalRecord[];
  onAddVital: (vital: Omit<VitalRecord, "id" | "timestamp">) => void;
  onConsultDoctor: (prompt: string) => void;
}

export const BloodPressureCenter: React.FC<BloodPressureCenterProps> = ({
  member,
  vitals,
  onAddVital,
  onConsultDoctor,
}) => {
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [notes, setNotes] = useState("");
  const [showLogForm, setShowLogForm] = useState(false);

  // Filter BP records for this member
  const bpRecords = vitals
    .filter((v) => v.memberId === member.id && v.type === "bp" && v.systolic && v.diastolic)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const latestBp = bpRecords[0] || {
    systolic: 124,
    diastolic: 80,
    heartRate: 72,
    timestamp: new Date().toISOString(),
  };

  const category = getBloodPressureCategory(latestBp.systolic!, latestBp.diastolic!);
  const pulsePressure = (latestBp.systolic || 120) - (latestBp.diastolic || 80);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVital({
      memberId: member.id,
      type: "bp",
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      heartRate: Number(heartRate),
      notes: notes.trim() || undefined,
    });
    setNotes("");
    setShowLogForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Clinical Cardiovascular Care */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
              <Activity className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Blood Pressure Monitoring & Cardiovascular Care
              </h2>
              <p className="text-xs text-slate-500">
                Patient: {member.name} • Clinical protocol aligned with AHA/ACC & CSI Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Reading</span>
            </button>
            <button
              onClick={() =>
                onConsultDoctor(
                  `Dr. Ananya, my latest blood pressure reading for ${member.name} is ${latestBp.systolic}/${latestBp.diastolic} mmHg with a heart rate of ${latestBp.heartRate || 72} bpm. How does this look clinically, and what should we adjust?`
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
              Latest Reading
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-1">
                {latestBp.systolic}
                <span className="text-slate-400 font-normal">/</span>
                {latestBp.diastolic}
                <span className="text-xs font-sans text-slate-500 font-normal ml-1">mmHg</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${category.badgeBg}`}>
                  {category.category}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(latestBp.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {category.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Heart Rate (Pulse)
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-1">
                {latestBp.heartRate || 72}
                <span className="text-xs font-sans text-slate-500 font-normal ml-1">BPM</span>
              </div>
              <span className="text-xs text-emerald-700 font-medium mt-1.5 inline-block">
                Resting Range (60-100)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Monitored simultaneously during brachial cuff measurement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">
              Pulse Pressure
            </span>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight flex items-baseline gap-1">
                {pulsePressure}
                <span className="text-xs font-sans text-slate-500 font-normal ml-1">mmHg</span>
              </div>
              <span className={`text-xs font-medium mt-1.5 inline-block ${
                pulsePressure > 60 ? "text-amber-700" : "text-emerald-700"
              }`}>
                {pulsePressure > 60 ? "Widened (>60 mmHg)" : "Normal (30-50 mmHg)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Systolic minus diastolic, reflecting arterial compliance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 flex flex-col justify-between text-xs">
            <span className="font-semibold text-[#176b4d] flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Clinical Guidance
            </span>
            <p className="text-slate-700 my-2 leading-relaxed">
              {category.recommendation}
            </p>
            <span className="text-[10px] text-slate-400">
              Measure at rest seated with arm supported at heart level.
            </span>
          </div>
        </div>

        {/* AHA Stages Reference Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            Clinical Blood Pressure Classification:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-xs">Normal</span>
              <span className="text-[11px] text-emerald-700">&lt;120 / &lt;80</span>
            </div>
            <div className="p-2 rounded-lg bg-sky-50/80 border border-sky-200">
              <span className="font-bold text-sky-800 block text-xs">Elevated</span>
              <span className="text-[11px] text-sky-700">120-129 / &lt;80</span>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50/80 border border-yellow-200">
              <span className="font-bold text-yellow-800 block text-xs">Stage 1 HTN</span>
              <span className="text-[11px] text-yellow-700">130-139 / 80-89</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200">
              <span className="font-bold text-amber-800 block text-xs">Stage 2 HTN</span>
              <span className="text-[11px] text-amber-700">140+ / 90+</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-200">
              <span className="font-bold text-rose-800 block text-xs">Hypertensive Crisis</span>
              <span className="text-[11px] text-rose-700">&gt;180 / &gt;120</span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Form Section */}
      {showLogForm && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#176b4d]" />
              Record Blood Pressure for {member.name}
            </h3>
            <button
              onClick={() => setShowLogForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Systolic (Upper #) mmHg
                </label>
                <input
                  type="number"
                  min="70"
                  max="260"
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Diastolic (Lower #) mmHg
                </label>
                <input
                  type="number"
                  min="40"
                  max="160"
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pulse (Heart Rate bpm)
                </label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Context Notes (Arm used, posture, time since caffeine or exertion)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Left arm, seated at rest, before morning medication"
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

      {/* Historical Logs List */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Blood Pressure Log History</span>
          <span className="text-xs text-slate-500 font-normal">
            {bpRecords.length} recorded entries
          </span>
        </h3>

        {bpRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No blood pressure logs recorded yet for {member.name}. Click "Log Reading" above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bpRecords.map((item) => {
              const itemCat = getBloodPressureCategory(item.systolic!, item.diastolic!);
              return (
                <div key={item.id} className="py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-base font-bold text-slate-900 font-mono">
                      {item.systolic}/{item.diastolic}
                      <span className="text-xs text-slate-400 font-normal ml-1">mmHg</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${itemCat.badgeBg}`}>
                      {itemCat.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      Pulse: {item.heartRate || "--"} bpm
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
