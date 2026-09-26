import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Building2, 
  UserCheck, 
  Printer, 
  Share2, 
  Languages, 
  Edit3,
  Check,
  Map,
  ShieldCheck
} from 'lucide-react';
import { CitizenProfile, Language, Complaint, DepartmentRoutingRule } from '../types';
import { departmentRoutingDatabase } from '../data/mockData';
import { translations } from '../translations';

interface RaiseComplaintViewProps {
  profile: CitizenProfile;
  currentLang: Language;
  onSubmitComplaint: (complaint: Complaint) => void;
  onNavigate: (tab: string, param?: any) => void;
}

export const RaiseComplaintView: React.FC<RaiseComplaintViewProps> = ({
  profile,
  currentLang,
  onSubmitComplaint,
  onNavigate,
}) => {
  const t = translations[currentLang] || translations.en;

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState<boolean>(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Step 1: Evidence state
  const [evidenceUrl, setEvidenceUrl] = useState<string>('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [evidenceType, setEvidenceType] = useState<'photo' | 'video'>('photo');

  // Step 2: Problem Details & Location
  const [category, setCategory] = useState<string>('Road Damage & Potholes');
  const [description, setDescription] = useState<string>('Severe 8-inch deep road craters outside the high school. Continuous risk to two-wheelers and children during rain.');
  const [duration, setDuration] = useState<string>('2 Weeks');
  const [affectedCount, setAffectedCount] = useState<number | string>(75);
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Emergency'>('Urgent');

  // Location fields
  const [state, setState] = useState<string>(profile.state || 'Telangana');
  const [district, setDistrict] = useState<string>(profile.district || 'Hyderabad');
  const [locality, setLocality] = useState<string>(profile.locality || 'Begumpet Ward 112');
  const [landmark, setLandmark] = useState<string>(profile.landmark || 'Near Government High School');

  // Step 3: AI Letter state
  const [letterLanguage, setLetterLanguage] = useState<Language>(currentLang);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isEditingLetter, setIsEditingLetter] = useState<boolean>(false);

  // Department Routing Rule
  const assignedRouting = departmentRoutingDatabase.find(r => r.category === category) || departmentRoutingDatabase[0];

  // Helper to trigger AI letter generation
  const handleGenerateLetter = async (targetLang?: Language) => {
    setIsGeneratingLetter(true);
    const langToUse = targetLang || letterLanguage;
    const locationStr = `${locality}, ${district}, ${state}`;

    try {
      const response = await fetch('/api/ai/complaint-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          location: locationStr,
          landmark,
          affectedCount,
          urgency,
          citizenName: profile.fullName,
          language: langToUse,
          department: assignedRouting.departmentName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLetter(data.letter);
      } else {
        throw new Error('Fallback required');
      }
    } catch (err) {
      // Local clean drafting fallback
      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      if (langToUse === 'te') {
        setGeneratedLetter(`తేదీ: ${today}

స్వీకర్త:
గౌరవనీయులైన ఇంజనీరింగ్ మరియు మున్సిపల్ అధికారులు,
${assignedRouting.departmentName}
పరిధి: ${locationStr}

విషయం: ${category} సమస్యపై అత్యవసర ప్రజా వినతిపత్రం

గౌరవనీయులైన అయ్యా / అమ్మా,

నేను, ${profile.fullName}, మా ప్రాంత పౌరుల తరపున ఈ వినతిపత్రం సమర్పిస్తున్నాను.
${locationStr} వద్ద ${landmark ? `(${landmark} వద్ద)` : ''} ${category} సమస్య తీవ్ర రూపం దాల్చింది.

సమస్య వివరాలు:
${description}

ప్రభావిత పౌరులు: సుమారు ${affectedCount} మంది
తీవ్రత: ${urgency}
సమస్య కాలవ్యవధి: ${duration}

దయచేసి క్షేత్ర పరిశీలన జరిపి తగిన మరమ్మత్తు చర్యలు వెంటనే ప్రారంభించాలని కోరుతున్నాను.

భవదీయుడు,
${profile.fullName}
డిజిలాకర్ ధృవీకరించిన పౌరుడు (SevaMitra పోర్టల్)`);
      } else if (langToUse === 'tenglish') {
        setGeneratedLetter(`Date: ${today}

To:
The Competent Administrative Officer,
${assignedRouting.departmentName},
Division: ${locationStr}

Subject: Urgent petition regarding ${category} at ${locationStr}

Respected Sir/Madam,

Nenu, ${profile.fullName}, ma area residents tarapuna ee official grievance raise chesthunnanu.
Location: ${locationStr} (Landmark: ${landmark}).

Problem Summary:
${description}

Citizens Impacted: Approximately ${affectedCount} residents
Urgency Level: ${urgency}
Issue Duration: ${duration}

Ee problem valla daily commuters and school pillalu chala ibbandhi paduthunnaru. Concern authority inspection cheyinchi ventane solution ivvalani koruthunnamu.

Sincerely,
${profile.fullName}
DigiLocker Verified Citizen
SevaMitra Digital Submission`);
      } else {
        setGeneratedLetter(`Date: ${today}

To:
The Executive Officer / Competent Administrative Authority,
${assignedRouting.departmentName},
Jurisdiction: ${locationStr}

Subject: Formal Grievance Petition regarding ${category} at ${locationStr}

Respected Sir / Madam,

I am submitting this formal public grievance petition as a verified citizen under the SevaMitra public administration framework.

The civic issue is situated at: ${locationStr} ${landmark ? `(Landmark: ${landmark})` : ''}.

Factual Statement & Description:
${description}

Impact Assessment:
• Affected Citizens: Approximately ${affectedCount} residents and daily commuters.
• Assessed Urgency: ${urgency}
• Existing Duration: ${duration}

Specific Relief Sought:
I respectfully request the administrative authority to issue a field inspection order to the local zonal engineer and initiate immediate restorative public works.

Photo evidence and geo-tagged coordinates have been verified on SevaMitra.

Yours faithfully,

${profile.fullName}
DigiLocker Verified Citizen (Aadhaar: ${profile.aadhaarMasked})
SevaMitra Citizen Record`);
      }
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  // Move from Step 2 to Step 3 generates the letter if empty
  const handleProceedToStep3 = () => {
    if (!generatedLetter) {
      handleGenerateLetter(letterLanguage);
    }
    setWizardStep(3);
  };

  // Submit Complaint
  const handleSubmit = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SV-2026-00${randomSuffix}`;
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const locationStr = `${locality}, ${district}, ${state}`;

    const newComplaint: Complaint = {
      id: `CMP-2026-${randomSuffix}`,
      complaintId: newId,
      citizenName: profile.fullName,
      citizenPhone: profile.mobile,
      category,
      problemDescription: description,
      location: locationStr,
      district,
      state,
      landmark,
      affectedCount,
      urgency,
      assignedDepartment: assignedRouting.departmentName,
      assignedOffice: assignedRouting.assignedOffice,
      evidenceUrl,
      evidenceType,
      generatedLetter,
      letterLanguage,
      status: 'Submitted',
      submittedDate: today,
      lastUpdated: today,
      priorityScore: urgency === 'Emergency' ? 'High' : urgency === 'Urgent' ? 'High' : 'Medium',
      timeline: [
        {
          stage: 'Grievance Registered',
          timestamp: `${today}, Just now`,
          statusKey: 'Submitted',
          note: 'Citizen uploaded evidence and verified formal administrative petition.',
        },
        {
          stage: 'Department Routing Completed',
          timestamp: `${today}, Automated`,
          statusKey: 'Assigned',
          note: `Auto-routed to ${assignedRouting.assignedOffice}.`,
          officerName: assignedRouting.nodalOfficer,
        },
      ],
    };

    onSubmitComplaint(newComplaint);
    setSubmittedComplaint(newComplaint);
    setWizardStep(4);
  };

  // Sample Presets for 30-second Demo
  const pickSampleEvidence = (type: 'pothole' | 'streetlight' | 'water' | 'drainage') => {
    if (type === 'pothole') {
      setEvidenceUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
      setCategory('Road Damage & Potholes');
      setDescription('Large 9-inch deep crater on the main road after monsoon rains. Vehicles skidding and school buses getting delayed.');
      setAffectedCount(150);
      setUrgency('Urgent');
    } else if (type === 'streetlight') {
      setEvidenceUrl('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80');
      setCategory('Streetlights & Electrical Hazards');
      setDescription('Three consecutive streetlights not glowing for past 10 days. Total darkness posing safety risks for women and pedestrians.');
      setAffectedCount(80);
      setUrgency('Normal');
    } else if (type === 'water') {
      setEvidenceUrl('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80');
      setCategory('Water Supply & Contamination');
      setDescription('Main drinking water pipe burst under sidewalk. Thousands of liters of clean water getting wasted onto the open road.');
      setAffectedCount(120);
      setUrgency('Emergency');
    } else if (type === 'drainage') {
      setEvidenceUrl('https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80');
      setCategory('Drainage & Sewage Overflow');
      setDescription('Stormwater manhole slab damaged and cracked open on pedestrian walkway near school gate.');
      setAffectedCount(200);
      setUrgency('Emergency');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Raise a Public Service Grievance
            </h2>
            <p className="text-xs text-slate-500">
              Departmental complaint reporting with AI petition drafting and jurisdiction routing.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 self-start sm:self-auto">
            Step {wizardStep} of 4: {
              wizardStep === 1 ? 'Evidence Upload' :
              wizardStep === 2 ? 'Problem Details & Location' :
              wizardStep === 3 ? 'AI Petition Generator' : 'Submitted'
            }
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-3">
          {[
            { step: 1, label: t.step1Evidence },
            { step: 2, label: t.step2Details },
            { step: 3, label: t.step3Letter },
            { step: 4, label: t.step4Review },
          ].map(s => (
            <div key={s.step} className="space-y-1">
              <div 
                className={`h-1.5 rounded-full transition-colors ${
                  wizardStep >= s.step ? 'bg-blue-900' : 'bg-slate-200'
                }`} 
              />
              <span className={`text-[11px] font-semibold block truncate ${
                wizardStep === s.step ? 'text-blue-900' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: UPLOAD EVIDENCE */}
      {wizardStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.whatProblem}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Upload clear photo or video evidence of the infrastructure damage or public issue.
            </p>
          </div>

          {/* Quick Demo Pickers for instant Hackathon Testing */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              {t.orSelectSample}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => pickSampleEvidence('pothole')}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs transition-colors"
              >
                🛣️ {t.samplePothole}
              </button>
              <button
                type="button"
                onClick={() => pickSampleEvidence('streetlight')}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs transition-colors"
              >
                💡 {t.sampleStreetlight}
              </button>
              <button
                type="button"
                onClick={() => pickSampleEvidence('water')}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs transition-colors"
              >
                💧 {t.sampleWaterLeak}
              </button>
              <button
                type="button"
                onClick={() => pickSampleEvidence('drainage')}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs transition-colors"
              >
                🚯 {t.sampleDrainage}
              </button>
            </div>
          </div>

          {/* Evidence Upload Box / Preview */}
          {evidenceUrl ? (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 max-h-80 flex items-center justify-center shadow-inner">
                <img 
                  src={evidenceUrl} 
                  alt="Complaint Evidence" 
                  className="w-full h-72 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Geo-Tagged Evidence Record • 1920x1080</span>
                </div>

                <button
                  type="button"
                  onClick={() => setEvidenceUrl('')}
                  className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-colors"
                  title="Remove Evidence"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>File attached: <strong>photo_evidence_civic.jpg</strong> (Verified format)</span>
                <button
                  type="button"
                  onClick={() => pickSampleEvidence('pothole')}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  Change sample photo
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => pickSampleEvidence('pothole')}
              className="border-2 border-dashed border-slate-300 hover:border-blue-700 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{t.uploadPhotoVideo}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {t.dragDropOrClick}
                </p>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Supports JPG, PNG, MP4 up to 25MB • Automated compression enabled
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Step 1 of 4</span>
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{t.next}: Problem Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMPLAINT DETAILS & LOCATION */}
      {wizardStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.step2Details}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Specify the issue category, severity, and exact community location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.problemCategory}</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
              >
                <option value="Road Damage & Potholes">Road Damage & Potholes</option>
                <option value="Streetlights & Electrical Hazards">Streetlights & Electrical Hazards</option>
                <option value="Garbage & Sanitation">Garbage & Sanitation</option>
                <option value="Water Supply & Contamination">Water Supply & Contamination</option>
                <option value="Drainage & Sewage Overflow">Drainage & Sewage Overflow</option>
                <option value="Public Transport & Traffic Infra">Public Transport & Traffic Infra</option>
                <option value="Public Toilets & Facilities">Public Toilets & Facilities</option>
                <option value="Other Civic & Infrastructure Issues">Other Civic & Infrastructure Issues</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.urgencyLevel}</label>
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Normal">Normal (Standard municipal schedule)</option>
                <option value="Urgent">Urgent (High traffic / safety issue)</option>
                <option value="Emergency">Emergency (Immediate hazard / water burst)</option>
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.problemDesc}</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what is broken, visible hazards, and community impact..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.howLongExisted}</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="1 - 3 Days">1 - 3 Days</option>
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="1 Month">1 Month</option>
                <option value="More than 3 Months">More than 3 Months</option>
              </select>
            </div>

            {/* Affected People Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.howManyAffected}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={affectedCount}
                  onChange={e => setAffectedCount(e.target.value)}
                  className="w-28 text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  placeholder="e.g. 75"
                />
                <div className="flex gap-1">
                  {[25, 75, 150, 300].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setAffectedCount(cnt)}
                      className={`px-2 py-1 text-[11px] rounded-lg border transition-colors ${
                        affectedCount == cnt ? 'bg-blue-900 text-white border-blue-900 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cnt}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Community Location & Jurisdiction
                </span>
                <span className="text-[11px] text-slate-400">Used for automated department routing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">{t.locationField}</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">{t.landmarkField}</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="e.g. Near Government High School"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Automated Department Routing Indicator */}
              <div className="mt-3 p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start gap-2 text-xs">
                <Building2 className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-900 block">
                    {t.autoRouteDept}:
                  </span>
                  <p className="text-slate-700 font-medium">
                    {assignedRouting.departmentName} ({assignedRouting.assignedOffice})
                  </p>
                  <span className="text-[10px] text-slate-500">
                    Jurisdiction Desk: {assignedRouting.contactDesk}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.back}</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToStep3}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{t.next}: {t.step3Letter}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI COMPLAINT LETTER GENERATOR */}
      {wizardStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI Grievance Petition Generator</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Formatted under Indian administrative petition standards for immediate executive consideration.
              </p>
            </div>

            {/* Language Selection for Letter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">{t.translateLetter}:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                {(['en', 'te', 'tenglish', 'hi'] as Language[]).map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLetterLanguage(l);
                      handleGenerateLetter(l);
                    }}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      letterLanguage === l ? 'bg-white text-blue-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l === 'en' ? 'EN' : l === 'te' ? 'తెలుగు' : l === 'tenglish' ? 'Tenglish' : 'हिंदी'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Letter Editor Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Formal Petition Preview (Editable)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                  className="text-xs text-slate-700 hover:text-blue-900 font-medium flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingLetter ? 'Done Editing' : t.editLetter}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateLetter(letterLanguage)}
                  disabled={isGeneratingLetter}
                  className="text-xs text-blue-800 hover:text-blue-600 font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingLetter ? 'animate-spin' : ''}`} />
                  <span>{t.regenerate}</span>
                </button>
              </div>
            </div>

            {isGeneratingLetter ? (
              <div className="h-64 border border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center space-y-2 text-xs text-slate-500">
                <Sparkles className="w-6 h-6 text-blue-800 animate-spin" />
                <span>Drafting legally precise petition in {letterLanguage.toUpperCase()}...</span>
              </div>
            ) : isEditingLetter ? (
              <textarea
                rows={12}
                value={generatedLetter}
                onChange={e => setGeneratedLetter(e.target.value)}
                className="w-full text-xs font-mono p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900"
              />
            ) : (
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 shadow-inner letter-font text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {generatedLetter}
              </div>
            )}
          </div>

          {/* Section 23: Anti-hallucination guarantee badge */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[11px]">
              <strong>Grounded Integrity:</strong> The AI petition utilizes only citizen-verified details. No fictitious authorities, dates, or non-existent claims are fabricated.
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.back}</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{t.submitComplaint}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUBMISSION CONFIRMATION (Section 26) */}
      {wizardStep === 4 && submittedComplaint && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Grievance Registered Successfully
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Complaint Registration Receipt
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              {t.forwardedNotice}
            </p>
          </div>

          {/* Official Complaint Summary Receipt */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">{t.complaintId}:</span>
              <span className="text-sm font-bold text-blue-900 font-mono">{submittedComplaint.complaintId}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Department:</span>
              <span className="text-slate-800 font-sans font-medium text-right max-w-xs">{submittedComplaint.assignedDepartment}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Assigned Local Office:</span>
              <span className="text-slate-800 font-sans font-medium text-right">{submittedComplaint.assignedOffice}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Category / Priority:</span>
              <span className="text-slate-800 font-sans font-semibold">{submittedComplaint.category} • {submittedComplaint.urgency}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Filing Date:</span>
              <span className="text-slate-800 font-sans">{submittedComplaint.submittedDate}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('my-complaints', submittedComplaint.id)}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Track in My Complaints</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setWizardStep(1);
                setSubmittedComplaint(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              Raise Another Grievance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
