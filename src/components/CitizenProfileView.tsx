import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Lock, 
  Edit3, 
  X, 
  Check, 
  AlertCircle,
  Building
} from 'lucide-react';
import { CitizenProfile, Language, ProfessionType } from '../types';
import { translations } from '../translations';

interface CitizenProfileViewProps {
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  currentLang: Language;
  onOpenReverification: () => void;
}

export const CitizenProfileView: React.FC<CitizenProfileViewProps> = ({
  profile,
  onUpdateProfile,
  currentLang,
  onOpenReverification,
}) => {
  const t = translations[currentLang] || translations.en;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CitizenProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {profile.fullName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{profile.fullName}</h2>
                {profile.digiLockerVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    DigiLocker Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Citizen ID: <strong>SM-IND-2026-98124</strong> • National Citizen Directory
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-600">
                <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">{profile.profession}</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">{profile.casteCategory}</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">{profile.locality}, {profile.district}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.editProfile}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 33: Security & Masking Notice */}
      <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-900">
        <Lock className="w-4 h-4 text-blue-800 shrink-0" />
        <span className="text-[11px]">
          {t.demoVerificationNotice} Official credentials can only be refreshed via the DigiLocker gateway.
        </span>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">{t.personalInfo}</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Legal Name:</span>
              <span className="font-bold text-slate-900">{profile.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date of Birth:</span>
              <span className="font-medium text-slate-800">{profile.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Age:</span>
              <span className="font-medium text-slate-800">{profile.age} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gender:</span>
              <span className="font-medium text-slate-800">{profile.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nationality:</span>
              <span className="font-medium text-slate-800">{profile.nationality}</span>
            </div>
          </div>
        </div>

        {/* Identity & DigiLocker */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">{t.identityInfo}</h3>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              UIDAI & DigiLocker
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Aadhaar (Masked):</span>
              <span className="font-bold text-slate-900">{profile.aadhaarMasked}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">PAN (Masked):</span>
              <span className="font-bold text-slate-900">{profile.panMasked}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans">Ration Card:</span>
              <span className="font-bold text-slate-900">{profile.rationCard}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-100 font-sans">
              <span className="text-slate-500">Verification Date:</span>
              <span className="text-emerald-700 font-semibold">{profile.digiLockerVerifiedDate || '12-Jan-2026'}</span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">{t.professionalInfo}</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Profession:</span>
              <span className="font-bold text-slate-900">{profile.profession}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Institution / Org:</span>
              <span className="font-medium text-slate-800 text-right max-w-xs">{profile.organizationOrInstitution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student / Employee ID:</span>
              <span className="font-mono text-slate-800">{profile.idNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Uploaded Proof:</span>
              <span className="text-blue-900 font-medium">{profile.proofDocumentName}</span>
            </div>
          </div>
        </div>

        {/* Social & Eligibility Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">{t.eligibilityInfo}</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Caste Category:</span>
              <span className="font-bold text-slate-900">{profile.casteCategory} ({profile.subCaste})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Household Annual Income:</span>
              <span className="font-bold text-slate-900">₹{profile.annualHouseholdIncome.toLocaleString('en-IN')} ({profile.incomeBracket})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Physically Disabled:</span>
              <span className="font-medium text-slate-800">{profile.physicallyDisabled ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Marital Status:</span>
              <span className="font-medium text-slate-800">{profile.maritalStatus}</span>
            </div>
          </div>
        </div>

        {/* Contact & Location (Full Width) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Contact & Residential Address</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Primary Email</span>
              <span className="font-medium text-slate-900">{profile.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Mobile Number</span>
              <span className="font-mono text-slate-900">{profile.mobile}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Guardian Phone</span>
              <span className="font-mono text-slate-900">{profile.guardianMobile || 'N/A'}</span>
            </div>
            <div className="sm:col-span-3 pt-2 border-t border-slate-100 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">
                <strong>Address:</strong> {profile.locality}, {profile.landmark ? `(Near: ${profile.landmark}), ` : ''} {profile.district}, {profile.state}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
