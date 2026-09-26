import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Smartphone, 
  Mail, 
  User, 
  Briefcase, 
  Building, 
  FileCheck, 
  X,
  RefreshCw
} from 'lucide-react';
import { CitizenProfile, Language, ProfessionType } from '../types';
import { translations } from '../translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: CitizenProfile;
  onSaveProfile: (profile: CitizenProfile) => void;
  currentLang: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  currentLang,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<CitizenProfile>({ ...currentProfile });
  const [otpInput, setOtpInput] = useState<string>('482190');
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [confirmEmail, setConfirmEmail] = useState<string>(currentProfile.email);
  const [consentChecked, setConsentChecked] = useState<boolean>(true);

  if (!isOpen) return null;

  const t = translations[currentLang] || translations.en;

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      onSaveProfile(formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const simulateDigiLockerPull = () => {
    setFormData(prev => ({
      ...prev,
      digiLockerVerified: true,
      digiLockerVerifiedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      aadhaarMasked: 'XXXX XXXX 4821',
      panMasked: 'XXXXXX1234',
      fullName: 'Ramesh Kumar Varma',
      dob: '2003-05-14',
      age: 23,
      gender: 'Male',
      nationality: 'Indian',
      state: 'Telangana',
      district: 'Hyderabad',
      locality: 'Begumpet Ward 112',
    }));
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header with Government Strip */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center font-bold text-sm">
              SM
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                SevaMitra • Citizen Identity & Eligibility Verification
              </h2>
              <p className="text-[11px] text-slate-400">
                Official DigiLocker Integration Sandbox
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Step {step} of 7: {
              step === 1 ? 'DigiLocker Verification' :
              step === 2 ? 'Personal Information' :
              step === 3 ? 'Professional Details' :
              step === 4 ? 'Eligibility & Category' :
              step === 5 ? 'Contact & Mobile OTP' :
              step === 6 ? 'Consent & Privacy' : 'Verification Complete'
            }
          </span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7].map(s => (
              <div 
                key={s} 
                className={`h-1.5 w-5 rounded-full transition-colors ${
                  s === step ? 'bg-blue-800' : s < step ? 'bg-emerald-600' : 'bg-slate-200'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: DigiLocker Verification */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                <ShieldCheck className="w-9 h-9 text-blue-800" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Verify your identity with DigiLocker</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Your identity, date of birth, and residency will be securely authenticated using DigiLocker.
                  No need to manually enter or upload physical government documents.
                </p>
              </div>

              {/* Demo Sandbox Separation Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 max-w-md mx-auto text-left text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>DEMO VERIFICATION SANDBOX</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-normal">
                  In compliance with government safety guidelines, this demo uses a sandboxed verification simulator.
                  Sensitive Aadhaar & PAN numbers remain strictly masked.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={simulateDigiLockerPull}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Continue with DigiLocker</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-2">
                  Protected under National Digital Identity Standards • 256-bit SSL
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified via DigiLocker from Aadhaar Record. Basic fields pre-populated.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dob} 
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Masked Aadhaar Number</label>
                  <div className="flex items-center justify-between text-xs px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg font-mono text-slate-600">
                    <span>{formData.aadhaarMasked}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-sans font-semibold px-1.5 py-0.5 rounded">UIDAI Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Professional Details */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Select your primary occupation. This determines specific scholarship, enterprise loan, or farmer welfare scheme eligibility.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profession</label>
                <select 
                  value={formData.profession} 
                  onChange={e => setFormData({ ...formData, profession: e.target.value as ProfessionType })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="Student">Student</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Employee">Employee</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.profession === 'Student' && (
                <div className="space-y-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                  <div className="font-semibold text-xs text-blue-900">Student Proof Details</div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Institution / College Name</label>
                    <input 
                      type="text" 
                      value={formData.organizationOrInstitution} 
                      onChange={e => setFormData({ ...formData, organizationOrInstitution: e.target.value })}
                      placeholder="e.g. University College of Engineering"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Student Roll / ID Number</label>
                    <input 
                      type="text" 
                      value={formData.idNumber} 
                      onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                      placeholder="e.g. STU-2024-8842"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {formData.profession === 'Employee' && (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="font-semibold text-xs text-slate-800">Employment Details</div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Organization / Employer Name</label>
                    <input 
                      type="text" 
                      value={formData.organizationOrInstitution} 
                      onChange={e => setFormData({ ...formData, organizationOrInstitution: e.target.value })}
                      placeholder="e.g. Hyderabad Industrial Corp"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {formData.profession === 'Business Owner' && (
                <div className="space-y-3 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                  <div className="font-semibold text-xs text-amber-900">Enterprise Registration</div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Business Type / Trade</label>
                    <input 
                      type="text" 
                      value={formData.businessType || 'Retail Trading'} 
                      onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Eligibility Details */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                These criteria are collected only when required for affirmative welfare allocation, subsidized rations, or scholarships.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Caste Category</label>
                  <select 
                    value={formData.casteCategory} 
                    onChange={e => setFormData({ ...formData, casteCategory: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub-caste / Community</label>
                  <input 
                    type="text" 
                    value={formData.subCaste} 
                    onChange={e => setFormData({ ...formData, subCaste: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Household Annual Income Slab</label>
                  <select 
                    value={formData.incomeBracket} 
                    onChange={e => setFormData({ ...formData, incomeBracket: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Below 1.5 Lakh">Below ₹1.5 Lakhs (BPL Tier)</option>
                    <option value="1.5 Lakh - 3 Lakh">₹1.5 Lakh - ₹3.0 Lakhs (Subsidized)</option>
                    <option value="3 Lakh - 5 Lakh">₹3.0 Lakh - ₹5.0 Lakhs</option>
                    <option value="5 Lakh - 8 Lakh">₹5.0 Lakh - ₹8.0 Lakhs</option>
                    <option value="Above 8 Lakh">Above ₹8.0 Lakhs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Physically Disabled (Divyangjan)</label>
                  <select 
                    value={formData.physicallyDisabled ? 'Yes' : 'No'} 
                    onChange={e => setFormData({ ...formData, physicallyDisabled: e.target.value === 'Yes' })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (40%+ benchmark disability)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
                  <select 
                    value={formData.maritalStatus} 
                    onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced / Single</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ration Card No</label>
                  <input 
                    type="text" 
                    value={formData.rationCard} 
                    onChange={e => setFormData({ ...formData, rationCard: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Contact Verification & OTP */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded font-semibold border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="tel" 
                    value={formData.mobile} 
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* OTP Simulation Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Verify your mobile number via OTP
                </div>
                <p className="text-[11px] text-slate-500">
                  Enter 6-digit OTP sent to {formData.mobile}
                </p>

                <div className="flex justify-center space-x-2 py-1">
                  {otpInput.split('').map((digit, idx) => (
                    <div 
                      key={idx} 
                      className="w-9 h-10 border-2 border-blue-900 bg-white rounded-lg flex items-center justify-center font-mono font-bold text-base text-slate-800 shadow-xs"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-blue-700 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>OTP Verified Successfully</span>
                </div>
              </div>

              {/* Under 18 Guardian requirement check */}
              {formData.age < 18 && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900">
                  <label className="block font-bold mb-1">Parent / Guardian Mobile Number (Mandatory for Minors)</label>
                  <input 
                    type="tel" 
                    value={formData.guardianMobile || ''} 
                    onChange={e => setFormData({ ...formData, guardianMobile: e.target.value })}
                    placeholder="+91 Mobile number"
                    className="w-full text-xs px-3 py-2 border border-amber-300 rounded-lg bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Consent & Privacy */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-blue-900" />
                <span>Citizen Consent & Legal Data Protection</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  1. <strong>Purpose Limitation:</strong> Information pulled from DigiLocker is used exclusively to evaluate scheme eligibility criteria and route civic complaints to administrative departments.
                </p>
                <p>
                  2. <strong>Identity Masking:</strong> Aadhaar numbers are never displayed in full or stored unencrypted. Only last 4 digits (XXXX XXXX 4821) remain visible for verification receipts.
                </p>
                <p>
                  3. <strong>Zero Commercial Tracking:</strong> SevaMitra operates under government digital public infrastructure guidelines and does not monetize or transfer citizen data.
                </p>
              </div>

              <label className="flex items-start space-x-2.5 text-xs text-slate-800 cursor-pointer pt-2">
                <input 
                  type="checkbox" 
                  checked={consentChecked} 
                  onChange={e => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-blue-900 focus:ring-blue-700" 
                />
                <span className="font-medium">
                  I give consent for SevaMitra to check my eligibility parameters against welfare schemes and forward civic complaints on my behalf.
                </span>
              </label>
            </div>
          )}

          {/* STEP 7: Completed */}
          {step === 7 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Citizen Profile Ready & Verified!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Welcome, <strong>{formData.fullName}</strong>. You are now verified to access government schemes and file public grievance petitions.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-sm mx-auto text-left text-xs font-mono space-y-1">
                <div>Citizen ID: SM-CITIZEN-98124</div>
                <div>Status: DigiLocker Verified ✓</div>
                <div>Jurisdiction: {formData.district}, {formData.state}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          {step > 1 && step < 7 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 6 && !consentChecked}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>{step === 1 ? 'Verify & Continue' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Go to SevaMitra Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
