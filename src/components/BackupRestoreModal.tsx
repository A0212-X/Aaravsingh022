import React, { useState, useRef } from "react";
import { X, Download, Upload, Database, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { FamilyMember, VitalRecord } from "../types";

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  vitals: VitalRecord[];
  onRestoreData: (newMembers: FamilyMember[], newVitals: VitalRecord[]) => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  members,
  vitals,
  onRestoreData,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const exportPayload = {
        app: "PersonalDoc",
        version: "1.0",
        exportDate: new Date().toISOString(),
        data: {
          members,
          vitals,
        },
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PersonalDoc_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: "success",
        text: `Export successful! Saved ${members.length} members and ${vitals.length} vital records.`,
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Failed to export data file." });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.data || !Array.isArray(parsed.data.members) || !Array.isArray(parsed.data.vitals)) {
          throw new Error("Invalid backup file structure.");
        }

        onRestoreData(parsed.data.members, parsed.data.vitals);
        setStatusMessage({
          type: "success",
          text: `Restore complete! Successfully loaded ${parsed.data.members.length} members and ${parsed.data.vitals.length} vital logs.`,
        });
      } catch (err: any) {
        console.error(err);
        setStatusMessage({
          type: "error",
          text: err.message || "Failed to read backup file. Please select a valid PersonalDoc JSON backup.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
    >
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#176b4d] flex items-center justify-center border border-slate-200 font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 id="backup-modal-title" className="font-bold text-slate-900 text-sm">
                Health Data Backup & Restore
              </h3>
              <p className="text-xs text-slate-500">
                Safely backup or transfer your family's records to any device
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

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Current Local Stats Card */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Currently Stored on this Browser</span>
              <span className="font-semibold text-slate-900 text-xs">
                {members.length} Family Members • {vitals.length} Vital Records
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 text-[11px] font-medium border border-slate-300/60">
              Active Storage
            </span>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export Card */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="w-7 h-7 rounded-md bg-slate-100 text-[#176b4d] flex items-center justify-center mb-2 border border-slate-200">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-xs">Export Backup</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Download a clean JSON archive containing member profiles, medications, conditions, and vitals.
                </p>
              </div>
              <button
                id="export-backup-btn"
                onClick={handleExport}
                className="w-full py-1.5 px-3 rounded-lg bg-[#176b4d] hover:bg-[#12583f] text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center mb-2 border border-slate-200">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-xs">Restore Data</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Restore previously saved health records or transfer profiles from another device or browser.
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                id="import-backup-btn"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select Backup File</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            PersonalDoc health records remain local and private on your device. Backups are exported in standard format.
          </p>
        </div>

      </div>
    </div>
  );
};
