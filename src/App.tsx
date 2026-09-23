/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MultiEcosystemWaitlistModal } from './components/MultiEcosystemWaitlistModal';
import { SubmissionsHistoryModal } from './components/SubmissionsHistoryModal';
import { testFirestoreConnection } from './services/firebaseService';
import { LandingView } from './views/LandingView';
import { ServicesView } from './views/ServicesView';
import { AuditScorecardView } from './views/AuditScorecardView';
import { PricingView } from './views/PricingView';
import { RoiCalculatorView } from './views/RoiCalculatorView';
import { PreviewStudioView } from './views/PreviewStudioView';
import { SequenceGeneratorView } from './views/SequenceGeneratorView';
import { ToolsHubView } from './views/ToolsHubView';
import { DashboardView } from './views/DashboardView';
import { AppDashboardView } from './views/AppDashboardView';
import { EcosystemDirectoryView } from './views/EcosystemDirectoryView';
import { EcosystemDetailView } from './views/EcosystemDetailView';
import { PlatformCapabilityView } from './views/PlatformCapabilityView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (path === '/app-dashboard' || hash === 'app-dashboard') {
        return 'app-dashboard';
      }
      if (path === '/audit' || hash === 'audit') {
        return 'audit';
      }
      if (path === '/ecosystems' || hash === 'ecosystems') {
        return 'ecosystems';
      }
    }
    return 'landing';
  });

  const [selectedEcosystemSlug, setSelectedEcosystemSlug] = useState<string>('shopify');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingService, setBookingService] = useState<string | undefined>();
  const [configuredServices, setConfiguredServices] = useState<string[] | undefined>();
  const [bookingOneTime, setBookingOneTime] = useState<number | undefined>();
  const [bookingMonthly, setBookingMonthly] = useState<number | undefined>();

  const [isWaitlistOpen, setIsWaitlistOpen] = useState<boolean>(false);
  const [waitlistEcosystem, setWaitlistEcosystem] = useState<string | undefined>();
  const [waitlistEmail, setWaitlistEmail] = useState<string | undefined>();

  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState<boolean>(false);

  // Initialize Firestore connection test on mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedEcosystemSlug]);

  const handleOpenBooking = (
    service?: string,
    servicesList?: string[],
    oneTime?: number,
    monthly?: number
  ) => {
    setBookingService(service);
    setConfiguredServices(servicesList);
    setBookingOneTime(oneTime);
    setBookingMonthly(monthly);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleOpenWaitlist = (ecosystem?: string, email?: string) => {
    setWaitlistEcosystem(ecosystem);
    setWaitlistEmail(email);
    setIsWaitlistOpen(true);
  };

  const handleCloseWaitlist = () => {
    setIsWaitlistOpen(false);
  };

  const handleSelectEcosystem = (slug: string) => {
    setSelectedEcosystemSlug(slug);
    setCurrentView('ecosystem-detail');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-white flex flex-col selection:bg-[#008060] selection:text-white font-sans antialiased relative">
      {/* Subtle ambient Shopify green accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#008060]/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[180px]" />
      </div>

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenBooking={handleOpenBooking}
        onSelectEcosystem={handleSelectEcosystem}
        onOpenSubmissions={() => setIsSubmissionsOpen(true)}
      />

      {/* Main View Router Container */}
      <main className="flex-1 relative z-10">
        {(currentView === 'landing' ||
          currentView === 'home' ||
          currentView === 'ecosystems' ||
          currentView === 'ecosystem-detail' ||
          currentView === 'audit') && (
          <LandingView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
            onSelectEcosystem={handleSelectEcosystem}
          />
        )}

        {currentView === 'platform-aso' && (
          <PlatformCapabilityView
            initialPillar="aso"
            onOpenAudit={() => setCurrentView('audit')}
            onOpenBooking={handleOpenBooking}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'platform-co-marketing' && (
          <PlatformCapabilityView
            initialPillar="co-marketing"
            onOpenAudit={() => setCurrentView('audit')}
            onOpenBooking={handleOpenBooking}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'platform-performance' && (
          <PlatformCapabilityView
            initialPillar="performance"
            onOpenAudit={() => setCurrentView('audit')}
            onOpenBooking={handleOpenBooking}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'platform-plg-reviews' && (
          <PlatformCapabilityView
            initialPillar="plg-reviews"
            onOpenAudit={() => setCurrentView('audit')}
            onOpenBooking={handleOpenBooking}
            onNavigate={setCurrentView}
          />
        )}


        {currentView === 'services' && (
          <ServicesView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'pricing' && (
          <PricingView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'roi-calculator' && (
          <RoiCalculatorView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'preview-studio' && (
          <PreviewStudioView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'sequence-generator' && (
          <SequenceGeneratorView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'tools' && (
          <ToolsHubView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'app-dashboard' && (
          <AppDashboardView
            onNavigate={setCurrentView}
            onOpenBooking={handleOpenBooking}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenBooking={() => handleOpenBooking()}
        onOpenWaitlist={handleOpenWaitlist}
        onOpenSubmissions={() => setIsSubmissionsOpen(true)}
      />

      {/* Strategy Call Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialService={bookingService}
        configuredServices={configuredServices}
        totalOneTime={bookingOneTime}
        totalMonthly={bookingMonthly}
      />

      {/* Multi-Ecosystem Expansion Waitlist Modal */}
      <MultiEcosystemWaitlistModal
        isOpen={isWaitlistOpen}
        onClose={handleCloseWaitlist}
        initialEcosystem={waitlistEcosystem}
        initialEmail={waitlistEmail}
      />

      {/* Form Submissions & Unique IDs Systematic Records Modal */}
      <SubmissionsHistoryModal
        isOpen={isSubmissionsOpen}
        onClose={() => setIsSubmissionsOpen(false)}
        onOpenWaitlist={() => handleOpenWaitlist()}
        onOpenBooking={() => handleOpenBooking()}
      />
    </div>
  );
}
