import React, { useState } from "react";
import { X, ShieldAlert, PhoneCall, AlertTriangle, Heart, Activity, Share2, Check } from "lucide-react";
import { FamilyMember, VitalRecord } from "../types";
import { copyTextToClipboard } from "../utils/medicalUtils";

interface EmergencyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: FamilyMember;
  vitals?: VitalRecord[];
}

export const EmergencyGuideModal: React.FC<EmergencyGuideModalProps> = ({
  isOpen,
  onClose,
  member,
  vitals = [],
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const latestBp = vitals.find((v) => v.memberId === member?.id && v.type === "bp");
  const latestSugar = vitals.find((v) => v.memberId === member?.id && v.type === "sugar");

  const getEmergencyText = () => {
    const patientName = member ? `${member.name} (Age: ${member.age}, Blood Group: ${member.bloodType || "N/A"})` : "Family Member";
    return `🚨 *MEDICAL EMERGENCY SOS - PersonalDoc Alert* 🚨
Patient: ${patientName}
Status: Acute Medical Assistance Needed

• Known Conditions: ${member?.conditions.join(", ") || "None"}
• Medications: ${member?.medications.join(", ") || "None"}
• Allergies: ${member?.allergies.join(", ") || "NKDA"}
• Latest Vitals: ${latestBp ? `BP ${latestBp.systolic}/${latestBp.diastolic} mmHg` : "BP Not available"}, ${latestSugar ? `Sugar ${latestSugar.sugarValue} mg/dL` : ""}

🚨 NATIONAL EMERGENCY NUMBERS:
- All-India Emergency: 112
- Ambulance: 108
- AIIMS National Poison Centre: 1800-116-117

Sent immediately via PersonalDoc India`;
  };

  const handleShareWhatsApp = () => {
    const text = getEmergencyText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleCopyAlert = async () => {
    const text = getEmergencyText();
    if (await copyTextToClipboard(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Emergency Header */}
        <div className="px-5 py-4 bg-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Emergency Protocol & Triage Directory
              </h3>
              <p className="text-[11px] text-rose-100">
                National Emergency Response Support System (ERSS India)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-800 max-h-[80vh] overflow-y-auto">
          {/* Main 112 & 108 Action Banner */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-rose-950 text-sm block">
                Immediate Life-Threatening Emergency?
              </span>
              <p className="text-rose-800 text-xs mt-0.5">
                Dial <strong>112</strong> (All-in-one Emergency) or <strong>108</strong> (Ambulance).
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="tel:112"
                className="bg-rose-700 hover:bg-rose-800 text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 112</span>
              </a>
              <a
                href="tel:108"
                className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Ambulance 108</span>
              </a>
            </div>
          </div>

          {/* One-Tap WhatsApp SOS Card */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-semibold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-emerald-700" />
                Alert Caregiver via WhatsApp
              </span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Pre-formatted alert with blood group, recent vitals, conditions, and emergency numbers.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleCopyAlert}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <span>Share WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Stroke Signs: FAST */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <h4 className="font-semibold text-slate-900 mb-2.5 text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#176b4d]" />
              Stroke Identification (F.A.S.T. Protocol)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="font-bold text-[#176b4d] block text-xs">F - Face</span>
                <span className="text-[11px] text-slate-600">Chehra tedha hona (Facial droop)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="font-bold text-[#176b4d] block text-xs">A - Arms</span>
                <span className="text-[11px] text-slate-600">Haath kamzor (Arm weakness)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="font-bold text-[#176b4d] block text-xs">S - Speech</span>
                <span className="text-[11px] text-slate-600">Boli ladkhadana (Slurred speech)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="font-bold text-rose-600 block text-xs">T - Time</span>
                <span className="text-[11px] text-slate-600">Immediate 112/108 call (&lt;3h window)</span>
              </div>
            </div>
          </div>

          {/* Cardiac Emergency Signs */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <h4 className="font-semibold text-slate-900 mb-2 text-xs flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              Heart Attack (Myocardial Infarction) Red Flags
            </h4>
            <ul className="space-y-1 text-xs text-slate-700">
              <li>• Heavy squeezing pressure or suffocating pain in chest center lasting &gt; 5 minutes.</li>
              <li>• Pain radiating to left jaw, neck, back, or left arm (often mistaken as simple acidity).</li>
              <li>• Profuse cold sweating, nausea, sudden breathlessness, or dizziness.</li>
              <li>• <strong>Golden Hour:</strong> Reach the nearest hospital with Cath Lab/ICU facilities within 60-90 minutes.</li>
            </ul>
          </div>

          {/* India National Helplines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="font-semibold text-slate-900 block text-xs">AIIMS Poison Centre</span>
              <p className="text-slate-500 text-[11px] mb-1">Accidental ingestion / poisoning.</p>
              <a href="tel:1800116117" className="text-[#176b4d] font-semibold hover:underline block font-mono">
                1800-116-117
              </a>
              <span className="text-[10px] text-slate-400">24/7 Toll Free</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="font-semibold text-slate-900 block text-xs">Tele-MANAS Helpline</span>
              <p className="text-slate-500 text-[11px] mb-1">24/7 mental health crisis support.</p>
              <a href="tel:14416" className="text-[#176b4d] font-semibold hover:underline block font-mono">
                14416
              </a>
              <span className="text-[10px] text-slate-400">Govt of India</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="font-semibold text-slate-900 block text-xs">Elderline</span>
              <p className="text-slate-500 text-[11px] mb-1">Senior citizen emergency welfare.</p>
              <a href="tel:14567" className="text-[#176b4d] font-semibold hover:underline block font-mono">
                14567
              </a>
              <span className="text-[10px] text-slate-400">Ministry of Social Justice</span>
            </div>
          </div>

          <div className="text-right pt-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
