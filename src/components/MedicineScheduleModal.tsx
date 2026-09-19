import React, { useState, useEffect } from "react";
import { X, Pill, CheckCircle2, Circle, Plus, Clock, AlertCircle } from "lucide-react";
import { FamilyMember } from "../types";

interface MedicineScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  onUpdateMemberMedications: (memberId: string, updatedMedications: string[]) => void;
}

export const MedicineScheduleModal: React.FC<MedicineScheduleModalProps> = ({
  isOpen,
  onClose,
  member,
  onUpdateMemberMedications,
}) => {
  const [newMedName, setNewMedName] = useState("");
  const [newMedTiming, setNewMedTiming] = useState("Morning post-breakfast");
  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = `personaldoc_meds_log_${member.id}_${todayKey}`;

  // Log of taken meds for today: { [medName]: boolean }
  const [takenLog, setTakenLog] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(takenLog));
    } catch (e) {
      console.error(e);
    }
  }, [takenLog, storageKey]);

  if (!isOpen) return null;

  const toggleTaken = (med: string) => {
    setTakenLog((prev) => ({
      ...prev,
      [med]: !prev[med],
    }));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    const fullMedString = `${newMedName.trim()} (${newMedTiming})`;
    const updated = [...member.medications, fullMedString];
    onUpdateMemberMedications(member.id, updated);
    setNewMedName("");
  };

  const handleDeleteMedication = (idx: number) => {
    const updated = member.medications.filter((_, i) => i !== idx);
    onUpdateMemberMedications(member.id, updated);
  };

  const totalCount = member.medications.length;
  const takenCount = member.medications.filter((m) => takenLog[m]).length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="medicine-schedule-title"
    >
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#176b4d] flex items-center justify-center font-bold border border-slate-200">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 id="medicine-schedule-title" className="font-bold text-slate-900 text-sm">
                Daily Medication Regimen
              </h3>
              <p className="text-xs text-slate-500">
                Prescriptions & adherence tracker for {member.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Daily Progress Bar */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Today's Adherence</span>
              <span className="font-semibold text-slate-900 font-mono">
                {takenCount}/{totalCount} Taken ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#176b4d] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Medicines Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-700">
              Prescribed Medications
            </h4>
            {member.medications.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                No daily medications listed for {member.name}. Add one below.
              </div>
            ) : (
              member.medications.map((med, idx) => {
                const isTaken = !!takenLog[med];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTaken(med)}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-3 cursor-pointer select-none ${
                      isTaken
                        ? "bg-slate-50/90 border-slate-200 text-slate-700"
                        : "bg-white border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        className="flex-shrink-0 text-[#176b4d] focus:outline-none"
                      >
                        {isTaken ? (
                          <CheckCircle2 className="w-4 h-4 fill-[#176b4d] text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium truncate ${isTaken ? "line-through text-slate-400" : "text-slate-900"}`}>
                          {med}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{isTaken ? "Taken today" : "Pending dose"}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedication(idx);
                      }}
                      className="p-1 rounded text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove medicine"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Add New Medication Form */}
          <form onSubmit={handleAddMedication} className="pt-3 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-800">Add New Medication:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                placeholder="Medicine (e.g. Telmisartan 40mg)"
                className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
              />
              <select
                value={newMedTiming}
                onChange={(e) => setNewMedTiming(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:ring-1 focus:ring-[#176b4d]"
              >
                <option value="Morning post-breakfast">Morning post-breakfast</option>
                <option value="Morning empty stomach">Morning empty stomach</option>
                <option value="Afternoon post-lunch">Afternoon post-lunch</option>
                <option value="Night with dinner">Night with dinner</option>
                <option value="Bedtime">Bedtime</option>
                <option value="SOS / As needed">SOS / As needed</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!newMedName.trim()}
              className="w-full py-2 px-3 rounded-lg bg-[#176b4d] hover:bg-[#12583f] disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Schedule</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
