import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Send, 
  X, 
  Check, 
  Layers, 
  ShieldAlert,
  ArrowRight,
  Filter,
  UserCheck
} from 'lucide-react';
import { Complaint, ComplaintStatus, Language } from '../types';
import { translations } from '../translations';
import { departmentRoutingDatabase } from '../data/mockData';

interface AdminPortalViewProps {
  complaints: Complaint[];
  onUpdateComplaintStatus: (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    officerRemarks?: string,
    reassignedDept?: string
  ) => void;
  currentLang: Language;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  complaints,
  onUpdateComplaintStatus,
  currentLang,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusInput, setStatusInput] = useState<ComplaintStatus>('In Progress');
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [deptInput, setDeptInput] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Statistics
  const totalReceived = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const underReviewCount = complaints.filter(c => c.status === 'Under Review' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const highPriorityCount = complaints.filter(c => c.priorityScore === 'High' || c.urgency === 'Emergency').length;

  const handleOpenActionModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setStatusInput(c.status);
    setRemarksInput(c.officerRemarks || '');
    setDeptInput(c.assignedDepartment);
  };

  const handleApplyStatusChange = () => {
    if (!selectedComplaint) return;
    onUpdateComplaintStatus(selectedComplaint.id, statusInput, remarksInput, deptInput);
    setActionSuccess(`Grievance ${selectedComplaint.complaintId} updated to "${statusInput}". Citizen notified.`);
    setTimeout(() => setActionSuccess(null), 4000);
    setSelectedComplaint(null);
  };

  const filteredList = complaints.filter(c => {
    if (filterDept === 'all') return true;
    return c.assignedDepartment.toLowerCase().includes(filterDept.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                Executive Administration View
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs">Greater Hyderabad Municipal Corporation & State Departments</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Public Grievances Officer Command Desk
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Review incoming citizen evidence, dispatch engineering squads, and update resolution milestones.
            </p>
          </div>

          <div className="px-3.5 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">Nodal Officer</span>
              <span className="font-bold text-white">Sri K. Venkatesh, SE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Complaints Received</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalReceived}</span>
          <span className="text-[10px] text-slate-400">Total in circle</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-200">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Under Scrutiny</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{underReviewCount}</span>
          <span className="text-[10px] text-blue-600">Pending spot check</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">{inProgressCount}</span>
          <span className="text-[10px] text-amber-600">Squad deployed</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{resolvedCount}</span>
          <span className="text-[10px] text-emerald-600">Verified complete</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-200 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">High Priority</span>
          <span className="text-2xl font-black text-rose-900 mt-1 block">{highPriorityCount}</span>
          <span className="text-[10px] text-rose-600">Emergency / Hazard</span>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Circle Grievance Registry</h3>
            <p className="text-xs text-slate-500">Live civic queue with instant status override</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Department:</span>
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Departments</option>
              <option value="Roads">Roads & Buildings / GHMC</option>
              <option value="Sanitation">Sanitation & Health</option>
              <option value="Water">HMWSSB Water Supply</option>
              <option value="Electrical">Public Works Electrical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Grievance ID</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 hidden md:table-cell">Location</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {c.complaintId}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                    {c.citizenName}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {c.category}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600 max-w-xs truncate">
                    {c.location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.urgency === 'Emergency' || c.priorityScore === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                      c.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenActionModal(c)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-amber-500/20 hover:bg-amber-500/40 text-amber-950 rounded-lg border border-amber-500/40 transition-colors"
                    >
                      Update / Remarks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICER ACTION & REMARKS MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[11px] text-amber-400 uppercase font-bold tracking-wider">
                  Administrative Redressal Console
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Update Grievance: {selectedComplaint.complaintId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Evidence & Citizen overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Citizen Name & Location</span>
                  <span className="font-bold text-slate-900">{selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})</span>
                  <p className="text-slate-600 mt-0.5">{selectedComplaint.location}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Affected Count & Category</span>
                  <span className="font-bold text-slate-800">{selectedComplaint.affectedCount} residents impacted</span>
                  <p className="text-slate-600 mt-0.5">{selectedComplaint.category}</p>
                </div>
              </div>

              {selectedComplaint.evidenceUrl && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1 text-[11px] uppercase tracking-wide">
                    Attached Evidence Photo
                  </span>
                  <img 
                    src={selectedComplaint.evidenceUrl} 
                    alt="Citizen Evidence" 
                    className="w-full h-44 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              {/* Status Update Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Change Grievance Status
                </label>
                <select
                  value={statusInput}
                  onChange={e => setStatusInput(e.target.value as ComplaintStatus)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                >
                  <option value="Submitted">Submitted (Queued for scrutiny)</option>
                  <option value="Assigned">Assigned (Forwarded to division)</option>
                  <option value="Under Review">Under Review (Site inspection ordered)</option>
                  <option value="In Progress">In Progress (Public works squad deployed)</option>
                  <option value="Resolved">Resolved (Work completed & verified)</option>
                </select>
              </div>

              {/* Officer Inspection Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Official Field Inspection Remarks & Action Proof
                </label>
                <textarea
                  rows={3}
                  value={remarksInput}
                  onChange={e => setRemarksInput(e.target.value)}
                  placeholder="e.g. Work squad dispatched with wet mix macadam and roller. Surface leveled; final bitumen layer scheduled in 48 hours."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                Notice: Status updates and official notes will instantly be pushed to the citizen dashboard and notification bell.
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Notify Citizen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
