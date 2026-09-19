import React, { useState, useEffect } from "react";
import { X, Pencil, UserCheck, Users } from "lucide-react";
import { FamilyMember } from "../types";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  members: FamilyMember[];
  onSaveMemberName: (memberId: string, newName: string, updatedFields?: Partial<FamilyMember>) => void;
  onSelectMemberToEdit?: (id: string) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  members,
  onSaveMemberName,
  onSelectMemberToEdit,
}) => {
  const [selectedId, setSelectedId] = useState(member?.id || "");
  const [name, setName] = useState(member?.name || "");
  const [relationship, setRelationship] = useState(member?.relationship || "");
  const [age, setAge] = useState(member?.age || 30);
  const [error, setError] = useState("");

  const activeTargetMember = members.find((m) => m.id === selectedId) || member;

  useEffect(() => {
    if (member) {
      setSelectedId(member.id);
      setName(member.name);
      setRelationship(member.relationship);
      setAge(member.age);
      setError("");
    }
  }, [member, isOpen]);

  const handleMemberChange = (id: string) => {
    setSelectedId(id);
    const target = members.find((m) => m.id === id);
    if (target) {
      setName(target.name);
      setRelationship(target.relationship);
      setAge(target.age);
      setError("");
      if (onSelectMemberToEdit) {
        onSelectMemberToEdit(id);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a valid member name");
      return;
    }

    onSaveMemberName(selectedId, trimmed, {
      relationship: relationship.trim() || activeTargetMember.relationship,
      age: Number(age) || activeTargetMember.age,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-member-title"
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200 font-bold">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 id="edit-member-title" className="font-bold text-slate-900 text-sm">
                Edit Member Profile
              </h3>
              <p className="text-xs text-slate-500">
                Update name or personal details for family member
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Member Switcher if multiple members */}
          {members.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Select Member to Edit:
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {members.map((m) => {
                  const isCur = m.id === selectedId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMemberChange(m.id)}
                      className={`text-left p-2 rounded-lg text-xs flex items-center gap-2 border transition-colors cursor-pointer ${
                        isCur
                          ? "bg-slate-100 border-slate-300 text-slate-900 font-semibold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded ${m.avatarColor} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate">{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Member Preview Card */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${activeTargetMember.avatarColor} text-white font-bold flex items-center justify-center text-xs flex-shrink-0`}>
              {(name.trim() || activeTargetMember.name).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {name.trim() || activeTargetMember.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {activeTargetMember.memberType.toUpperCase()} • {relationship || activeTargetMember.relationship} • {age} yrs
              </p>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="edit-member-name-input" className="block text-xs font-medium text-slate-700 mb-1">
              Member Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-member-name-input"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Aarav Singh"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
            />
            {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
          </div>

          {/* Relationship & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-member-relationship-input" className="block text-xs font-medium text-slate-700 mb-1">
                Relationship
              </label>
              <input
                id="edit-member-relationship-input"
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Self, Spouse, Father"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
              />
            </div>
            <div>
              <label htmlFor="edit-member-age-input" className="block text-xs font-medium text-slate-700 mb-1">
                Age
              </label>
              <input
                id="edit-member-age-input"
                type="number"
                min="0"
                max="125"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-[#176b4d]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              id="cancel-edit-member-btn"
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-member-name-btn"
              type="submit"
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
