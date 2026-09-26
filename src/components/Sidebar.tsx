import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  AlertCircle, 
  Clock, 
  Bot, 
  Sparkles, 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { Language, CitizenProfile } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentLang: Language;
  profile: CitizenProfile;
  activeComplaintsCount: number;
  isAdminMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  currentLang,
  profile,
  activeComplaintsCount,
  isAdminMode,
}) => {
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'schemes', label: t.navSchemes, icon: FileText },
    { id: 'search-schemes', label: t.navSearchSchemes, icon: Search },
    { id: 'raise-complaint', label: t.navRaiseComplaint, icon: AlertCircle, highlight: true },
    { id: 'my-complaints', label: t.navMyComplaints, icon: Clock, badge: activeComplaintsCount > 0 ? activeComplaintsCount : undefined },
    { id: 'talk-ai', label: t.navTalkAI, icon: Bot },
    { id: 'chat-ai', label: t.navChatAI, icon: Sparkles },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 min-h-[calc(100vh-85px)] shrink-0 select-none">
        {/* DigiLocker Status Card in Sidebar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">DigiLocker</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {profile.aadhaarMasked}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-800 text-white shadow-xs'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-slate-800 hover:text-white border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Switcher in Nav */}
          <div className="pt-3 mt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('admin-desk')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                currentTab === 'admin-desk'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>{t.navAdminPortal}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Demo
              </span>
            </button>
          </div>
        </nav>

        {/* Civic Helpline Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
          <div className="flex items-center justify-between font-medium text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-blue-400" />
              Emergency Citizen Helpline
            </span>
            <span className="font-mono text-white font-bold">112 / 1912</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            24x7 Centralized Grievance Redressal Monitoring Desk
          </p>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-400 shadow-xl">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentTab === 'dashboard' ? 'text-white font-bold' : 'hover:text-slate-200'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onNavigate('schemes')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentTab === 'schemes' ? 'text-white font-bold' : 'hover:text-slate-200'}`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Schemes</span>
        </button>

        <button
          onClick={() => onNavigate('raise-complaint')}
          className="flex flex-col items-center -mt-4 py-1.5 px-3 rounded-full bg-amber-600 text-white font-bold shadow-lg border-2 border-slate-900"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Report</span>
        </button>

        <button
          onClick={() => onNavigate('chat-ai')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentTab === 'chat-ai' || currentTab === 'talk-ai' ? 'text-white font-bold' : 'hover:text-slate-200'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">AI Mitra</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentTab === 'profile' ? 'text-white font-bold' : 'hover:text-slate-200'}`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  );
};
