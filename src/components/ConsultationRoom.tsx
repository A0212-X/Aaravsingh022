import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Stethoscope,
  Volume2,
  VolumeX,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  FileText,
  Clock,
  Heart,
  ChevronRight,
  Info,
  RefreshCw,
  Printer,
  Sliders,
  ExternalLink,
  Mic,
  MicOff,
} from "lucide-react";
import { ConsultationMessage, FamilyMember, VitalRecord, TriageLevel } from "../types";

interface ConsultationRoomProps {
  member: FamilyMember;
  vitals: VitalRecord[];
  onOpenVisitPrep: () => void;
  onOpenEmergencyGuide: () => void;
}

export const ConsultationRoom: React.FC<ConsultationRoomProps> = ({
  member,
  vitals,
  onOpenVisitPrep,
  onOpenEmergencyGuide,
}) => {
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello ${member.name.split(" ")[0]}, I am Dr. Ananya Sharma, MD, your personal physician companion (PersonalDoc India Clinical Network). 

I'm here to listen, assess your symptoms with clinical rigor according to Indian health guidelines (ICMR, RSSDI, CSI), and help you understand what might be happening before or between your clinic visits. 

What is your main health question or symptom today? You can speak in English, Hinglish, or Hindi.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      triageLevel: "routine",
      triageLabel: "Doctor Initial Intake",
      suggestedNextReplies: [
        "I've had a persistent dull headache for 2 days",
        "My blood pressure reading was higher than usual",
        "I'm feeling fatigued, dizzy, and run down",
        "Mujhe acidity aur gas ki problem ho rahi hai",
      ],
      probableConsiderations: ["Comprehensive medical intake active"],
      homeCareSteps: ["Find a quiet, comfortable posture", "Have a glass of water nearby"],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [severityScore, setSeverityScore] = useState<number>(3);
  const [symptomDuration, setSymptomDuration] = useState("Past 24-48 hours");
  const [consultationLanguage, setConsultationLanguage] = useState<"English" | "Hinglish" | "Hindi">("English");
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [activeTriage, setActiveTriage] = useState<TriageLevel>("routine");

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const toggleSpeechToText = () => {
    setSpeechError("");
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Microphone input requires Chrome, Edge, or Safari.");
      setTimeout(() => setSpeechError(""), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = consultationLanguage === "Hindi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = (e: any) => {
        console.warn("Speech recognition warning/error:", e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // When patient switches, offer contextual greeting
  useEffect(() => {
    const isChild = member.memberType === "child";
    const isElderly = member.memberType === "elderly";

    let roleIntro = `I am now reviewing health records for ${member.name}.`;
    if (isChild) {
      roleIntro += ` For pediatric evaluations, I'll pay special attention to activity level, hydration, and developmental benchmarks.`;
    } else if (isElderly) {
      roleIntro += ` For our senior consultation, I'm cross-referencing their medications (${member.medications.join(", ") || "none"}) and mobility safety.`;
    }

    setMessages([
      {
        id: `switch-${Date.now()}`,
        role: "assistant",
        content: `Good day. ${roleIntro} What symptoms or health updates should we discuss for ${member.name.split(" ")[0]}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        triageLevel: "routine",
        triageLabel: "Patient Record Loaded",
        suggestedNextReplies: isChild
          ? ["Fever and fussy behavior", "Cough with nasal congestion", "Check milestone progress", "Appetite has decreased"]
          : isElderly
          ? ["Review current medication list", "Mild dizziness when standing up", "Blood sugar check after lunch", "Knee joint stiffness"]
          : ["Recent blood pressure check", "Headache and neck tension", "Digestive discomfort after meals", "Routine wellness check"],
      },
    ]);
  }, [member.id]);

  // Text to Speech playback
  const toggleSpeech = (text: string, msgId: string) => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Daniel") || v.name.includes("Samantha") || v.name.includes("Google")));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ConsultationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage("");
    setIsLoading(true);

    // Latest vitals for this member
    const memberVitals = vitals.filter((v) => v.memberId === member.id);
    const latestBp = memberVitals.find((v) => v.type === "bp");
    const latestSugar = memberVitals.find((v) => v.type === "sugar");

    try {
      const res = await fetch("/api/doctor/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientProfile: {
            name: member.name,
            age: member.age,
            gender: member.gender,
            memberType: member.memberType,
            conditions: member.conditions,
            medications: member.medications,
            allergies: member.allergies,
          },
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          vitals: {
            bp: latestBp ? { systolic: latestBp.systolic, diastolic: latestBp.diastolic } : null,
            sugar: latestSugar ? { value: latestSugar.sugarValue, timing: latestSugar.sugarTiming } : null,
          },
          mode: "general_consultation",
          categoryFocus: `Symptom severity: ${severityScore}/10, duration: ${symptomDuration}`,
          language: consultationLanguage,
        }),
      });

      const data = await res.json();

      const doctorMsg: ConsultationMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am analyzing your symptom pattern. Could you describe when this started?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        triageLevel: data.triageLevel || "routine",
        triageLabel: data.triageLabel || "Doctor Assessment",
        redFlagsIdentified: data.redFlagsIdentified || [],
        probableConsiderations: data.probableConsiderations || [],
        suggestedNextReplies: data.suggestedNextReplies || [],
        doctorVisitQuestions: data.doctorVisitQuestions || [],
        homeCareSteps: data.homeCareSteps || [],
      };

      if (data.triageLevel) {
        setActiveTriage(data.triageLevel);
      }

      setMessages([...newHistory, doctorMsg]);
    } catch (err) {
      console.error("Doctor consult fetch error:", err);
      const errorDoctorMsg: ConsultationMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `I'm noting your symptoms carefully. While my connection updates, please rest comfortably. If you develop any chest pressure, severe shortness of breath, sudden facial drooping or arm weakness, seek emergency medical care immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        triageLevel: "routine",
      };
      setMessages([...newHistory, errorDoctorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const latestDoctorMsg = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Main Doctor Consultation Conversation Panel (8 cols) */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden min-h-[640px]">
        
        {/* Doctor Identity Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#176b4d] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                AS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Dr. Ananya Sharma, MD
                </h2>
                <span className="text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md">
                  PersonalDoc Physician
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ICMR & CSI Guidelines • Evaluating {member.name} ({member.relationship})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVisitPrep}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Generate Clinic Handoff Note"
            >
              <FileText className="w-3.5 h-3.5 text-[#176b4d]" />
              <span className="hidden sm:inline">Visit Prep Sheet</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm("Start a fresh consultation with Dr. Ananya?")) {
                  setMessages([
                    {
                      id: "welcome-reset",
                      role: "assistant",
                      content: `Fresh consultation opened for ${member.name}. What symptom or health concern can I help evaluate right now?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      triageLevel: "routine",
                      suggestedNextReplies: [
                        "I'm feeling under the weather",
                        "Question about blood pressure log",
                        "Review recent medication effects",
                      ],
                    },
                  ]);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Consultation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Triage Severity, Duration & Language Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200/70 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600">Discomfort:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={severityScore}
              onChange={(e) => setSeverityScore(Number(e.target.value))}
              className="w-20 sm:w-24 accent-[#176b4d] cursor-pointer"
            />
            <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
              severityScore >= 8 
                ? "bg-rose-50 text-rose-700 border border-rose-200" 
                : severityScore >= 5 
                ? "bg-amber-50 text-amber-800 border border-amber-200" 
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}>
              {severityScore}/10 ({severityScore >= 8 ? "Severe" : severityScore >= 5 ? "Moderate" : "Mild"})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Duration:</span>
              <select
                value={symptomDuration}
                onChange={(e) => setSymptomDuration(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs focus:ring-1 focus:ring-[#176b4d]"
              >
                <option value="Started today (few hours)">Today (few hours)</option>
                <option value="Past 24-48 hours">Past 24-48 hours</option>
                <option value="3 to 7 days">3 to 7 days</option>
                <option value="2+ weeks (subacute)">2+ weeks</option>
                <option value="Chronic / recurring">Chronic / recurring</option>
              </select>
            </div>

            {/* Consultation Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 px-1.5">Lang:</span>
              {(["English", "Hinglish", "Hindi"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setConsultationLanguage(lang)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    consultationLanguage === lang
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[500px] space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isDoctor = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isDoctor ? "justify-start" : "justify-end"}`}
              >
                {isDoctor && (
                  <div className="w-8 h-8 rounded-lg bg-[#176b4d] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5 shadow-2xs">
                    MD
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isDoctor ? "items-start" : "items-end"}`}>
                  <div
                    className={`p-4 rounded-xl text-sm leading-relaxed ${
                      isDoctor
                        ? "bg-white text-slate-800 border border-slate-200/90 shadow-xs"
                        : "bg-[#176b4d] text-white shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Doctor Message Controls: TTS & Triage Badge */}
                    {isDoctor && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSpeech(msg.content, msg.id)}
                            className="text-slate-500 hover:text-[#176b4d] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Listen to Doctor's explanation"
                          >
                            {isSpeaking === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                                <span className="text-rose-600 font-semibold">Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        </div>

                        {msg.triageLevel && (
                          <span
                            className={`px-2 py-0.5 rounded-md font-medium text-[10px] uppercase tracking-wider ${
                              msg.triageLevel === "emergency"
                                ? "bg-rose-50 text-rose-700 border border-rose-200 font-bold"
                                : msg.triageLevel === "urgent"
                                ? "bg-amber-50 text-amber-800 border border-amber-200 font-bold"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {msg.triageLevel}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* 1-Tap Quick Reply Suggestions from Doctor */}
                  {isDoctor && msg.suggestedNextReplies && msg.suggestedNextReplies.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.suggestedNextReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(reply)}
                          disabled={isLoading}
                          className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded-lg border border-slate-200 shadow-2xs font-normal text-left transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{reply}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-[#176b4d] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                MD
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#176b4d] animate-ping"></span>
                <span>Dr. Ananya is reviewing symptoms and clinical guidelines...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          {speechError && (
            <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
              <span>{speechError}</span>
              <button onClick={() => setSpeechError("")} className="text-amber-600 hover:text-amber-800 text-[11px] font-bold">Dismiss</button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening... Speak symptoms in English or Hindi..." : `Describe symptoms for ${member.name.split(" ")[0]} or answer Dr. Ananya's question...`}
              disabled={isLoading}
              className={`flex-1 bg-slate-50/80 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#176b4d]/20 focus:border-[#176b4d] transition-colors ${
                isListening ? "border-rose-400 bg-rose-50/50 ring-2 ring-rose-200" : "border-slate-200"
              }`}
            />
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleSpeechToText}
              className={`p-2.5 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer ${
                isListening
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              title={isListening ? "Stop listening" : "Speak symptoms (Voice Input)"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-[#176b4d] hover:bg-[#12583f] disabled:opacity-40 text-white px-4 py-2.5 rounded-lg font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              title="Send message"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            PersonalDoc physician companion complements your physical doctor. For sudden acute chest pressure, stroke signs, or breathing distress, immediately call <strong>EmergencySOS</strong> (Dial 112 / 108).
          </p>
        </div>
      </div>

      {/* Right Column: Live Clinical Assessment & Doctor Visit Toolkit (4 cols) */}
      <div className="lg:col-span-4 space-y-4">

        {/* Live Clinical Assessment Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#176b4d]" />
              <h3 className="font-bold text-slate-900 text-sm">
                Clinical Assessment
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                activeTriage === "emergency"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : activeTriage === "urgent"
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {activeTriage}
            </span>
          </div>

          {/* Differential Considerations */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-700 block mb-1.5">
                Clinical Differential Considerations:
              </span>
              {latestDoctorMsg?.probableConsiderations && latestDoctorMsg.probableConsiderations.length > 0 ? (
                <ul className="space-y-1.5">
                  {latestDoctorMsg.probableConsiderations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#176b4d] mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 italic">Discussion in progress with Dr. Ananya...</p>
              )}
            </div>

            {/* Red Flag Warning signs */}
            <div className="pt-2.5 border-t border-slate-100">
              <span className="font-semibold text-rose-700 flex items-center gap-1 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Red Flags (Seek Emergency Care if present):
              </span>
              <ul className="space-y-1 text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-500">•</span> Sudden crushing chest pressure or radiating pain
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-500">•</span> Acute shortness of breath or blue lips
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-500">•</span> Facial droop, slurred speech, or unilateral limb weakness
                </li>
              </ul>
            </div>

            {/* Home Comfort Steps */}
            {latestDoctorMsg?.homeCareSteps && latestDoctorMsg.homeCareSteps.length > 0 && (
              <div className="pt-2.5 border-t border-slate-100">
                <span className="font-semibold text-slate-700 block mb-1.5">
                  Supportive Measures:
                </span>
                <ul className="space-y-1 text-slate-600">
                  {latestDoctorMsg.homeCareSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action to create visit prep note */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenVisitPrep}
              className="w-full py-2 px-3 rounded-lg bg-[#176b4d] hover:bg-[#12583f] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Doctor Visit Prep Sheet</span>
            </button>
          </div>
        </div>

        {/* Patient Clinical Profile Quick Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm">
              {member.name}
            </span>
            <span className="text-slate-500 capitalize">
              {member.gender}, {member.age}y • {member.bloodType || "O+"}
            </span>
          </div>

          <div>
            <span className="font-medium text-slate-500 block mb-1">Conditions:</span>
            {member.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {member.conditions.map((c, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">None documented</span>
            )}
          </div>

          <div>
            <span className="font-medium text-slate-500 block mb-1">Medications:</span>
            {member.medications.length > 0 ? (
              <ul className="space-y-1 text-slate-600">
                {member.medications.map((m, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400">No daily medications</span>
            )}
          </div>

          <div>
            <span className="font-medium text-slate-500 block mb-1">Allergies:</span>
            <span className="text-rose-600 font-medium">
              {member.allergies.join(", ") || "No known drug allergies (NKDA)"}
            </span>
          </div>
        </div>

        {/* Emergency Quick Reference banner */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>EmergencySOS Protocol</span>
          </div>
          <p className="text-rose-700 leading-relaxed">
            If you or a family member experience sudden chest pressure, acute breathlessness, or confusion, call 112 / 108 or visit casualty immediately.
          </p>
          <button
            onClick={onOpenEmergencyGuide}
            className="mt-2 text-rose-800 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Emergency Protocol</span>
            <span>→</span>
          </button>
        </div>

      </div>

    </div>
  );
};
