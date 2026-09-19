import React, { useState } from "react";
import { X, Users, UserPlus } from "lucide-react";
import { FamilyMember, MemberType } from "../types";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: FamilyMember) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [memberType, setMemberType] = useState<MemberType>("self");
  const [relationship, setRelationship] = useState("Spouse");
  const [bloodType, setBloodType] = useState("O+");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ["bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-rose-600", "bg-amber-600", "bg-teal-600"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      gender,
      memberType,
      relationship: relationship.trim() || "Family Member",
      bloodType,
      conditions: conditions
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      medications: medications
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      allergies: allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      avatarColor,
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Add Family Member
              </h3>
              <p className="text-xs text-slate-500">
                Create a dedicated clinical profile for family health tracking
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maria Smith"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Role / Category</label>
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value as MemberType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-[#176b4d]"
              >
                <option value="self">Self (Adult)</option>
                <option value="child">Child (Pediatric)</option>
                <option value="elderly">Elderly Parent (Senior)</option>
                <option value="spouse">Spouse</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Biological Sex</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-[#176b4d]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Blood Type</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-[#176b4d]"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Chronic Medical Conditions (comma separated)
            </label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Asthma, High Blood Pressure, Migraine"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Current Daily Medications & Dosages
            </label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g. Albuterol inhaler, Multivitamin"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Allergies (Medications or Food)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts, Latex"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-[#176b4d]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
              Add Member Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
