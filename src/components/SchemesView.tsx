import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  ChevronRight, 
  X, 
  Info, 
  FileText,
  Building,
  GraduationCap,
  Tractor,
  Home,
  HeartPulse,
  Coins,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Scheme, Language, CitizenProfile, ProfessionType } from '../types';
import { translations } from '../translations';

interface SchemesViewProps {
  schemes: Scheme[];
  profile: CitizenProfile;
  currentLang: Language;
  onApplyScheme: (scheme: Scheme) => void;
  selectedSchemeId?: string;
  onClearSelectedScheme?: () => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  schemes,
  profile,
  currentLang,
  onApplyScheme,
  selectedSchemeId,
  onClearSelectedScheme,
}) => {
  const t = translations[currentLang] || translations.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [activeSchemeModal, setActiveSchemeModal] = useState<Scheme | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<string[]>(['SCH-EDU-01']);
  const [showAppliedToast, setShowAppliedToast] = useState<string | null>(null);

  // If selectedSchemeId is passed from outside, open modal
  React.useEffect(() => {
    if (selectedSchemeId) {
      const match = schemes.find(s => s.id === selectedSchemeId);
      if (match) setActiveSchemeModal(match);
    }
  }, [selectedSchemeId, schemes]);

  // Compute algorithmic match for each scheme against citizen profile
  const schemeMatches = useMemo(() => {
    const map = new Map<string, { score: number; whyRelevant: string[]; missingInfo: string[] }>();

    schemes.forEach(scheme => {
      let score = 70;
      const why: string[] = [];
      const missing: string[] = [];

      // Profession match
      if (scheme.targetProfessions.includes(profile.profession)) {
        score += 18;
        why.push(`Matches your verified occupation: ${profile.profession}`);
      } else {
        missing.push(`Primary target is ${scheme.targetProfessions.join(', ')}`);
      }

      // Income limit match
      if (scheme.maxIncome) {
        if (profile.annualHouseholdIncome <= scheme.maxIncome) {
          score += 8;
          why.push(`Household income (₹${profile.annualHouseholdIncome.toLocaleString('en-IN')}) satisfies the ₹${scheme.maxIncome.toLocaleString('en-IN')} ceiling.`);
        } else {
          score -= 25;
          missing.push(`Income exceeds the prescribed ₹${scheme.maxIncome.toLocaleString('en-IN')} cap.`);
        }
      } else {
        why.push('Universal welfare scheme with no restricted income ceiling.');
      }

      // Caste category match
      if (scheme.casteRestrictions) {
        if (scheme.casteRestrictions.includes(profile.casteCategory)) {
          score += 4;
          why.push(`Belongs to eligible affirmative category: ${profile.casteCategory}`);
        } else {
          score -= 15;
          missing.push(`Reserved for: ${scheme.casteRestrictions.join(', ')}`);
        }
      }

      // Age checks
      if (scheme.minAge && profile.age < scheme.minAge) {
        score -= 20;
        missing.push(`Minimum age is ${scheme.minAge} years (Citizen is ${profile.age}).`);
      } else if (scheme.maxAge && profile.age > scheme.maxAge) {
        score -= 20;
        missing.push(`Maximum age is ${scheme.maxAge} years (Citizen is ${profile.age}).`);
      } else if (scheme.minAge || scheme.maxAge) {
        why.push(`Age (${profile.age} years) is within the eligible age group.`);
      }

      // Normalize score between 40 and 98
      const clampedScore = Math.min(98, Math.max(45, score));
      map.set(scheme.id, { score: clampedScore, whyRelevant: why, missingInfo: missing });
    });

    return map;
  }, [schemes, profile]);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const titleMatch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (scheme.title_te && scheme.title_te.includes(searchQuery)) ||
                         (scheme.title_tenglish && scheme.title_tenglish.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (scheme.title_hi && scheme.title_hi.includes(searchQuery)) ||
                         scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const categoryMatch = selectedCategory === 'all' || scheme.category === selectedCategory;
      const professionMatch = selectedProfession === 'all' || scheme.targetProfessions.includes(selectedProfession as ProfessionType);

      return titleMatch && categoryMatch && professionMatch;
    }).sort((a, b) => {
      const scoreA = schemeMatches.get(a.id)?.score || 0;
      const scoreB = schemeMatches.get(b.id)?.score || 0;
      return scoreB - scoreA;
    });
  }, [schemes, searchQuery, selectedCategory, selectedProfession, schemeMatches]);

  const toggleSaveScheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedSchemes(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleApply = (scheme: Scheme) => {
    onApplyScheme(scheme);
    setShowAppliedToast(scheme.title);
    setTimeout(() => setShowAppliedToast(null), 4000);
    setActiveSchemeModal(null);
  };

  const getLocalizedTitle = (s: Scheme) => {
    if (currentLang === 'te' && s.title_te) return s.title_te;
    if (currentLang === 'tenglish' && s.title_tenglish) return s.title_tenglish;
    if (currentLang === 'hi' && s.title_hi) return s.title_hi;
    return s.title;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showAppliedToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center space-x-3 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Application tracked for: <strong>{showAppliedToast}</strong></span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                AI Welfare Intelligence Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">Government of India Beneficiary Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.recommendedForYou}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.recommendedDesc} Matched with <strong>{profile.fullName}</strong> ({profile.profession}, {profile.casteCategory}, Income bracket {profile.incomeBracket}).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Citizen Match Active
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-800 transition-all"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Education">Education & Scholarships</option>
              <option value="Healthcare">Healthcare & Health Insurance</option>
              <option value="Housing">Housing & PMAY</option>
              <option value="Agriculture">Agriculture & PM Kisan</option>
              <option value="Financial & MSME">Financial, Loans & MSME</option>
              <option value="Social Welfare">Social Security & Pensions</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedProfession}
              onChange={e => setSelectedProfession(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">All Professions</option>
              <option value="Student">Student</option>
              <option value="Farmer">Farmer</option>
              <option value="Employee">Employee</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matching Disclaimer Strip */}
      <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-700 shrink-0" />
        <span className="text-[11px] leading-snug">
          <strong>Important Citizen Notice:</strong> {t.disclaimerMatch} Official sanction is granted solely by the concerned Ministry/Department following statutory document verification.
        </span>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => {
          const matchData = schemeMatches.get(scheme.id);
          const matchScore = matchData?.score || 75;
          const isSaved = savedSchemes.includes(scheme.id);

          return (
            <div
              key={scheme.id}
              onClick={() => setActiveSchemeModal(scheme)}
              className="bg-white border border-slate-200 hover:border-blue-700/60 rounded-2xl p-5 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Dept & Match Pill */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate max-w-[240px]">
                    {scheme.department}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Match Score Badge */}
                    <span 
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md border flex items-center gap-1 ${
                        matchScore >= 90 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : matchScore >= 75 
                          ? 'bg-blue-50 text-blue-800 border-blue-300' 
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                      title={`${matchScore}% algorithmic readiness score`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {matchScore}% match
                    </span>

                    {/* Bookmark Save Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleSaveScheme(scheme.id, e)}
                      className="p-1 text-slate-400 hover:text-blue-900 rounded-md transition-colors"
                      title={isSaved ? 'Saved Scheme' : 'Save Scheme'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-900 text-blue-900' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Scheme Title */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                  {getLocalizedTitle(scheme)}
                </h3>

                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {scheme.shortDescription}
                </p>

                {/* Quick Benefit & Criteria Strip */}
                <div className="mt-3.5 space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide shrink-0">Benefit:</span>
                    <span className="text-slate-800 font-medium truncate">{scheme.financialAssistance}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide shrink-0">Target:</span>
                    <span className="text-slate-600 truncate">{scheme.eligibilitySummary}</span>
                  </div>
                </div>

                {/* AI Explanation Snippet */}
                {matchData && matchData.whyRelevant.length > 0 && (
                  <div className="mt-2 text-[11px] text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{matchData.whyRelevant[0]}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {scheme.deadline ? `Deadline: ${scheme.deadline}` : 'Always Open'}
                </span>
                <span className="text-blue-900 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{t.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 17: SCHEME DETAILS MODAL */}
      {activeSchemeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="max-w-xl">
                <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                  {activeSchemeModal.ministry} • {activeSchemeModal.department}
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                  {getLocalizedTitle(activeSchemeModal)}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveSchemeModal(null);
                  if (onClearSelectedScheme) onClearSelectedScheme();
                }}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* AI Scheme Matching Assessment Box (Section 16) */}
              {(() => {
                const match = schemeMatches.get(activeSchemeModal.id);
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-900" />
                        <span className="font-bold text-sm text-blue-900">
                          AI Eligibility Readiness Assessment
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-900 text-white font-bold text-xs">
                        {match?.score || 85}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-emerald-900 block mb-1">
                          ✓ {t.whyRelevant}:
                        </span>
                        <ul className="space-y-1 text-slate-700">
                          {match?.whyRelevant.map((r, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-amber-900 block mb-1">
                          ⚠️ {t.missingInfo}:
                        </span>
                        <ul className="space-y-1 text-slate-700">
                          {match && match.missingInfo.length > 0 ? (
                            match.missingInfo.map((m, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>{m}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-500 italic">No missing baseline documents.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Overview & Assistance */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Scheme Overview</h4>
                <p className="leading-relaxed text-slate-600">
                  {activeSchemeModal.shortDescription}
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  <span className="font-bold text-slate-900 block mb-0.5">Benefits & Financial Assistance:</span>
                  <p>{activeSchemeModal.benefits}</p>
                </div>
              </div>

              {/* Who can apply */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{t.whoCanApply}</h4>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                  {activeSchemeModal.whoCanApply.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{t.requiredDocs}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeSchemeModal.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-800">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{t.applicationProcess}</h4>
                <ol className="space-y-1.5 pl-4 list-decimal text-slate-600">
                  {activeSchemeModal.applicationProcess.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              {/* Official Source Link */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.officialSource}</span>
                  <span className="font-bold text-slate-800 text-xs">{activeSchemeModal.officialSourceLabel}</span>
                </div>
                <a
                  href={activeSchemeModal.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 hover:text-blue-900 flex items-center gap-1 shadow-2xs"
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={(e) => toggleSaveScheme(activeSchemeModal.id, e)}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedSchemes.includes(activeSchemeModal.id) ? 'fill-blue-900 text-blue-900' : ''}`} />
                <span>{savedSchemes.includes(activeSchemeModal.id) ? 'Saved' : t.saveScheme}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSchemeModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  {t.close}
                </button>
                <button
                  type="button"
                  onClick={() => handleApply(activeSchemeModal)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <span>Apply / Track Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
