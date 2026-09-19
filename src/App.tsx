import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ConsultationRoom } from "./components/ConsultationRoom";
import { BloodPressureCenter } from "./components/BloodPressureCenter";
import { BloodSugarCenter } from "./components/BloodSugarCenter";
import { ChildMilestonesCenter } from "./components/ChildMilestonesCenter";
import { ElderlyParentsCenter } from "./components/ElderlyParentsCenter";
import { LabExplainerCenter } from "./components/LabExplainerCenter";
import { VisitPrepSheetModal } from "./components/VisitPrepSheetModal";
import { EmergencyGuideModal } from "./components/EmergencyGuideModal";
import { AddMemberModal } from "./components/AddMemberModal";
import { EditMemberModal } from "./components/EditMemberModal";
import { LogVitalModal } from "./components/LogVitalModal";
import { BackupRestoreModal } from "./components/BackupRestoreModal";
import { MedicineScheduleModal } from "./components/MedicineScheduleModal";
import { ActiveTab, FamilyMember, VitalRecord } from "./types";
import { INITIAL_MEMBERS, INITIAL_VITALS } from "./data/initialData";
import { 
  Heart, 
  ShieldAlert, 
  Activity, 
  Users, 
  Stethoscope, 
  Sparkles, 
  Clock, 
  FileText,
  PhoneCall,
  Plus,
  Pencil,
  Check,
  X,
  Mail,
  Phone,
  Pill,
  Database,
} from "lucide-react";

export default function App() {
  // Members state with localStorage persistence
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem("personaldoc_members");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEMBERS;
  });

  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    return members[0]?.id || "member-self";
  });

  // Vitals state with localStorage persistence
  const [vitals, setVitals] = useState<VitalRecord[]>(() => {
    const saved = localStorage.getItem("personaldoc_vitals");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VITALS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  // Modals & Inline Edit State
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [editingMemberTarget, setEditingMemberTarget] = useState<FamilyMember | null>(null);
  const [isInlineEditingName, setIsInlineEditingName] = useState(false);
  const [inlineNameValue, setInlineNameValue] = useState("");
  const [isLogVitalOpen, setIsLogVitalOpen] = useState(false);
  const [isVisitPrepOpen, setIsVisitPrepOpen] = useState(false);
  const [isEmergencyGuideOpen, setIsEmergencyGuideOpen] = useState(false);
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);
  const [isMedicineScheduleOpen, setIsMedicineScheduleOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("personaldoc_members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("personaldoc_vitals", JSON.stringify(vitals));
  }, [vitals]);

  const selectedMember =
    members.find((m) => m.id === selectedMemberId) || members[0] || INITIAL_MEMBERS[0];

  const handleRestoreData = (newMembers: FamilyMember[], newVitals: VitalRecord[]) => {
    setMembers(newMembers);
    setVitals(newVitals);
    if (newMembers.length > 0) {
      setSelectedMemberId(newMembers[0].id);
    }
  };

  const handleUpdateMemberMedications = (memberId: string, updatedMedications: string[]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, medications: updatedMedications } : m))
    );
  };

  const handleAddMember = (newMember: FamilyMember) => {
    setMembers((prev) => [...prev, newMember]);
    setSelectedMemberId(newMember.id);
  };

  const handleSaveMemberName = (
    memberId: string,
    newName: string,
    updatedFields?: Partial<FamilyMember>
  ) => {
    if (!newName.trim()) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              name: newName.trim(),
              ...(updatedFields || {}),
            }
          : m
      )
    );
  };

  const handleOpenEditMember = (memberId?: string) => {
    const target = memberId
      ? members.find((m) => m.id === memberId) || selectedMember
      : selectedMember;
    setEditingMemberTarget(target);
    setIsEditMemberOpen(true);
  };

  const handleAddVital = (vitalData: Omit<VitalRecord, "id" | "timestamp">) => {
    const newVital: VitalRecord = {
      ...vitalData,
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setVitals((prev) => [newVital, ...prev]);
  };

  // Cross-navigation: Trigger consultation with a pre-filled prompt
  const handleConsultDoctorWithPrompt = (prompt: string) => {
    setActiveTab("consultation");
    // Switch or handle directly
  };

  return (
    <div className="min-h-screen bg-[#f4f7f2] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header with brand logo, profile switcher, and signature category pills */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        members={members}
        selectedMemberId={selectedMemberId}
        setSelectedMemberId={setSelectedMemberId}
        onOpenAddMember={() => setIsAddMemberOpen(true)}
        onOpenEditMember={handleOpenEditMember}
        onOpenConsultation={() => setActiveTab("consultation")}
        onOpenEmergencyGuide={() => setIsEmergencyGuideOpen(true)}
        onOpenBackupRestore={() => setIsBackupRestoreOpen(true)}
        onOpenMedicineSchedule={() => setIsMedicineScheduleOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Active Patient & EHR Clinical Context Bar */}
        <div className={`mb-6 bg-[#fffefa] p-4 rounded-2xl border border-[#dce8df] border-l-4 border-l-[#2f8f62] shadow-[0_8px_24px_rgba(31,76,54,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4 ${activeTab === "home" ? "hidden" : ""}`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl ${selectedMember.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0`}>
              {selectedMember.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {isInlineEditingName ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (inlineNameValue.trim()) {
                        handleSaveMemberName(selectedMember.id, inlineNameValue.trim());
                        setIsInlineEditingName(false);
                      }
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      id="inline-member-name-input"
                      type="text"
                      value={inlineNameValue}
                      onChange={(e) => setInlineNameValue(e.target.value)}
                      autoFocus
                      className="bg-white border border-[#2f8f62] text-slate-900 font-bold text-sm px-2 py-0.5 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Enter new name"
                    />
                    <button
                      id="inline-save-name-btn"
                      type="submit"
                      className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-xs cursor-pointer"
                      title="Save Name"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInlineEditingName(false)}
                      className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span 
                      className="text-base font-bold text-slate-900 hover:text-[#176b4d] cursor-pointer transition-colors"
                      onClick={() => {
                        setInlineNameValue(selectedMember.name);
                        setIsInlineEditingName(true);
                      }}
                      title="Click to rename"
                    >
                      {selectedMember.name}
                    </span>
                    <button
                      id="edit-member-name-btn"
                      onClick={() => {
                        setInlineNameValue(selectedMember.name);
                        setIsInlineEditingName(true);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                      title={`Edit name of ${selectedMember.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {selectedMember.relationship} • {selectedMember.age}y
                </span>
                {selectedMember.conditions.length > 0 && (
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    • {selectedMember.conditions.join(", ")}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Medications: {selectedMember.medications.join(", ") || "None recorded"} • Allergies: {selectedMember.allergies.join(", ") || "None known"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsMedicineScheduleOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
              title="Daily medicine schedule & adherence tracking"
            >
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daily Meds ({selectedMember.medications.length})</span>
            </button>
            <button
              onClick={() => setIsVisitPrepOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
              title="Doctor Clinic Visit Prep Sheet"
            >
              <FileText className="w-3.5 h-3.5 text-[#176b4d]" />
              <span>Doctor Prep Sheet</span>
            </button>
            <button
              onClick={() => setIsLogVitalOpen(true)}
              className="bg-[#176b4d] hover:bg-[#12583f] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Vital</span>
            </button>
          </div>
        </div>

        {activeTab === "home" && (
          <>
          <section className="relative overflow-hidden rounded-3xl border border-[#cfe0d4] bg-[#fffefa] shadow-[0_14px_35px_rgba(31,76,54,0.08)]">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#e5f2e7] -translate-y-1/3 translate-x-1/3" />
            <div className="relative px-6 py-10 sm:px-12 sm:py-14">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cce2d1] bg-[#edf6ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#28704d]">
                  <Heart className="h-3.5 w-3.5" /> Family health, made clearer
                </span>
                <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-[#18332b] sm:text-5xl">
                  Feel more prepared for the next health moment.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  PersonalDoc brings your family’s symptoms, medicines, and vital records into one calm, private place so you can act with clarity.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("consultation")}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#176b4d] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(23,107,77,0.2)] transition-colors hover:bg-[#12583f] cursor-pointer"
                  >
                    <Stethoscope className="h-4 w-4" /> Start a consultation
                  </button>
                  <button
                    onClick={() => setIsAddMemberOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#cfe0d4] bg-white px-4 py-2.5 text-sm font-semibold text-[#176b4d] transition-colors hover:bg-[#edf6ef] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add a family member
                  </button>
                </div>
              </div>
              <div className="mt-8 max-w-4xl rounded-2xl border border-[#dce8df] bg-[#f7fbf7] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b8a78]">Your first minute</p>
                    <p className="mt-1 text-sm font-semibold text-[#18332b]">Start small. PersonalDoc grows with your family.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[360px]">
                    <div><span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#d9ecdd] text-xs font-bold text-[#28704d]">1</span><p className="mt-1 text-[11px] text-slate-500">Choose a person</p></div>
                    <div><span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#d9ecdd] text-xs font-bold text-[#28704d]">2</span><p className="mt-1 text-[11px] text-slate-500">Share what matters</p></div>
                    <div><span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#d9ecdd] text-xs font-bold text-[#28704d]">3</span><p className="mt-1 text-[11px] text-slate-500">Leave with a plan</p></div>
                  </div>
                </div>
              </div>
              <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e1ece3] bg-[#f7fbf7] p-4">
                  <Sparkles className="h-5 w-5 text-[#2f8f62]" />
                  <h2 className="mt-3 text-sm font-bold text-[#18332b]">Understand symptoms</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Talk through what is happening and get a clear next step.</p>
                </div>
                <div className="rounded-2xl border border-[#e1ece3] bg-[#f7fbf7] p-4">
                  <Activity className="h-5 w-5 text-[#2f8f62]" />
                  <h2 className="mt-3 text-sm font-bold text-[#18332b]">Track the essentials</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Keep vitals, medicines, allergies, and family profiles together.</p>
                </div>
                <div className="rounded-2xl border border-[#e1ece3] bg-[#f7fbf7] p-4">
                  <FileText className="h-5 w-5 text-[#2f8f62]" />
                  <h2 className="mt-3 text-sm font-bold text-[#18332b]">Prepare for visits</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Turn your notes into a concise handoff for your physical doctor.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-8 rounded-3xl border border-[#dce8df] bg-[#eef7f0] px-5 py-10 sm:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#28704d]">The PersonalDoc journey</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#18332b] sm:text-3xl">How PersonalDoc works</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                A simple flow for turning a worried moment at home into a clearer conversation with your doctor.
              </p>
            </div>
            <div className="relative mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-5">
              <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-px bg-[#b9d8c1] md:block" />
              <div className="relative rounded-2xl border border-white/80 bg-white p-5 text-center shadow-[0_5px_14px_rgba(31,76,54,0.05)]">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2f8f62] bg-white text-xs font-bold text-[#28704d]">01</span>
                <Users className="mx-auto mt-5 h-5 w-5 text-[#2f8f62]" />
                <h3 className="mt-3 text-sm font-bold text-[#18332b]">Choose your family member</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Keep each person’s medicines, allergies, and history in one profile.</p>
              </div>
              <div className="relative rounded-2xl border border-white/80 bg-white p-5 text-center shadow-[0_5px_14px_rgba(31,76,54,0.05)]">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2f8f62] bg-white text-xs font-bold text-[#28704d]">02</span>
                <Stethoscope className="mx-auto mt-5 h-5 w-5 text-[#2f8f62]" />
                <h3 className="mt-3 text-sm font-bold text-[#18332b]">Describe what is happening</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Share symptoms in your own words and use English, Hindi, or Hinglish.</p>
              </div>
              <div className="relative rounded-2xl border border-white/80 bg-white p-5 text-center shadow-[0_5px_14px_rgba(31,76,54,0.05)]">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2f8f62] bg-white text-xs font-bold text-[#28704d]">03</span>
                <Sparkles className="mx-auto mt-5 h-5 w-5 text-[#2f8f62]" />
                <h3 className="mt-3 text-sm font-bold text-[#18332b]">Get a guided next step</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Receive an AI-assisted summary with red-flag reminders and practical questions.</p>
              </div>
              <div className="relative rounded-2xl border border-white/80 bg-white p-5 text-center shadow-[0_5px_14px_rgba(31,76,54,0.05)]">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2f8f62] bg-white text-xs font-bold text-[#28704d]">04</span>
                <Activity className="mx-auto mt-5 h-5 w-5 text-[#2f8f62]" />
                <h3 className="mt-3 text-sm font-bold text-[#18332b]">Keep the essentials current</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Log blood pressure, sugar, medicines, milestones, and lab results over time.</p>
              </div>
              <div className="relative rounded-2xl border border-white/80 bg-white p-5 text-center shadow-[0_5px_14px_rgba(31,76,54,0.05)]">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2f8f62] bg-white text-xs font-bold text-[#28704d]">05</span>
                <FileText className="mx-auto mt-5 h-5 w-5 text-[#2f8f62]" />
                <h3 className="mt-3 text-sm font-bold text-[#18332b]">Prepare for the real visit</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Create a concise visit prep sheet to hand to your physical doctor.</p>
              </div>
            </div>
            <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-3 rounded-2xl border border-[#cfe0d4] bg-white/70 p-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-rose-600" /><strong className="text-[#18332b]">Safety first:</strong> PersonalDoc supports preparation, not emergency care or a replacement for your doctor.</span>
              <span className="inline-flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-[#2f8f62]" /><strong className="text-[#18332b]">Privacy by default:</strong> Your records stay in this browser unless you export them.</span>
            </div>
          </section>
          </>
        )}

        {/* Tab 1: Doctor Consultation Room */}
        {activeTab === "consultation" && (
          <ConsultationRoom
            member={selectedMember}
            vitals={vitals}
            onOpenVisitPrep={() => setIsVisitPrepOpen(true)}
            onOpenEmergencyGuide={() => setIsEmergencyGuideOpen(true)}
          />
        )}

        {/* Tab 2: Blood Pressure Center */}
        {activeTab === "blood_pressure" && (
          <BloodPressureCenter
            member={selectedMember}
            vitals={vitals}
            onAddVital={handleAddVital}
            onConsultDoctor={handleConsultDoctorWithPrompt}
          />
        )}

        {/* Tab 3: Blood Sugar Center */}
        {activeTab === "blood_sugar" && (
          <BloodSugarCenter
            member={selectedMember}
            vitals={vitals}
            onAddVital={handleAddVital}
            onConsultDoctor={handleConsultDoctorWithPrompt}
          />
        )}

        {/* Tab 4: Child Milestones */}
        {activeTab === "child_milestones" && (
          <ChildMilestonesCenter
            member={selectedMember}
            onConsultDoctor={handleConsultDoctorWithPrompt}
          />
        )}

        {/* Tab 5: Elderly Parents */}
        {activeTab === "elderly_care" && (
          <ElderlyParentsCenter
            member={selectedMember}
            onConsultDoctor={handleConsultDoctorWithPrompt}
          />
        )}

        {/* Tab 6: Lab Explainer */}
        {activeTab === "lab_explainer" && (
          <LabExplainerCenter onConsultDoctor={handleConsultDoctorWithPrompt} />
        )}

        {/* Tab 7: Clinic Visit Prep Sheet view */}
        {activeTab === "visit_prep" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2f8f62] flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Doctor Visit Intake & Handoff Sheet
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Synthesizes your symptoms, vitals history, and prepared questions into an authentic clinical summary to give your physical doctor, saving 15-20 minutes of clinic time.
            </p>
            <button
              onClick={() => setIsVisitPrepOpen(true)}
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-colors"
            >
              Open Printable Visit Prep Sheet
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <VisitPrepSheetModal
        isOpen={isVisitPrepOpen}
        onClose={() => setIsVisitPrepOpen(false)}
        member={selectedMember}
        vitals={vitals}
      />

      <EmergencyGuideModal
        isOpen={isEmergencyGuideOpen}
        onClose={() => setIsEmergencyGuideOpen(false)}
        member={selectedMember}
        vitals={vitals}
      />

      <BackupRestoreModal
        isOpen={isBackupRestoreOpen}
        onClose={() => setIsBackupRestoreOpen(false)}
        members={members}
        vitals={vitals}
        onRestoreData={handleRestoreData}
      />

      <MedicineScheduleModal
        isOpen={isMedicineScheduleOpen}
        onClose={() => setIsMedicineScheduleOpen(false)}
        member={selectedMember}
        onUpdateMemberMedications={handleUpdateMemberMedications}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
      />

      <EditMemberModal
        isOpen={isEditMemberOpen}
        onClose={() => setIsEditMemberOpen(false)}
        member={editingMemberTarget || selectedMember}
        members={members}
        onSaveMemberName={handleSaveMemberName}
        onSelectMemberToEdit={(id) => {
          const target = members.find((m) => m.id === id);
          if (target) setEditingMemberTarget(target);
        }}
      />

      <LogVitalModal
        isOpen={isLogVitalOpen}
        onClose={() => setIsLogVitalOpen(false)}
        member={selectedMember}
        onAddVital={handleAddVital}
      />

      {/* Footer with Medical Disclaimers & Developer Credit */}
      <footer className="mt-12 bg-white border-t border-slate-200/80 text-xs text-slate-500 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#2f8f62] flex items-center justify-center text-white">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800">PersonalDoc</span>
              <span className="text-slate-400">• One place for your family's health</span>
            </div>
            <div className="sm:border-l sm:border-slate-200 sm:pl-3 text-slate-600 flex items-center gap-2 flex-wrap">
              <span>Developed by <strong className="text-slate-900 font-semibold">Aarav Singh Hada</strong></span>
              <span className="text-slate-300">•</span>
              <a 
                href="tel:9828263561" 
                className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline"
                title="Call Aarav Singh Hada"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                +91 9828263561
              </a>
              <span className="text-slate-300">•</span>
              <a 
                href="mailto:aaravpratapsinghhada07@gmail.com" 
                className="text-[#2f8f62] hover:text-[#24734c] font-medium inline-flex items-center gap-1 hover:underline"
                title="Email Aarav Singh Hada"
              >
                <Mail className="w-3 h-3 text-[#2f8f62]" />
                aaravpratapsinghhada07@gmail.com
              </a>
            </div>
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-xl">
            <strong>Clinical Notice:</strong> PersonalDoc is an AI personal physician companion designed to organize family health, triage symptoms, and prepare patients for in-person medical consultations. In acute medical emergencies, immediately activate <strong>EmergencySOS</strong> (Dial 112 / 108 in India).
          </p>
        </div>
      </footer>
    </div>
  );
}
