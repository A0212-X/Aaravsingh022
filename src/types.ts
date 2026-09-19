export type MemberType = "self" | "child" | "elderly" | "spouse" | "other";

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  memberType: MemberType;
  relationship: string;
  bloodType?: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  avatarColor: string;
}

export interface VitalRecord {
  id: string;
  memberId: string;
  timestamp: string;
  type: "bp" | "sugar" | "heartRate" | "temperature" | "weight";
  systolic?: number;
  diastolic?: number;
  sugarValue?: number;
  sugarTiming?: "fasting" | "before_meal" | "post_meal_2h" | "bedtime" | "random";
  heartRate?: number;
  temperature?: number;
  weight?: number;
  notes?: string;
}

export type TriageLevel = "self_care" | "routine" | "urgent" | "emergency";

export interface ConsultationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  triageLevel?: TriageLevel;
  triageLabel?: string;
  redFlagsIdentified?: string[];
  probableConsiderations?: string[];
  suggestedNextReplies?: string[];
  doctorVisitQuestions?: string[];
  homeCareSteps?: string[];
}

export interface ClinicalVisitSummary {
  visitTitle: string;
  historyOfPresentIllness: string;
  pertinentPositives: string[];
  pertinentNegatives: string[];
  recommendedDoctorQuestions: string[];
  differentialToExplore: string[];
  suggestedWorkup: string[];
  emergencyRedFlags: string[];
}

export interface LabAnalysisItem {
  name: string;
  value: string;
  normalRange: string;
  status: "normal" | "borderline" | "elevated" | "high" | "low" | "information";
  explanation: string;
}

export interface LabAnalysisResult {
  overview: string;
  analyzedItems: LabAnalysisItem[];
  doctorTalkingPoints: string[];
  lifestyleSupport: string[];
}

export type ActiveTab = 
  | "home"
  | "consultation"
  | "blood_pressure"
  | "blood_sugar"
  | "child_milestones"
  | "elderly_care"
  | "lab_explainer"
  | "visit_prep";

export type ConsultationLanguage = "en" | "hinglish" | "hi";

