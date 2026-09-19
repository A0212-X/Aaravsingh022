import React from "react";
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Users, 
  Plus, 
  Pencil,
  PhoneCall, 
  Phone,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  Mail,
  Pill,
  Database,
  Menu,
  Bell,
  UserRound,
  FileText,
  LifeBuoy,
  X
} from "lucide-react";
import { ActiveTab, FamilyMember } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  members: FamilyMember[];
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  onOpenAddMember: () => void;
  onOpenEditMember?: (memberId?: string) => void;
  onOpenConsultation: () => void;
  onOpenEmergencyGuide: () => void;
  onOpenBackupRestore?: () => void;
  onOpenMedicineSchedule?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  members,
  selectedMemberId,
  setSelectedMemberId,
  onOpenAddMember,
  onOpenEditMember,
  onOpenConsultation,
  onOpenEmergencyGuide,
  onOpenBackupRestore,
  onOpenMedicineSchedule,
}) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = React.useState(false);
  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const navigationTabs: { id: ActiveTab; label: string; icon?: React.ReactNode }[] = [
    { id: "consultation", label: "Consultation", icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: "blood_pressure", label: "Blood Pressure", icon: <Activity className="w-3.5 h-3.5 text-rose-500" /> },
    { id: "blood_sugar", label: "Blood Sugar" },
    { id: "child_milestones", label: "Child Milestones" },
    { id: "elderly_care", label: "Elderly Care" },
    { id: "lab_explainer", label: "Lab Explainer" },
    { id: "visit_prep", label: "Prep Sheet" },
  ];

  return (
    <header className="bg-[#fffefa] border-b border-[#dce8df] sticky top-0 z-40">
      {/* Top Clinical Ticker & Utility Strip */}
      <div className="bg-[#173f35] text-[#c7ded1] text-xs px-4 sm:px-6 py-1.5 border-b border-[#285647]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-[#f3f8f1]">Dr. Ananya Sharma, MD</span>
              <span className="hidden sm:inline text-[#9bbbab]">• PersonalDoc Clinical Network</span>
            </div>
            <span className="hidden md:inline text-[#527565]">|</span>
            <div className="hidden md:flex items-center gap-2 text-[#9bbbab]">
              <span>By Aarav Singh Hada</span>
              <span>•</span>
              <a 
                href="tel:9828263561" 
                      className="text-[#c7ded1] hover:text-white transition-colors"
                title="Call Aarav Singh Hada"
              >
                +91 9828263561
              </a>
              <span>•</span>
              <a 
                href="mailto:aaravpratapsinghhada07@gmail.com" 
                      className="text-[#c7ded1] hover:text-white transition-colors"
                title="Email Aarav Singh Hada"
              >
                aaravpratapsinghhada07@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            {onOpenMedicineSchedule && (
              <button
                id="header-meds-btn"
                onClick={onOpenMedicineSchedule}
                      className="bg-[#245445] hover:bg-[#2d6653] text-[#e2f0e6] hover:text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#376957]"
                title="Daily Medicine Schedule & Tracking"
              >
                <Pill className="w-3 h-3 text-emerald-400" />
                <span>Daily Meds</span>
              </button>
            )}
            {onOpenBackupRestore && (
              <button
                id="header-backup-btn"
                onClick={onOpenBackupRestore}
                      className="bg-[#245445] hover:bg-[#2d6653] text-[#e2f0e6] hover:text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#376957]"
                title="Backup & Restore Patient Records"
              >
                <Database className="w-3 h-3 text-sky-400" />
                <span>Backup</span>
              </button>
            )}
            <button
              id="emergency-sos-btn"
              onClick={onOpenEmergencyGuide}
              className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-md font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Emergency SOS Protocols (112 / 108)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS (112)</span>
            </button>
            <div className="relative">
              <button
                id="header-quick-menu-btn"
                onClick={() => setIsQuickMenuOpen((isOpen) => !isOpen)}
                className="w-7 h-7 rounded-md border border-[#376957] bg-[#245445] text-[#e2f0e6] hover:bg-[#2d6653] flex items-center justify-center transition-colors cursor-pointer"
                title="Open profile, notifications, and help"
                aria-label="Open profile, notifications, and help"
                aria-expanded={isQuickMenuOpen}
              >
                {isQuickMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              </button>
              {isQuickMenuOpen && (
                <div className="absolute right-0 top-9 z-50 w-72 rounded-xl border border-[#cfe0d4] bg-[#fffefa] p-2 text-left shadow-[0_12px_30px_rgba(31,76,54,0.16)]">
                  <div className="px-3 py-2 border-b border-[#e5eee7]">
                    <p className="text-xs font-bold text-[#18332b]">Quick access</p>
                    <p className="text-[11px] text-slate-500">{selectedMember?.name || "Family profile"}</p>
                  </div>
                  <div className="mt-1 border-t border-[#e5eee7] pt-2">
                    <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b8a78]">Health tools</p>
                    <div className="max-h-56 overflow-y-auto">
                      {navigationTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsQuickMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d] cursor-pointer"
                        >
                          <span className="w-4 flex justify-center text-[#2f8f62]">{tab.icon || <Activity className="w-3.5 h-3.5" />}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("home");
                      setIsQuickMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d] cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[#2f8f62]" />
                    <span><strong className="font-semibold">Home</strong><span className="block text-[11px] text-slate-500">Start here and choose what you need</span></span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenEditMember?.();
                      setIsQuickMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d] cursor-pointer"
                  >
                    <UserRound className="w-4 h-4 text-[#2f8f62]" />
                    <span><strong className="font-semibold">Profile</strong><span className="block text-[11px] text-slate-500">View or edit selected member</span></span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAddMember();
                      setIsQuickMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#2f8f62]" />
                    <span><strong className="font-semibold">New family profile</strong><span className="block text-[11px] text-slate-500">Add someone to your care circle</span></span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenMedicineSchedule?.();
                      setIsQuickMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d] cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span><strong className="font-semibold">Notifications</strong><span className="block text-[11px] text-slate-500">{selectedMember?.medications.length || 0} medicine reminder{selectedMember?.medications.length === 1 ? "" : "s"} to review</span></span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("visit_prep");
                      setIsQuickMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d] cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#2f8f62]" />
                    <span><strong className="font-semibold">Doctor slip</strong><span className="block text-[11px] text-slate-500">Open the visit prep sheet</span></span>
                  </button>
                  <a
                    href="mailto:aaravpratapsinghhada07@gmail.com?subject=PersonalDoc%20support"
                    onClick={() => setIsQuickMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-[#edf6ef] hover:text-[#176b4d]"
                  >
                    <LifeBuoy className="w-4 h-4 text-[#2f8f62]" />
                    <span><strong className="font-semibold">Help & report a problem</strong><span className="block text-[11px] text-slate-500">Contact the PersonalDoc developer</span></span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          
          {/* Logo & Product Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setActiveTab("consultation")}
          >
            <div className="w-10 h-10 rounded-xl bg-[#176b4d] text-white flex items-center justify-center shadow-[0_5px_14px_rgba(23,107,77,0.2)] group-hover:bg-[#12583f] transition-colors flex-shrink-0">
              <Heart className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  PersonalDoc
                </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        AI + human care
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Clinical companion for family health
              </p>
            </div>
          </div>

          {/* Patient Switcher Segmented Control */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200">
              <span className="text-xs font-medium text-slate-500 px-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Patient:</span>
              </span>
              <div className="flex items-center gap-1">
                {members.map((member) => {
                  const isSelected = member.id === selectedMemberId;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-xs font-semibold border border-slate-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${member.avatarColor}`}></span>
                      <span>{member.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
              <button
                id="header-add-member-btn"
                onClick={onOpenAddMember}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-colors ml-1 cursor-pointer"
                title="Add Family Member"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setActiveTab("consultation");
                onOpenConsultation();
              }}
              className="bg-[#176b4d] hover:bg-[#12583f] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-[0_5px_14px_rgba(23,107,77,0.18)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Consult Doctor</span>
            </button>
          </div>
        </div>

        {activeTab !== "home" && (
          <nav className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {navigationTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#176b4d] text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
