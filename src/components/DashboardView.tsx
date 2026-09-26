import React, { useState } from 'react';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  ExternalLink, 
  Info, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Language, SchemeApplication, Complaint, CitizenProfile } from '../types';
import { translations } from '../translations';

interface DashboardViewProps {
  currentLang: Language;
  profile: CitizenProfile;
  applications: SchemeApplication[];
  complaints: Complaint[];
  onNavigate: (tab: string, param?: any) => void;
  onOpenSchemeDetails: (schemeId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLang,
  profile,
  applications,
  complaints,
  onNavigate,
  onOpenSchemeDetails,
}) => {
  const t = translations[currentLang] || translations.en;

  const [selectedDeclinedApp, setSelectedDeclinedApp] = useState<SchemeApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  const totalApplied = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const declinedCount = applications.filter(a => a.status === 'Declined').length;
  const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());

  const getStatusBadge = (status: SchemeApplication['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Approved
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300">
            <Sparkles className="w-3 h-3 mr-1 text-purple-600" />
            Shortlisted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 mr-1 text-blue-600" />
            Under Review
          </span>
        );
      case 'Declined':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 cursor-pointer hover:bg-rose-100 transition-colors">
            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
            Declined
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

  return (
    <div className="space-y-6 emblem-watermark">
      {/* Welcome Citizen Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Citizen Portal • National Service Desk
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">ID: SM-IND-2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Namaste, {profile.fullName}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified resident of <strong>{profile.locality}, {profile.district}, {profile.state}</strong>. Access central and state public services seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">DigiLocker Status</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 10: Two Primary Service Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OPTION 1: Government Schemes */}
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between group hover:border-blue-500 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-800/60 border border-blue-400/30 flex items-center justify-center text-blue-200">
                <FileText className="w-6 h-6 text-blue-200" />
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 bg-blue-800/80 text-blue-200 rounded border border-blue-700">
                Direct Benefit Transfer
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {t.exploreSchemes}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {t.exploreSchemesDesc}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-blue-200">
              <span className="px-2 py-0.5 bg-blue-900/60 rounded">Education & Scholarships</span>
              <span className="px-2 py-0.5 bg-blue-900/60 rounded">Health & Insurance</span>
              <span className="px-2 py-0.5 bg-blue-900/60 rounded">Housing Subsidies</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-800/60 flex items-center justify-between">
            <button
              onClick={() => onNavigate('schemes')}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{t.exploreSchemesBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">12 Available Schemes</span>
          </div>
        </div>

        {/* OPTION 2: Raise a Public Complaint */}
        <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between group hover:border-amber-500 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-200">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                Civic Redressal
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {t.raiseComplaint}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {t.raiseComplaintDesc}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-amber-200">
              <span className="px-2 py-0.5 bg-stone-800 rounded">Damaged Roads</span>
              <span className="px-2 py-0.5 bg-stone-800 rounded">Streetlights</span>
              <span className="px-2 py-0.5 bg-stone-800 rounded">Sanitation & Drainage</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('raise-complaint')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{t.raiseComplaintBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">AI Petition + Auto Routing</span>
          </div>
        </div>
      </div>

      {/* SECTION 12: Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Applied */}
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'all' ? 'bg-white border-blue-800 ring-2 ring-blue-800/10 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t.schemesApplied}</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalApplied}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total registered</div>
        </div>

        {/* Shortlisted */}
        <div 
          onClick={() => setStatusFilter('shortlisted')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'shortlisted' ? 'bg-purple-50/50 border-purple-600 ring-2 ring-purple-600/10 shadow-xs' : 'bg-white border-slate-200 hover:border-purple-200'}`}
        >
          <div className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">{t.shortlisted}</div>
          <div className="text-2xl font-black text-purple-900 mt-1">{shortlistedCount}</div>
          <div className="text-[10px] text-purple-600 mt-0.5">In scrutiny stage</div>
        </div>

        {/* Approved */}
        <div 
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'approved' ? 'bg-emerald-50/50 border-emerald-600 ring-2 ring-emerald-600/10 shadow-xs' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
        >
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">{t.approved}</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{approvedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">DBT Sanctioned</div>
        </div>

        {/* Declined */}
        <div 
          onClick={() => setStatusFilter('declined')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === 'declined' ? 'bg-rose-50/50 border-rose-600 ring-2 ring-rose-600/10 shadow-xs' : 'bg-white border-slate-200 hover:border-rose-200'}`}
        >
          <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">{t.declined}</div>
          <div className="text-2xl font-black text-rose-900 mt-1">{declinedCount}</div>
          <div className="text-[10px] text-rose-600 mt-0.5">Review actionable steps</div>
        </div>

        {/* Active Complaints */}
        <div 
          onClick={() => onNavigate('my-complaints')}
          className="p-4 rounded-xl border bg-amber-50/40 border-amber-200 hover:border-amber-400 cursor-pointer transition-all col-span-2 sm:col-span-1"
        >
          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">{t.activeComplaints}</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{activeComplaintsCount}</div>
          <div className="text-[10px] text-amber-700 mt-0.5">Under civic action</div>
        </div>
      </div>

      {/* SECTION 12: Recent Scheme Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t.recentApplications}
            </h3>
            <p className="text-xs text-slate-500">
              {statusFilter === 'all' ? 'All submitted applications' : `Filtered by: ${statusFilter}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs text-blue-700 hover:underline font-medium"
              >
                Clear filter
              </button>
            )}
            <button
              onClick={() => onNavigate('schemes')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{t.viewAllSchemes}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.colSchemeName}</th>
                <th className="px-4 py-3 hidden md:table-cell">{t.colDepartment}</th>
                <th className="px-4 py-3 hidden sm:table-cell">{t.colAppliedDate}</th>
                <th className="px-4 py-3">{t.colStatus}</th>
                <th className="px-4 py-3 hidden lg:table-cell">{t.colLastUpdated}</th>
                <th className="px-4 py-3 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {t.noApplications}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 leading-snug">
                        {app.schemeName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        App No: {app.applicationNo}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell text-slate-600 max-w-xs truncate">
                      {app.department}
                    </td>

                    <td className="px-4 py-3.5 hidden sm:table-cell text-slate-600 whitespace-nowrap">
                      {app.appliedDate}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {app.status === 'Declined' ? (
                        <button
                          onClick={() => setSelectedDeclinedApp(app)}
                          title="Click to view reason for decline and next steps"
                          className="text-left"
                        >
                          {getStatusBadge(app.status)}
                        </button>
                      ) : (
                        getStatusBadge(app.status)
                      )}
                    </td>

                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-500 whitespace-nowrap">
                      {app.lastUpdated}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {app.status === 'Declined' ? (
                        <button
                          onClick={() => setSelectedDeclinedApp(app)}
                          className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
                        >
                          View Why
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenSchemeDetails(app.schemeId)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                        >
                          {t.viewDetails}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 45: How SevaMitra Works */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-900" />
          <span>{t.howItWorksTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="font-bold text-xs text-blue-900">{t.stepVerify}</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{t.stepVerifyDesc}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="font-bold text-xs text-blue-900">{t.stepDiscover}</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{t.stepDiscoverDesc}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="font-bold text-xs text-blue-900">{t.stepApply}</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{t.stepApplyDesc}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="font-bold text-xs text-amber-700">{t.stepReport}</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{t.stepReportDesc}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="font-bold text-xs text-emerald-700">{t.stepResolve}</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{t.stepResolveDesc}</p>
          </div>
        </div>
      </div>

      {/* SECTION 13: DECLINED APPLICATION DETAILS MODAL */}
      {selectedDeclinedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-rose-300" />
                <h3 className="font-bold text-sm">Application Status: Declined</h3>
              </div>
              <button 
                onClick={() => setSelectedDeclinedApp(null)}
                className="text-rose-200 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <div className="text-[11px] text-slate-500">Scheme Name</div>
                <div className="font-bold text-sm text-slate-900">{selectedDeclinedApp.schemeName}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">Application ID: {selectedDeclinedApp.applicationNo}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Applied Date</span>
                  <span className="font-medium">{selectedDeclinedApp.appliedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Department</span>
                  <span className="font-medium truncate block">{selectedDeclinedApp.department}</span>
                </div>
              </div>

              {/* Official Reason for Decline */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{t.reasonForDecline}</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  {selectedDeclinedApp.declineReason || 'Income eligibility threshold not satisfied as per revenue records.'}
                </p>
              </div>

              {/* What you can do next */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{t.whatYouCanDoNext}</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {selectedDeclinedApp.nextStepsGuidance || 'You may re-apply with an updated Tahsildar certified income certificate or explore alternative central subsidy schemes.'}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                * Note: SevaMitra displays official scrutiny remarks provided by the nodal administrative authority.
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDeclinedApp(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  setSelectedDeclinedApp(null);
                  onNavigate('chat-ai');
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Mitra for Guidance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
