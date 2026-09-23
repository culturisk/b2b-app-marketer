export type ViewType =
  | 'home'
  | 'landing'
  | 'ecosystems'
  | 'ecosystem-detail'
  | 'platform-aso'
  | 'platform-co-marketing'
  | 'platform-performance'
  | 'platform-plg-reviews'
  | 'services'
  | 'tools'
  | 'audit'
  | 'roi-calculator'
  | 'preview-studio'
  | 'sequence-generator'
  | 'pricing'
  | 'dashboard'
  | 'app-dashboard';

export type EcosystemCategorySlug =
  | 'e-commerce'
  | 'crm-enterprise'
  | 'cloud-hyperscalers'
  | 'dev-work-os'
  | 'collaboration'
  | 'data-ai'
  | 'creative-cms'
  | 'fintech-hr';

export interface EcosystemCluster {
  id: string;
  name: string;
  slug: EcosystemCategorySlug;
  description: string;
  iconName: string;
  ecosystemCount: number;
}

export interface EcosystemCapabilityModule {
  title: string;
  subtitle: string;
  bullets: string[];
  tactics: string[];
}

export interface EcosystemMarketStats {
  avgInstallGrowth: string;
  top3Cvr: string;
  avgOrganicArrMultiple: string;
  reviewThreshold: string;
  totalActiveApps: string;
  merchantBuyerPool: string;
}

export interface EcosystemAlgorithmTelemetry {
  keywordWeight: number; // e.g. 35%
  reviewVelocityWeight: number; // e.g. 25%
  installVelocityWeight: number; // e.g. 20%
  churnSignalWeight: number; // e.g. 10%
  apiHealthWeight: number; // e.g. 10%
  primaryRankingFactors: string[];
  nativeListingUrlSample: string;
}

export interface EcosystemCaseStudy {
  clientName: string;
  category: string;
  resultArr: string;
  installGrowth: string;
  rankingPosition: string;
  quote: string;
  author: string;
  authorRole: string;
  companyGmv: string;
}

export interface EcosystemComplianceBadge {
  name: string;
  requirements: string[];
  badgeBenefit: string;
}

export interface EcosystemRoiModel {
  defaultMonthlyTraffic: number;
  defaultConversionRate: number;
  defaultArpu: number;
  projectedAnnualArr: number;
}

export interface EcosystemItem {
  id: string;
  slug: string;
  name: string;
  marketplaceName: string;
  categorySlug: EcosystemCategorySlug;
  categoryName: string;
  badge: string;
  accentColor: string; // e.g. '#008060' or '#00A1E0'
  accentGlow: string;
  iconName: string;
  logoText: string;
  tagline: string;
  description: string;
  marketStats: EcosystemMarketStats;
  algorithmTelemetry: EcosystemAlgorithmTelemetry;
  capabilityModules: {
    aso: EcosystemCapabilityModule;
    coMarketing: EcosystemCapabilityModule;
    performanceAds: EcosystemCapabilityModule;
    plgReviews: EcosystemCapabilityModule;
  };
  caseStudy: EcosystemCaseStudy;
  complianceBadge: EcosystemComplianceBadge;
  roiModel: EcosystemRoiModel;
  supportedUrlExamples: string[];
}

export interface MarketplaceAuditRequest {
  marketplaceUrl: string;
  appName?: string;
  ecosystemSlug?: string;
  email?: string;
  companyDomain?: string;
}

export interface MarketplaceAuditFinding {
  title: string;
  status: 'Critical Gap' | 'Needs Optimization' | 'Strong' | 'Optimal';
  impact: string;
  score: number;
  description: string;
  action: string;
}

export interface AuditRuleEvaluation {
  id: string;
  category: 'Shopify Metadata & ASO' | 'Visual CRO & Media' | 'Built for Shopify & Polaris' | 'Review Flywheel & Trust' | 'Pricing & Merchant Friction' | 'Internationalization';
  ruleName: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  observed: string;
  benchmark: string;
  impact: string;
  recommendation: string;
}

export interface ScannedListingMetadata {
  rawUrl: string;
  title: string;
  titleLength: number;
  subtitle: string;
  subtitleLength: number;
  rating: number;
  reviewsCount: number;
  hasBuiltForShopifyBadge: boolean;
  hasDemoVideo: boolean;
  screenshotCount: number;
  pricingModel: string;
  pricingPrice: string;
  primaryKeywordsDetected: string[];
  themeAppExtension: boolean;
  polarisVersion: string;
}

export interface AuditPaymentReceipt {
  orderId: string;
  transactionRef: string;
  amount: number;
  currency: string;
  status: 'captured' | 'failed' | 'pending';
  paidAt: string;
  paymentMethod: string;
  customerEmail?: string;
  taxInvoiceNumber: string;
}

export interface MarketplaceAuditResponse {
  appName: string;
  marketplaceName: string;
  ecosystemSlug: string;
  overallScore: number;
  keywordSaturationScore: number;
  visualMediaScore: number;
  reviewHealthScore: number;
  complianceScore: number;
  pricingFrictionScore?: number;
  executiveSummary: string;
  telemetryHighlights: {
    label: string;
    value: string;
    benchmark: string;
    status: 'good' | 'warning' | 'critical';
  }[];
  findings: MarketplaceAuditFinding[];
  actionRoadmap: {
    step: number;
    pillar: 'Marketplace ASO' | 'Co-Marketing' | 'Performance Ads' | 'PLG & Reviews';
    recommendation: string;
    expectedLift: string;
    timeframe: string;
  }[];
  ruleEvaluations?: AuditRuleEvaluation[];
  scannedMetadata?: ScannedListingMetadata;
  isUnlocked?: boolean;
  paymentReceipt?: AuditPaymentReceipt;
}

export type DashboardRole = 'marketing' | 'sales' | 'support';

// Marketing View Types
export interface FunnelStage {
  id: string;
  name: string;
  count: number;
  rateFromPrevious: number; // percentage (e.g. 100% -> 4.2% -> 72% -> 22%)
  rateFromTop: number;
  benchmark: number;
  color: string;
  dropOffCount: number;
  dropOffRate: number;
}

export interface KeywordRoasItem {
  id: string;
  keyword: string;
  matchType: 'Broad' | 'Exact' | 'Competitor';
  spend: number;
  impressions: number;
  clicks: number;
  cpc: number;
  installs: number;
  cac: number;
  paidSubscriptions: number;
  revenue: number;
  roas: number;
  status: 'Profitable' | 'Breakeven' | 'Optimize';
}

export interface ChurnHeatmapCell {
  ageGroup: 'Day 1' | 'Day 3' | 'Day 14' | 'Day 30+';
  revenueTier: 'Starter (<$10k)' | 'Growth ($10k-$50k)' | 'Scale ($50k-$250k)' | 'Shopify Plus ($250k+)';
  uninstallRate: number; // percentage
  uninstallsCount: number;
  primaryReason: string;
}

export interface PdpVariation {
  variantId: string;
  strategy: string;
  appTitle: string;
  subtitle: string;
  featureBullets: string[];
  primaryCta: string;
  predictedLift: string;
  rationale: string;
}

export interface PdpDoctorResult {
  appName: string;
  diagnostics: string;
  primaryDropOffReason: string;
  variations: PdpVariation[];
  recommendations: string[];
}

// Sales & BD View Types
export interface HighValueLead {
  id: string;
  shopDomain: string;
  merchantName: string;
  tier: 'Shopify Plus' | 'Enterprise Headless' | 'Advanced' | 'Mid-Market';
  monthlyOrderVolume: number;
  activeTheme: string;
  country: string;
  currentPlan: string;
  installDate: string;
  daysActive: number;
  estimatedAnnualGmv: string;
  contactPerson: string;
  contactRole: string;
  pipelineStatus: 'Identified' | 'Contacted' | 'Demo Scheduled' | 'Upgraded';
}

export interface UpsellRadarAlert {
  id: string;
  shopDomain: string;
  merchantName: string;
  currentPlan: string;
  recommendedPlan: string;
  quotaMetric: string;
  usedAmount: number;
  totalLimit: number;
  usagePercentage: number;
  projectedOverLimitDays: number;
  estimatedGmv: string;
  contactName: string;
  niche: string;
  urgency: 'High' | 'Medium' | 'Critical';
}

export interface AgencyPartner {
  id: string;
  agencyName: string;
  logoInitials: string;
  partnerTier: 'Shopify Premier Partner' | 'Shopify Plus Partner' | 'Certified Agency' | 'Freelance Dev';
  activeClientMerchants: number;
  monthlyReferredMrr: number;
  commissionRate: number; // e.g. 20%
  pendingPayout: number;
  lifetimeRevenue: number;
  leadAccountManager: string;
  status: 'Active' | 'Top Tier' | 'New';
}

export interface OutreachDraftResult {
  merchantShop: string;
  contactName: string;
  channel: string;
  subject: string;
  messageBody: string;
  callToAction: string;
  talkingPoints: string[];
  recommendedPlan: string;
}

// Support & Customer Success View Types
export interface MerchantHealthRecord {
  id: string;
  shopDomain: string;
  merchantName: string;
  healthScore: number; // 0 - 100
  status: 'Green' | 'Yellow' | 'Red';
  setupProgress: number; // 0 - 100%
  themeEmbedActive: boolean;
  activeTheme: string;
  dauMauRatio: number; // e.g. 0.85
  openTickets: number;
  lastActive: string;
  plan: string;
  riskFactors: string[];
}

export interface PolarisStep {
  stepNumber: number;
  action: string;
  navigationPath: string;
  detail: string;
}

export interface SupportAssistantResult {
  ticketId: string;
  merchantShop: string;
  empathyOpening: string;
  polarisSteps: PolarisStep[];
  troubleshootingNotes: string[];
  closingOffer: string;
  fullDraftedReply: string;
  polarisDocReference: string;
}

export interface ReviewOpportunityMerchant {
  id: string;
  shopDomain: string;
  merchantName: string;
  ownerName: string;
  daysActive: number;
  setupProgress: number;
  milestoneAchieved: string;
  valueGenerated: string;
  ticketsLogged: number;
  ratingPotential: number; // e.g. 5.0
  reviewTriggerStatus: 'Ready to Trigger' | 'Trigger Sent' | 'Review Completed';
  lastTriggerDate?: string;
}

export interface AuditRequest {
  appName: string;
  category: string;
  appUrl: string;
  monthlyInstalls: string;
  priceModel: string;
  checklistState: Record<string, boolean>;
  notes: string;
}

export interface KeyFinding {
  title: string;
  status: string;
  impact: string;
  description: string;
}

export interface ActionItem {
  step: number;
  pillar: string;
  recommendation: string;
  expectedLift: string;
}

export interface AuditResult {
  appName: string;
  overallScore: number;
  listingHealthScore: number;
  polarisUxScore: number;
  retentionHealthScore: number;
  executiveSummary: string;
  keyFindings: KeyFinding[];
  actionItems: ActionItem[];
  polarisFlaws: string[];
  asoKeywords: string[];
}

export interface SequenceSection {
  label: string;
  subject?: string;
  body: string;
  notes?: string;
}

export interface SequenceResult {
  outputType: string;
  title: string;
  sections: SequenceSection[];
}

export interface PillarItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  iconName: string;
  deliverables: string[];
  impactMetric: string;
  polarisFocus: string;
  badgeText: string;
}

export interface PricingServiceItem {
  id: string;
  pillarId: number;
  name: string;
  description: string;
  type: 'one_time' | 'monthly';
  price: number;
  turnaround: string;
  recommended: boolean;
  features: string[];
}

export interface ProjectMilestone {
  id: number;
  pillarId: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  date: string;
  link?: string;
  linkText?: string;
}

export interface ClientProjectData {
  appName: string;
  leadStrategist: string;
  targetCompletion: string;
  metrics: {
    activationRate: string;
    searchAdsRoas: string;
    fiveStarReviewsGained: string;
    uninstallsPrevented: string;
  };
  milestones: ProjectMilestone[];
}

export interface ClientMilestone {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  dueDate: string;
  assignedLead: string;
  deliverableFile?: string;
  description: string;
}
