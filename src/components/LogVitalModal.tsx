import React, { useState } from "react";
import { X, Activity, Droplets, Thermometer, Heart, Scale } from "lucide-react";
import { FamilyMember, VitalRecord } from "../types";

interface LogVitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  onAddVital: (vital: Omit<VitalRecord, "id" | "timestamp">) => void;
}

export const LogVitalModal: React.FC<LogVitalModalProps> = ({
  isOpen,
  onClose,
  member,
  onAddVital,
}) => {
  const [type, setType] = useState<"bp" | "sugar" | "temperature" | "heartRate">("bp");
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [sugarValue, setSugarValue] = useState(110);
  const [sugarTiming, setSugarTiming] = useState<"fasting" | "post_meal_2h" | "random">("fasting");
  const [temperature, setTemperature] = useState(98.6);
  const [heartRate, setHeartRate] = useState(72);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "bp") {
      onAddVital({
        memberId: member.id,
        type: "bp",
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        heartRate: Number(heartRate),
        notes: notes.trim() || undefined,
      });
    } else if (type === "sugar") {
      onAddVital({
        memberId: member.id,
        type: "sugar",
        sugarValue: Number(sugarValue),
        sugarTiming,
        notes: notes.trim() || undefined,
      });
    } else if (type === "temperature") {
      onAddVital({
        memberId: member.id,
        type: "temperature",
        temperature: Number(temperature),
        notes: notes.trim() || undefined,
      });
    } else if (type === "heartRate") {
      onAddVital({
        memberId: member.id,
        type: "heartRate",
        heartRate: Number(heartRate),
        notes: notes.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Log Health Vital
              </h3>
              <p className="text-xs text-slate-500">
                Recording for {member.name.split(" ")[0]}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vital Type Selector */}
        <div className="p-2 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setType("bp")}
            className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              type === "bp" ? "bg-white text-[#176b4d] font-semibold shadow-2xs border border-slate-200/80" : "text-slate-600 hover:bg-white/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Blood Pressure</span>
          </button>
          <button
            type="button"
            onClick={() => setType("sugar")}
            className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              type === "sugar" ? "bg-white text-[#176b4d] font-semibold shadow-2xs border border-slate-200/80" : "text-slate-600 hover:bg-white/60"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Blood Glucose</span>
          </button>
          <button
            type="button"
            onClick={() => setType("temperature")}
            className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              type === "temperature" ? "bg-white text-[#176b4d] font-semibold shadow-2xs border border-slate-200/80" : "text-slate-600 hover:bg-white/60"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {type === "bp" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Systolic (mmHg)</label>
                <input
                  type="number"
                  min="70"
                  max="260"
                  required
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Diastolic (mmHg)</label>
                <input
                  type="number"
                  min="40"
                  max="160"
                  required
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>
            </div>
          )}

          {type === "sugar" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Glucose (mg/dL)</label>
                <input
                  type="number"
                  min="30"
                  max="600"
                  required
                  value={sugarValue}
                  onChange={(e) => setSugarValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Timing Context</label>
                <select
                  value={sugarTiming}
                  onChange={(e) => setSugarTiming(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:ring-1 focus:ring-[#176b4d]"
                >
                  <option value="fasting">Fasting</option>
                  <option value="post_meal_2h">2h Post-Meal</option>
                  <option value="random">Random / Casual</option>
                </select>
              </div>
            </div>
          )}

          {type === "temperature" && (
            <div>
              <label className="block font-medium text-slate-700 mb-1">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                min="94"
                max="108"
                required
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Notes / Context (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Taken after 5 min resting seated"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-4 py-1.5 rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save Vital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
