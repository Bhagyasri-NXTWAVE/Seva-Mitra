import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Building2, 
  ChevronRight, 
  FileText, 
  Eye, 
  Printer, 
  X, 
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  ArrowUpRight,
  Download,
  FileDown
} from 'lucide-react';
import { Complaint, Language, ComplaintStatus } from '../types';
import { translations } from '../translations';

interface MyComplaintsViewProps {
  complaints: Complaint[];
  currentLang: Language;
  onNavigateToRaise: () => void;
  selectedComplaintId?: string;
  onClearSelectedComplaint?: () => void;
}

export const MyComplaintsView: React.FC<MyComplaintsViewProps> = ({
  complaints,
  currentLang,
  onNavigateToRaise,
  selectedComplaintId,
  onClearSelectedComplaint,
}) => {
  const t = translations[currentLang] || translations.en;

  const [activeComplaintModal, setActiveComplaintModal] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exportingComplaint, setExportingComplaint] = useState<Complaint | null>(null);
  const [showExportToast, setShowExportToast] = useState<boolean>(false);

  // Handle direct selection if passed
  React.useEffect(() => {
    if (selectedComplaintId) {
      const match = complaints.find(c => c.id === selectedComplaintId || c.complaintId === selectedComplaintId);
      if (match) setActiveComplaintModal(match);
    }
  }, [selectedComplaintId, complaints]);

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            In Progress
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 mr-1 text-blue-600" />
            Under Review
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Building2 className="w-3 h-3 mr-1 text-purple-600" />
            Assigned
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
            Submitted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Browser Print API / PDF Export Handler
  const handleDownloadPDF = (complaint: Complaint) => {
    setExportingComplaint(complaint);
    setShowExportToast(true);

    // Give React one render cycle to ensure the printable report container is in DOM
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowExportToast(false), 4000);
    }, 150);
  };

  const reportTarget = exportingComplaint || activeComplaintModal || complaints[0];

  return (
    <div className="space-y-6">
      {/* Toast Notice when Print/PDF is triggered */}
      {showExportToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-xs border border-slate-700 animate-in fade-in slide-in-from-top-2 no-print">
          <Download className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">Opening PDF Print Dialog...</div>
            <div className="text-[11px] text-slate-300">Choose &quot;Save as PDF&quot; in the destination dropdown to export.</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Public Grievances Tracking System
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">CPGRAMS / State Portal Synchronized</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {t.myComplaintsTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.trackStatusDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToRaise}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{t.raiseComplaintBtn}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-print">
        {['all', 'in progress', 'under review', 'assigned', 'resolved'].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-all whitespace-nowrap ${
              statusFilter === f
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f === 'all' ? 'All Grievances' : f}
          </button>
        ))}
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        {filteredComplaints.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">{t.noComplaints}</h3>
            <button
              onClick={onNavigateToRaise}
              className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg"
            >
              Raise Your First Grievance
            </button>
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveComplaintModal(c)}
              className="bg-white border border-slate-200 hover:border-amber-500/70 rounded-2xl p-5 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.complaintId}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {c.submittedDate}
                    </span>
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                  {c.category}
                </h3>

                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {c.problemDescription}
                </p>

                <div className="mt-3 space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="truncate">{c.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{c.assignedDepartment}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Impact: <strong>{c.affectedCount} citizens</strong>
                </span>

                <div className="flex items-center gap-2">
                  {/* Download as PDF Quick Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPDF(c);
                    }}
                    title={t.downloadPdf}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-800" />
                    <span>PDF</span>
                  </button>

                  <span className="text-blue-900 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{t.viewTimeline}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECTION 28: COMPLAINT DETAILS & TIMELINE MODAL */}
      {activeComplaintModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 no-print">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    {activeComplaintModal.complaintId}
                  </span>
                  <span className="text-xs text-slate-400">
                    Registered: {activeComplaintModal.submittedDate}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {activeComplaintModal.category}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Download as PDF Button in Modal Header */}
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(activeComplaintModal)}
                  className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  title="Download Grievance Report as PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.downloadPdf}</span>
                  <span className="sm:hidden">PDF</span>
                </button>

                <button
                  onClick={() => {
                    setActiveComplaintModal(null);
                    if (onClearSelectedComplaint) onClearSelectedComplaint();
                  }}
                  className="text-slate-400 hover:text-white p-1 rounded-md"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Evidence & Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeComplaintModal.evidenceUrl && (
                  <div>
                    <span className="font-bold text-slate-800 block mb-1 text-[11px] uppercase tracking-wide">
                      Citizen Evidence Photo
                    </span>
                    <img 
                      src={activeComplaintModal.evidenceUrl} 
                      alt="Complaint Evidence" 
                      className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-2xs" 
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                    Administrative Assignment
                  </span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                      <div className="mt-0.5">{getStatusBadge(activeComplaintModal.status)}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned Department</span>
                      <span className="font-bold text-slate-800">{activeComplaintModal.assignedDepartment}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Zonal Jurisdiction</span>
                      <span className="text-slate-700">{activeComplaintModal.assignedOffice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <span className="font-bold text-slate-900 block mb-1">Grievance Summary:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed text-slate-700">
                  {activeComplaintModal.problemDescription}
                </p>
              </div>

              {/* Section 28: Live Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-900" />
                  <span>{t.timelineTitle}</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeComplaintModal.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle Indicator */}
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        idx === activeComplaintModal.timeline.length - 1
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-blue-900'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          idx === activeComplaintModal.timeline.length - 1 ? 'bg-emerald-600' : 'bg-blue-900'
                        }`} />
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{step.stage}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-normal">{step.note}</p>
                        {step.officerName && (
                          <div className="text-[10px] text-blue-900 font-semibold pt-0.5">
                            Officer: {step.officerName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Remarks if available */}
              {activeComplaintModal.officerRemarks && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t.officerRemarks}</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {activeComplaintModal.officerRemarks}
                  </p>
                </div>
              )}

              {/* Printable Petition Text preview */}
              {activeComplaintModal.generatedLetter && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wide">
                    Generated Administrative Petition Record
                  </span>
                  <div className="text-[11px] font-mono text-slate-600 whitespace-pre-wrap max-h-40 overflow-y-auto p-2 bg-white rounded-lg border border-slate-200">
                    {activeComplaintModal.generatedLetter}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Download as PDF & Close */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadPDF(activeComplaintModal)}
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-blue-900" />
                <span>{t.downloadPdf}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveComplaintModal(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED OFFICIAL PRINTABLE GRIEVANCE REPORT (PRINT & PDF EXPORT) */}
      {reportTarget && (
        <div id="printable-grievance-report" className="hidden print:block p-8 bg-white text-slate-900 font-sans leading-relaxed">
          {/* Official Indian Government Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Ashoka Chakra Emblem SVG */}
                <div className="w-12 h-12 rounded-full border-2 border-blue-900 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-900" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="50" r="44" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = (i * 360) / 24;
                      const rad = (angle * Math.PI) / 180;
                      return <line key={i} x1="50" y1="50" x2={50 + 44 * Math.cos(rad)} y2={50 + 44 * Math.sin(rad)} strokeWidth="1.5" />;
                    })}
                  </svg>
                </div>

                <div>
                  <h1 className="text-base font-black uppercase tracking-wider text-slate-900">
                    Government of India • Central Public Grievance Portal
                  </h1>
                  <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                    SevaMitra National Citizen Redressal & Service Authority
                  </h2>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Official Grievance Action Report • Digital Verification Reference: SEC-IND-{reportTarget.complaintId}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono">
                <div className="font-bold text-slate-900">DATE: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                <div className="text-slate-500">REF: {reportTarget.complaintId}</div>
                <div className="text-emerald-800 font-bold">DIGILOCKER VERIFIED ✓</div>
              </div>
            </div>

            {/* Tricolor Accent */}
            <div className="h-1 w-full flex mt-3">
              <div className="h-full w-1/3 bg-amber-500" />
              <div className="h-full w-1/3 bg-slate-300" />
              <div className="h-full w-1/3 bg-emerald-600" />
            </div>
          </div>

          {/* Grievance Identity & Status Summary Table */}
          <div className="border border-slate-300 rounded-lg p-4 mb-4 bg-slate-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Grievance ID</span>
                <span className="font-mono font-bold text-sm text-blue-900">{reportTarget.complaintId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Status</span>
                <span className="font-bold text-slate-900 uppercase">{reportTarget.status}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Priority Level</span>
                <span className="font-bold text-slate-900">{reportTarget.urgency}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Registration Date</span>
                <span className="font-medium text-slate-800">{reportTarget.submittedDate}</span>
              </div>
            </div>
          </div>

          {/* Citizen & Location Particulars */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div className="border border-slate-300 rounded-lg p-3.5 space-y-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-1 mb-1.5">
                Citizen Particulars
              </h3>
              <div><strong>Name:</strong> {reportTarget.citizenName}</div>
              <div><strong>Contact:</strong> {reportTarget.citizenPhone}</div>
              <div><strong>Verification:</strong> DigiLocker Seeded Profile</div>
            </div>

            <div className="border border-slate-300 rounded-lg p-3.5 space-y-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-1 mb-1.5">
                Location & Impact
              </h3>
              <div><strong>Location:</strong> {reportTarget.location}</div>
              {reportTarget.landmark && <div><strong>Landmark:</strong> {reportTarget.landmark}</div>}
              <div><strong>Affected Population:</strong> ~{reportTarget.affectedCount} residents</div>
            </div>
          </div>

          {/* Departmental Assignment */}
          <div className="border border-slate-300 rounded-lg p-3.5 mb-4 text-xs space-y-1 bg-slate-50/30">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-1 mb-1.5">
              Departmental Routing & Administrative Office
            </h3>
            <div><strong>Assigned Department:</strong> {reportTarget.assignedDepartment}</div>
            <div><strong>Administrative Division / Office:</strong> {reportTarget.assignedOffice}</div>
          </div>

          {/* Problem Statement */}
          <div className="border border-slate-300 rounded-lg p-3.5 mb-4 text-xs space-y-1">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-1 mb-1.5">
              Grievance Details & Factual Description
            </h3>
            <p className="leading-relaxed text-slate-800">
              {reportTarget.problemDescription}
            </p>
          </div>

          {/* Officer Remarks if available */}
          {reportTarget.officerRemarks && (
            <div className="border border-emerald-300 bg-emerald-50/40 rounded-lg p-3.5 mb-4 text-xs space-y-1">
              <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wide border-b border-emerald-200 pb-1 mb-1.5">
                Officer Field Inspection Remarks & Action Proof
              </h3>
              <p className="leading-relaxed text-emerald-900 font-medium">
                {reportTarget.officerRemarks}
              </p>
            </div>
          )}

          {/* Milestone Action Timeline */}
          <div className="border border-slate-300 rounded-lg p-3.5 mb-4 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
              Administrative Action & Inspection Log
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-1">Stage</th>
                  <th className="py-1">Timestamp</th>
                  <th className="py-1">Officer / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportTarget.timeline.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 font-bold text-slate-900">{item.stage}</td>
                    <td className="py-1.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">{item.timestamp}</td>
                    <td className="py-1.5 text-slate-700">
                      {item.note} {item.officerName ? `(${item.officerName})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formal Petition Text */}
          {reportTarget.generatedLetter && (
            <div className="border border-slate-300 rounded-lg p-3.5 mb-5 text-[11px] font-mono bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide font-sans border-b border-slate-200 pb-1 mb-1.5">
                Official Grievance Petition Text
              </h3>
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                {reportTarget.generatedLetter}
              </div>
            </div>
          )}

          {/* Official Verification Seal & Legal Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
            <div>
              <p className="font-bold text-slate-800">
                SevaMitra Digital Public Grievance Redressal Infrastructure
              </p>
              <p>Generated electronically under National e-Governance Standards. No physical signature required.</p>
            </div>
            <div className="text-right font-mono">
              <p className="font-bold text-slate-800">SEAL: GOVT-IN-E-SEVA</p>
              <p>TRACKING: {reportTarget.complaintId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
