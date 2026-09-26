import React, { useState } from 'react';
import { 
  Building2, 
  Globe2, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  Bot, 
  ExternalLink,
  ChevronDown,
  Volume2,
  FileText
} from 'lucide-react';
import { Language, NotificationItem, CitizenProfile } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  profile: CitizenProfile;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onNavigate: (tab: string, param?: any) => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenDigiLockerOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  profile,
  notifications,
  onMarkNotificationsRead,
  onNavigate,
  isAdminMode,
  onToggleAdminMode,
  onOpenDigiLockerOnboarding,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const t = translations[currentLang] || translations.en;
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTextSize = () => {
    if (textSize === 'normal') {
      setTextSize('large');
      document.documentElement.style.fontSize = '17px';
    } else if (textSize === 'large') {
      setTextSize('larger');
      document.documentElement.style.fontSize = '18px';
    } else {
      setTextSize('normal');
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top National Government Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <span className="text-base" role="img" aria-label="India Flag">🇮🇳</span> 
            <span className="hidden sm:inline">{t.govOfIndia}</span>
            <span className="sm:hidden">Govt of India</span>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t.officialPortalNotice}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <button 
            onClick={toggleTextSize}
            className="hover:text-white px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 font-mono transition-colors"
            title="Adjust Font Size"
          >
            A{textSize === 'large' ? '+' : textSize === 'larger' ? '++' : ''}
          </button>

          <span className="text-slate-600">|</span>

          {/* Admin Switcher for Hackathon Demo */}
          <button
            onClick={onToggleAdminMode}
            className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
              isAdminMode 
                ? 'bg-amber-600 text-white font-bold animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
            title="Switch between Citizen and Municipal Officer View"
          >
            <Building2 className="w-3 h-3" />
            <span>{isAdminMode ? 'Admin Desk Active' : 'Switch to Govt Officer View'}</span>
          </button>
        </div>
      </div>

      {/* Tricolor Subtle Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-amber-500" />
        <div className="h-full w-1/3 bg-white border-y border-slate-100" />
        <div className="h-full w-1/3 bg-emerald-600" />
      </div>

      {/* Main Brand & Controls Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          {/* Subtle Ashoka Chakra Logo Symbol */}
          <div className="relative w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xs overflow-hidden group-hover:border-blue-600 transition-colors">
            <svg className="w-8 h-8 text-blue-300 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="42" strokeWidth="3" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x2 = 50 + 42 * Math.cos(rad);
                const y2 = 50 + 42 * Math.sin(rad);
                return <line key={i} x1="50" y1="50" x2={x2} y2={y2} strokeWidth="2" />;
              })}
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center">
                Seva<span className="text-blue-900">Mitra</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded border border-blue-200">
                Official
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Navigation & Utility Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Fast AI Shortlinks */}
          <button
            onClick={() => onNavigate('talk-ai')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Bot className="w-4 h-4 text-blue-700" />
            <span>{t.navTalkAI}</span>
          </button>

          <button
            onClick={() => onNavigate('chat-ai')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t.navChatAI}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              aria-label="Select Language"
            >
              <Globe2 className="w-4 h-4 text-blue-800" />
              <span className="font-medium">
                {currentLang === 'en' ? 'English' : currentLang === 'te' ? 'తెలుగు' : currentLang === 'tenglish' ? 'Tenglish' : 'हिंदी'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setShowLangMenu(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Language
                </div>
                <button
                  onClick={() => { onSelectLang('en'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentLang === 'en' ? 'font-bold text-blue-800 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span>English</span>
                  {currentLang === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>
                <button
                  onClick={() => { onSelectLang('te'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentLang === 'te' ? 'font-bold text-blue-800 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span>తెలుగు (Telugu)</span>
                  {currentLang === 'te' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>
                <button
                  onClick={() => { onSelectLang('tenglish'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentLang === 'tenglish' ? 'font-bold text-blue-800 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <div>
                    <span>Tenglish</span>
                    <span className="block text-[10px] text-slate-400 font-normal">Telugu in English letters</span>
                  </div>
                  {currentLang === 'tenglish' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>
                <button
                  onClick={() => { onSelectLang('hi'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentLang === 'hi' ? 'font-bold text-blue-800 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span>हिंदी (Hindi)</span>
                  {currentLang === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (unreadCount > 0) onMarkNotificationsRead();
              }}
              className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifMenu && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setShowNotifMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{t.notifications}</span>
                  <button 
                    onClick={onMarkNotificationsRead}
                    className="text-[11px] text-blue-700 hover:underline"
                  >
                    {t.markAllRead}
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => {
                          if (n.type === 'complaint') onNavigate('my-complaints', n.relatedId);
                          else onNavigate('dashboard');
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-slate-800">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Citizen Profile Pill */}
          <div 
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-2.5 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
            title="View Citizen Profile"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {profile.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {profile.fullName.split(' ')[0]}
                </span>
                {profile.digiLockerVerified && (
                  <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200" title="DigiLocker Verified Citizen">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block">
                {profile.profession} • {profile.district}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
