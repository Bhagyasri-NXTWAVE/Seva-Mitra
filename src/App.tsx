import React, { useState } from 'react';
import { 
  Language, 
  CitizenProfile, 
  Scheme, 
  SchemeApplication, 
  Complaint, 
  ComplaintStatus, 
  NotificationItem 
} from './types';
import { 
  initialCitizenProfile, 
  mockSchemes, 
  initialSchemeApplications, 
  initialComplaints, 
  initialNotifications 
} from './data/mockData';
import { translations } from './translations';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SchemesView } from './components/SchemesView';
import { RaiseComplaintView } from './components/RaiseComplaintView';
import { MyComplaintsView } from './components/MyComplaintsView';
import { AIChatDesk } from './components/AIChatDesk';
import { CitizenProfileView } from './components/CitizenProfileView';
import { AdminPortalView } from './components/AdminPortalView';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [profile, setProfile] = useState<CitizenProfile>(initialCitizenProfile);
  const [schemes, setSchemes] = useState<Scheme[]>(mockSchemes);
  const [applications, setApplications] = useState<SchemeApplication[]>(initialSchemeApplications);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  
  // Navigation contextual parameters
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | undefined>();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | undefined>();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Active grievances count for badges
  const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  const handleNavigate = (tab: string, param?: any) => {
    setCurrentTab(tab);
    if (tab === 'schemes' && typeof param === 'string') {
      setSelectedSchemeId(param);
    } else if (tab === 'my-complaints' && typeof param === 'string') {
      setSelectedComplaintId(param);
    } else {
      setSelectedSchemeId(undefined);
      setSelectedComplaintId(undefined);
    }

    if (tab === 'admin-desk') {
      setIsAdminMode(true);
    } else if (isAdminMode && tab !== 'admin-desk') {
      // stay in chosen tab
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAdminMode = () => {
    if (!isAdminMode) {
      setIsAdminMode(true);
      setCurrentTab('admin-desk');
    } else {
      setIsAdminMode(false);
      setCurrentTab('dashboard');
    }
  };

  const handleApplyScheme = (scheme: Scheme) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newAppNo = `SCH-2026-${randomSuffix}`;
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newApp: SchemeApplication = {
      id: `APP-2026-${randomSuffix}`,
      applicationNo: newAppNo,
      schemeId: scheme.id,
      schemeName: scheme.title,
      department: scheme.department,
      appliedDate: today,
      status: 'Under Review',
      lastUpdated: today,
      benefitSanctioned: scheme.financialAssistance,
    };

    setApplications(prev => [newApp, ...prev]);

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Application Initiated',
      message: `Your application for ${scheme.title} has been recorded under Application ID ${newAppNo}.`,
      time: 'Just now',
      type: 'scheme',
      read: false,
      relatedId: newApp.id,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSubmitComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Grievance Registered',
      message: `Complaint ${newComplaint.complaintId} has been forwarded to ${newComplaint.assignedDepartment}.`,
      time: 'Just now',
      type: 'complaint',
      read: false,
      relatedId: newComplaint.id,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateComplaintStatus = (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    officerRemarks?: string,
    reassignedDept?: string
  ) => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const updatedTimeline = [...c.timeline];
        updatedTimeline.push({
          stage: newStatus === 'In Progress' ? 'Work Squad Deployed' :
                 newStatus === 'Resolved' ? 'Grievance Resolved & Verified' :
                 newStatus === 'Under Review' ? 'Technical Inspection Underway' : 'Status Updated by Authority',
          timestamp: `${today}, ${nowTime}`,
          statusKey: newStatus,
          note: officerRemarks || `Status changed to ${newStatus} by Zonal Executive Officer.`,
          officerName: 'Sri K. Venkatesh, SE',
        });

        return {
          ...c,
          status: newStatus,
          lastUpdated: today,
          officerRemarks: officerRemarks || c.officerRemarks,
          assignedDepartment: reassignedDept || c.assignedDepartment,
          timeline: updatedTimeline,
        };
      }
      return c;
    }));

    // Notification for citizen
    const targetComp = complaints.find(c => c.id === complaintId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Grievance Status: ${newStatus}`,
      message: `Complaint ${targetComp?.complaintId || complaintId} status has changed to "${newStatus}". Officer remarks updated.`,
      time: 'Just now',
      type: 'complaint',
      read: false,
      relatedId: complaintId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        profile={profile}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onNavigate={handleNavigate}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
        onOpenDigiLockerOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          currentLang={currentLang}
          profile={profile}
          activeComplaintsCount={activeComplaintsCount}
          isAdminMode={isAdminMode}
        />

        {/* Dynamic Content Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto">
          {/* Active View Switching */}
          {currentTab === 'dashboard' && (
            <DashboardView
              currentLang={currentLang}
              profile={profile}
              applications={applications}
              complaints={complaints}
              onNavigate={handleNavigate}
              onOpenSchemeDetails={(schemeId) => handleNavigate('schemes', schemeId)}
            />
          )}

          {(currentTab === 'schemes' || currentTab === 'search-schemes') && (
            <SchemesView
              schemes={schemes}
              profile={profile}
              currentLang={currentLang}
              onApplyScheme={handleApplyScheme}
              selectedSchemeId={selectedSchemeId}
              onClearSelectedScheme={() => setSelectedSchemeId(undefined)}
            />
          )}

          {currentTab === 'raise-complaint' && (
            <RaiseComplaintView
              profile={profile}
              currentLang={currentLang}
              onSubmitComplaint={handleSubmitComplaint}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'my-complaints' && (
            <MyComplaintsView
              complaints={complaints}
              currentLang={currentLang}
              onNavigateToRaise={() => handleNavigate('raise-complaint')}
              selectedComplaintId={selectedComplaintId}
              onClearSelectedComplaint={() => setSelectedComplaintId(undefined)}
            />
          )}

          {(currentTab === 'talk-ai' || currentTab === 'chat-ai') && (
            <AIChatDesk
              isTalkMode={currentTab === 'talk-ai'}
              currentLang={currentLang}
              profile={profile}
              onOpenSchemeDetails={(schemeId) => handleNavigate('schemes', schemeId)}
              onNavigateToComplaint={() => handleNavigate('raise-complaint')}
            />
          )}

          {currentTab === 'profile' && (
            <CitizenProfileView
              profile={profile}
              onUpdateProfile={setProfile}
              currentLang={currentLang}
              onOpenReverification={() => setIsOnboardingOpen(true)}
            />
          )}

          {currentTab === 'admin-desk' && (
            <AdminPortalView
              complaints={complaints}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              currentLang={currentLang}
            />
          )}
        </main>
      </div>

      {/* 7-Step Onboarding & DigiLocker Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
        onSaveProfile={setProfile}
        currentLang={currentLang}
      />
    </div>
  );
}
