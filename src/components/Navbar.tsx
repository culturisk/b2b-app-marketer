import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import {
  Sparkles,
  ChevronDown,
  Calculator,
  Layers,
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  Users,
  Target,
  Zap,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { initAuth, googleSignIn } from '../services/googleAuth';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (initialService?: string) => void;
  onOpenAuditModal?: () => void;
  onSelectEcosystem?: (slug: string) => void;
  onOpenSubmissions?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  onOpenSubmissions,
}) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = initAuth((user) => {
      setCurrentUser(user);
    }, () => {
      setCurrentUser(null);
    });
    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Identity - Shopify Native Black, White & Emerald */}
        <div
          id="nav-brand-logo"
          onClick={() => {
            onNavigate('landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#008060] flex items-center justify-center shadow-lg shadow-[#008060]/30 group-hover:scale-105 transition-transform duration-200">
            <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45 bg-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1.5">
              B2B App Marketer
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#008060]/25 text-[#00a877] border border-[#008060]/40 font-bold">
                B2B & MULTI-ECOSYSTEM
              </span>
            </span>
            <span className="text-[10px] text-slate-300 font-mono tracking-wide hidden lg:inline">
              B2B App ASO & Multi-Marketplace Growth
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Menu - Strictly Shopify Focused */}
        <nav className="hidden md:flex items-center justify-center gap-1.5 flex-1 max-w-2xl">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              id="nav-dropdown-services"
              onClick={() => onNavigate('platform-aso')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'platform-aso' ||
                currentView === 'platform-co-marketing' ||
                currentView === 'platform-performance' ||
                currentView === 'platform-plg-reviews' ||
                currentView === 'services'
                  ? 'text-white bg-white/15 border border-white/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#00a877]" />
              <span>Shopify Growth Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180 text-[#00a877]' : ''
                }`}
              />
            </button>

            {servicesOpen && (
              <div
                id="nav-services-panel"
                className="absolute top-full left-0 mt-1 w-[400px] bg-[#0C101A] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl space-y-1"
              >
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold border-b border-white/10 mb-1">
                  Shopify App Growth Engines
                </div>

                <button
                  onClick={() => {
                    onNavigate('platform-aso');
                    setServicesOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 flex items-start gap-3 group transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-[#008060]/20 text-[#00a877] mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#00a877]">
                      1. Shopify App ASO & Listing CRO
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Search keyword saturation, title hooks & high-converting screenshot carousels.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('platform-co-marketing');
                    setServicesOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 flex items-start gap-3 group transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-[#008060]/20 text-[#00a877] mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#00a877]">
                      2. Built for Shopify & Polaris 12+ UX
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Benchmark compliance, native admin UX, and official Built for Shopify badge qualification.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('platform-performance');
                    setServicesOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 flex items-start gap-3 group transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-white/10 text-white mt-0.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-white">
                      3. Shopify App Search Ads
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Sponsored search keyword bidding & high-intent merchant acquisition campaigns.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('platform-plg-reviews');
                    setServicesOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 flex items-start gap-3 group transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-[#008060]/20 text-[#00a877] mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#00a877]">
                      4. Merchant Review Velocity & PLG Loops
                    </div>
                    <div className="text-[11px] text-slate-300">
                      First-milestone review prompts & day-1 theme extension setup friction elimination.
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Free Listing Audit */}
          <button
            id="nav-link-audit"
            onClick={() => onNavigate('audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'audit'
                ? 'text-white bg-[#008060] border border-[#008060] shadow-md shadow-[#008060]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00a877]" />
            <span>Free Shopify ASO Audit</span>
          </button>

          {/* ROI Calculator */}
          <button
            id="nav-link-roi"
            onClick={() => onNavigate('roi-calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'roi-calculator'
                ? 'text-white bg-[#008060] border border-[#008060]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>ROI Calculator</span>
          </button>

          {/* Pricing */}
          <button
            id="nav-link-pricing"
            onClick={() => onNavigate('pricing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'pricing'
                ? 'text-white bg-white/20 border border-white/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Pricing & Sprints
          </button>
        </nav>

        {/* Right Side Action Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* View Organized Submissions & IDs */}
          <button
            id="nav-btn-submissions"
            onClick={() => onOpenSubmissions && onOpenSubmissions()}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            title="View submitted forms & unique IDs"
          >
            <Database className="w-3.5 h-3.5 text-[#00a877]" />
            <span className="hidden xl:inline">Submissions</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#008060] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <span className="font-medium text-xs truncate max-w-[110px]">
                {currentUser.displayName || 'Connected'}
              </span>
            </div>
          ) : (
            <button
              onClick={() => googleSignIn()}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            id="nav-cta-booking"
            onClick={() => onOpenBooking('Shopify App Growth Strategy Session')}
            className="px-5 py-2.5 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#008060]/30 cursor-pointer"
          >
            <span>Book 30-Min Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-white hover:bg-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D15] border-b border-white/10 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('platform-aso');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
            >
              Shopify ASO & Listing CRO
            </button>
            <button
              onClick={() => {
                onNavigate('platform-co-marketing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
            >
              Built for Shopify & Polaris
            </button>
            <button
              onClick={() => {
                onNavigate('audit');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-[#00a877] hover:bg-white/10 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Free Shopify ASO Audit</span>
            </button>
            <button
              onClick={() => {
                onNavigate('roi-calculator');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
            >
              Shopify App ROI Calculator
            </button>
            <button
              onClick={() => {
                onNavigate('pricing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
            >
              Pricing & Sprints
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                if (onOpenSubmissions) onOpenSubmissions();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10"
            >
              <Database className="w-3.5 h-3.5 text-[#00a877]" />
              <span>My Submissions & Form History</span>
            </button>
            <button
              onClick={() => {
                onOpenBooking('Shopify App Growth Strategy Session');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#008060] hover:bg-[#009973] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Book Strategy Teardown Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
