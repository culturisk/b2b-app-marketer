import { jsPDF } from 'jspdf';
import {
  MarketplaceAuditResponse,
  AuditResult,
  AuditRuleEvaluation,
  ScannedListingMetadata,
  AuditPaymentReceipt,
} from '../types';

/**
 * Clean filename helper
 */
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 40);
}

/**
 * Formats current date for audit reports
 */
function getReportDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export interface UniversalAuditData {
  appName: string;
  marketplaceName: string;
  overallScore: number;
  keywordScore: number;
  visualCroScore: number;
  reviewScore: number;
  complianceScore: number;
  pricingScore?: number;
  executiveSummary: string;
  findings: Array<{
    title: string;
    status: string;
    impact: string;
    score?: number;
    description: string;
    action?: string;
  }>;
  roadmap: Array<{
    step: number;
    pillar: string;
    recommendation: string;
    expectedLift: string;
    timeframe?: string;
  }>;
  keywords?: string[];
  telemetryHighlights?: Array<{
    label: string;
    value: string;
    benchmark: string;
    status: string;
  }>;
  targetUrl?: string;
  ruleEvaluations?: AuditRuleEvaluation[];
  scannedMetadata?: ScannedListingMetadata;
  paymentReceipt?: AuditPaymentReceipt;
}

/**
 * Normalizes either MarketplaceAuditResponse or AuditResult into a universal structure
 */
export function normalizeAuditData(
  data: MarketplaceAuditResponse | AuditResult,
  extraUrl?: string
): UniversalAuditData {
  if ('marketplaceName' in data) {
    const mpData = data as MarketplaceAuditResponse;
    return {
      appName: mpData.appName || 'Marketplace Application',
      marketplaceName: mpData.marketplaceName || 'Shopify App Directory',
      overallScore: mpData.overallScore || 70,
      keywordScore: mpData.keywordSaturationScore || 65,
      visualCroScore: mpData.visualMediaScore || 70,
      reviewScore: mpData.reviewHealthScore || 65,
      complianceScore: mpData.complianceScore || 75,
      pricingScore: mpData.pricingFrictionScore || 80,
      executiveSummary: mpData.executiveSummary || '',
      findings: (mpData.findings || []).map((f) => ({
        title: f.title,
        status: f.status,
        impact: f.impact,
        score: f.score,
        description: f.description,
        action: f.action,
      })),
      roadmap: (mpData.actionRoadmap || []).map((r) => ({
        step: r.step,
        pillar: r.pillar,
        recommendation: r.recommendation,
        expectedLift: r.expectedLift,
        timeframe: r.timeframe,
      })),
      telemetryHighlights: mpData.telemetryHighlights || [],
      targetUrl: extraUrl,
      ruleEvaluations: mpData.ruleEvaluations,
      scannedMetadata: mpData.scannedMetadata,
      paymentReceipt: mpData.paymentReceipt,
    };
  } else {
    const arData = data as AuditResult;
    return {
      appName: arData.appName || 'Shopify Application',
      marketplaceName: 'Shopify App Directory',
      overallScore: arData.overallScore || 70,
      keywordScore: arData.listingHealthScore || 68,
      visualCroScore: arData.polarisUxScore || 72,
      reviewScore: arData.retentionHealthScore || 66,
      complianceScore: 78,
      executiveSummary: arData.executiveSummary || '',
      findings: (arData.keyFindings || []).map((f) => ({
        title: f.title,
        status: f.status,
        impact: f.impact,
        description: f.description,
      })),
      roadmap: (arData.actionItems || []).map((a) => ({
        step: a.step,
        pillar: a.pillar,
        recommendation: a.recommendation,
        expectedLift: a.expectedLift,
        timeframe: `Day ${a.step * 7 - 6} - ${a.step * 7}`,
      })),
      keywords: arData.asoKeywords || [],
      targetUrl: extraUrl,
    };
  }
}

/**
 * Generates and downloads a real, beautifully formatted, multi-page vector PDF report using jsPDF
 */
export function downloadAsoAuditPdf(
  rawAudit: MarketplaceAuditResponse | AuditResult,
  targetUrl?: string
): boolean {
  try {
    const audit = normalizeAuditData(rawAudit, targetUrl);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (cursorY + neededHeight > pageHeight - 16) {
        doc.addPage();
        cursorY = margin;
        // Subtle top header on subsequent pages
        doc.setFillColor(7, 12, 27);
        doc.rect(margin, cursorY, contentWidth, 8, 'F');
        doc.setTextColor(0, 229, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CULTURISK | APP OPTIMIZATION & GROWTH DIAGNOSTIC', margin + 3, cursorY + 5.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`${audit.appName} • ${audit.marketplaceName}`, pageWidth - margin - 3, cursorY + 5.5, { align: 'right' });
        cursorY += 12;
      }
    };

    // ================= PAGE 1: HEADER & EXECUTIVE SUMMARY =================
    // Hero Dark Header Card
    doc.setFillColor(7, 12, 27); // #070C1B
    doc.roundedRect(margin, cursorY, contentWidth, 34, 3, 3, 'F');

    // Accent line
    doc.setFillColor(0, 229, 255); // #00E5FF
    doc.rect(margin, cursorY, 3, 34, 'F');

    // Culturisk Brand & Label
    doc.setTextColor(0, 229, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CULTURISK PLATFORM INTELLIGENCE', margin + 8, cursorY + 8);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Official ASO Diagnostic Report • Generated: ${getReportDate()}`, margin + 8, cursorY + 13);

    // App Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${audit.appName}`, margin + 8, cursorY + 22);

    doc.setTextColor(16, 185, 129); // #10B981
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Marketplace: ${audit.marketplaceName}`, margin + 8, cursorY + 28);

    // Score Circle Badge on the Right
    const scoreBoxX = pageWidth - margin - 32;
    doc.setFillColor(19, 28, 53);
    doc.roundedRect(scoreBoxX, cursorY + 4, 26, 26, 3, 3, 'F');
    doc.setDrawColor(0, 229, 255);
    doc.setLineWidth(0.5);
    doc.roundedRect(scoreBoxX, cursorY + 4, 26, 26, 3, 3, 'D');

    doc.setTextColor(0, 229, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${audit.overallScore}`, scoreBoxX + 13, cursorY + 18, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('/ 100 OVERALL', scoreBoxX + 13, cursorY + 24, { align: 'center' });

    cursorY += 38;

    // Payment License Strip if paid
    if (audit.paymentReceipt) {
      doc.setFillColor(0, 128, 96);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(
        `OFFICIAL STRATEGIC AUDIT LICENSE • INVOICE NO: ${audit.paymentReceipt.taxInvoiceNumber} • PAID: ₹60,000 INR (CAPTURED VIA ${audit.paymentReceipt.paymentMethod.toUpperCase()})`,
        margin + 4,
        cursorY + 5.2
      );
      cursorY += 11;
    }

    // Listing URL Reference if provided
    if (audit.targetUrl) {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, cursorY, contentWidth, 7, 1.5, 1.5, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Audited Shopify Listing: ${audit.targetUrl.slice(0, 95)}`, margin + 4, cursorY + 4.8);
      cursorY += 10;
    }

    // 4 Pillar Scores Bar
    const cardWidth = (contentWidth - 6) / 4;
    const pillarMetrics = [
      { label: 'Keyword Indexation', score: audit.keywordScore, color: [0, 229, 255] },
      { label: 'Visual Media CRO', score: audit.visualCroScore, color: [16, 185, 129] },
      { label: 'Review Velocity', score: audit.reviewScore, color: [245, 158, 11] },
      { label: 'Badge Readiness', score: audit.complianceScore, color: [168, 85, 247] },
    ];

    pillarMetrics.forEach((pm, idx) => {
      const px = margin + idx * (cardWidth + 2);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(px, cursorY, cardWidth, 18, 2, 2, 'FD');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(pm.label.toUpperCase(), px + 3, cursorY + 5.5);

      doc.setTextColor(pm.color[0], pm.color[1], pm.color[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${pm.score}/100`, px + 3, cursorY + 12);

      // Mini bar
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(px + 3, cursorY + 14, cardWidth - 6, 1.8, 0.5, 0.5, 'F');
      doc.setFillColor(pm.color[0], pm.color[1], pm.color[2]);
      const fillW = Math.max(2, ((cardWidth - 6) * pm.score) / 100);
      doc.roundedRect(px + 3, cursorY + 14, fillW, 1.8, 0.5, 0.5, 'F');
    });

    cursorY += 23;

    // Executive Summary Box
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, cursorY, contentWidth, 24, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE GROWTH DIAGNOSTIC', margin + 4, cursorY + 5.5);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(audit.executiveSummary, contentWidth - 8);
    doc.text(splitSummary, margin + 4, cursorY + 10.5);

    cursorY += 28;

    // Telemetry Benchmarks Grid if available
    if (audit.telemetryHighlights && audit.telemetryHighlights.length > 0) {
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('ALGORITHMIC BENCHMARKS VS. CATEGORY TOP 3', margin, cursorY + 3);
      cursorY += 6;

      const tWidth = (contentWidth - 4) / 2;
      audit.telemetryHighlights.forEach((th, i) => {
        const tx = margin + (i % 2) * (tWidth + 4);
        const ty = cursorY + Math.floor(i / 2) * 11;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(tx, ty, tWidth, 9.5, 1.5, 1.5, 'FD');

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(th.label, tx + 3, ty + 4.5);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text(th.value, tx + 3, ty + 8);

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`(${th.benchmark})`, tx + tWidth - 3, ty + 8, { align: 'right' });
      });

      cursorY += Math.ceil(audit.telemetryHighlights.length / 2) * 11 + 5;
    }

    // ================= DETAILED FINDINGS =================
    checkPageBreak(30);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CRITICAL GAPS & ALGORITHMIC OPTIMIZATION OPPORTUNITIES', margin, cursorY + 3);
    cursorY += 7;

    audit.findings.forEach((finding, idx) => {
      const descLines = doc.splitTextToSize(finding.description, contentWidth - 10);
      const actionText = finding.action ? `Recommended Action: ${finding.action}` : '';
      const actionLines = actionText ? doc.splitTextToSize(actionText, contentWidth - 14) : [];
      const itemHeight = 16 + descLines.length * 3.8 + (actionLines.length ? actionLines.length * 3.6 + 6 : 0);

      checkPageBreak(itemHeight + 4);

      // Card Container
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, cursorY, contentWidth, itemHeight, 2, 2, 'FD');

      // Left Accent Strip
      const isCritical = finding.status.toLowerCase().includes('critical') || finding.status.toLowerCase().includes('gap');
      if (isCritical) {
        doc.setFillColor(239, 68, 68); // Red
      } else {
        doc.setFillColor(245, 158, 11); // Amber
      }
      doc.roundedRect(margin, cursorY, 2.5, itemHeight, 1, 1, 'F');

      // Title & Badge
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${finding.title}`, margin + 5, cursorY + 5.5);

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(pageWidth - margin - 35, cursorY + 2, 32, 5, 1, 1, 'F');
      doc.setTextColor(isCritical ? 220 : 180, isCritical ? 38 : 83, isCritical ? 38 : 9);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.text(finding.status.toUpperCase(), pageWidth - margin - 19, cursorY + 5.5, { align: 'center' });

      // Impact
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(`Projected Impact: ${finding.impact}`, margin + 5, cursorY + 9.5);

      // Description
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(descLines, margin + 5, cursorY + 14);

      // Action sub-box
      if (actionLines.length > 0) {
        const actionY = cursorY + 14 + descLines.length * 3.8;
        const subBoxH = actionLines.length * 3.6 + 4;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin + 4, actionY, contentWidth - 8, subBoxH, 1.5, 1.5, 'FD');

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(actionLines, margin + 6, actionY + 3.8);
      }

      cursorY += itemHeight + 3.5;
    });

    // ================= 22-RULE GUIDELINE & COMPLIANCE MATRIX =================
    if (audit.ruleEvaluations && audit.ruleEvaluations.length > 0) {
      checkPageBreak(35);
      cursorY += 4;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('22-RULE SHOPIFY ASO, POLARIS & APP GUIDELINES MATRIX', margin, cursorY + 3);
      cursorY += 7;

      audit.ruleEvaluations.forEach((rule) => {
        checkPageBreak(17);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, cursorY, contentWidth, 15, 1.5, 1.5, 'FD');

        // Status badge
        const isPass = rule.status === 'pass';
        const isWarn = rule.status === 'warning';
        doc.setFillColor(isPass ? 0 : isWarn ? 217 : 220, isPass ? 128 : isWarn ? 119 : 38, isPass ? 96 : isWarn ? 6 : 38);
        doc.roundedRect(margin + 3, cursorY + 2.5, 14, 4.5, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'bold');
        doc.text(rule.status.toUpperCase(), margin + 10, cursorY + 5.7, { align: 'center' });

        // Rule Name
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text(rule.ruleName, margin + 19, cursorY + 5.5);

        // Category & Impact
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text(`[${rule.category}] • Score: ${rule.score}/100 • Impact: ${rule.impact}`, margin + 19, cursorY + 9);

        // Observed vs Benchmark
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(6.5);
        const obsTrimmed = doc.splitTextToSize(`Observed: ${rule.observed} | Benchmark: ${rule.benchmark}`, contentWidth - 22)[0];
        doc.text(obsTrimmed, margin + 19, cursorY + 13);

        cursorY += 17;
      });
    }

    // ================= 30-DAY ACTION ROADMAP =================
    checkPageBreak(35);
    cursorY += 4;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('30-DAY SEQUENCED EXECUTION ROADMAP', margin, cursorY + 3);
    cursorY += 7;

    audit.roadmap.forEach((step) => {
      const recLines = doc.splitTextToSize(step.recommendation, contentWidth - 28);
      const rowHeight = Math.max(14, 9 + recLines.length * 3.6);

      checkPageBreak(rowHeight + 3);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, cursorY, contentWidth, rowHeight, 2, 2, 'FD');

      // Step Circle
      doc.setFillColor(7, 12, 27);
      doc.roundedRect(margin + 3, cursorY + 3, 8, 8, 1.5, 1.5, 'F');
      doc.setTextColor(0, 229, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`0${step.step}`, margin + 7, cursorY + 8.5, { align: 'center' });

      // Pillar and timeframe
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      const timeStr = step.timeframe ? ` • ${step.timeframe}` : '';
      doc.text(`${step.pillar.toUpperCase()}${timeStr}`, margin + 14, cursorY + 5.5);

      // Expected Lift on right
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(step.expectedLift, pageWidth - margin - 4, cursorY + 5.5, { align: 'right' });

      // Recommendation Text
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(recLines, margin + 14, cursorY + 9.5);

      cursorY += rowHeight + 2.5;
    });

    // Keywords if present
    if (audit.keywords && audit.keywords.length > 0) {
      checkPageBreak(25);
      cursorY += 3;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMMENDED HIGH-CONVERSION ASO KEYWORDS', margin, cursorY + 3);
      cursorY += 6;

      const kwText = audit.keywords.join('  •  ');
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, cursorY, contentWidth, 10, 2, 2, 'F');
      doc.setTextColor(30, 64, 175);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(doc.splitTextToSize(kwText, contentWidth - 8), margin + 4, cursorY + 5.5);
      cursorY += 14;
    }

    // Footer Call to Action Banner on final page
    checkPageBreak(28);
    cursorY += 4;
    doc.setFillColor(7, 12, 27);
    doc.roundedRect(margin, cursorY, contentWidth, 22, 2.5, 2.5, 'F');

    doc.setTextColor(0, 229, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPLEMENT THIS ROADMAP WITH CULTURISK', margin + 6, cursorY + 6.5);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Schedule an Executive 1-on-1 Strategy Call to configure your listing redesign, keyword indexation, or Polaris sprint.',
      margin + 6,
      cursorY + 11.5
    );

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text('https://culturisk.com • partner@culturisk.com • Confidential Diagnostic Review', margin + 6, cursorY + 16.5);

    // Trigger Browser Download
    const fileName = `${sanitizeFilename(audit.appName)}_ASO_Audit_Report.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate jsPDF audit report:', error);
    return false;
  }
}

/**
 * Generates and downloads a clean, standalone offline HTML report with embedded styles and print engine
 */
export function downloadAsoAuditHtml(
  rawAudit: MarketplaceAuditResponse | AuditResult,
  targetUrl?: string
): boolean {
  try {
    const audit = normalizeAuditData(rawAudit, targetUrl);
    const dateStr = getReportDate();

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ASO Audit Report - ${audit.appName} | Culturisk</title>
  <style>
    :root {
      --bg: #070C1B;
      --card: #0B132B;
      --surface: #131C35;
      --primary: #00E5FF;
      --accent: #10B981;
      --text: #F8FAFC;
      --muted: #94A3B8;
      --border: rgba(255, 255, 255, 0.12);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 32px 16px; line-height: 1.5; }
    .container { max-width: 960px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #0B132B, #131C35); border: 1px solid var(--border); border-radius: 20px; padding: 32px; margin-bottom: 24px; position: relative; }
    .brand { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--primary); text-transform: uppercase; margin-bottom: 8px; }
    .title { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .meta { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
    .badge { display: inline-block; background: rgba(0, 229, 255, 0.15); color: var(--primary); border: 1px solid rgba(0, 229, 255, 0.3); padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    .score-circle { position: absolute; top: 32px; right: 32px; width: 84px; height: 84px; border-radius: 20px; background: #070C1B; border: 2px solid var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0,229,255,0.2); }
    .score-num { font-size: 32px; font-weight: 800; color: var(--primary); line-height: 1; }
    .score-label { font-size: 9px; color: var(--muted); font-weight: 700; text-transform: uppercase; margin-top: 4px; }
    .summary-box { background: rgba(19, 28, 53, 0.6); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 24px; }
    .summary-box h3 { font-size: 14px; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 8px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .metric-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px; }
    .metric-title { font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 700; }
    .metric-val { font-size: 24px; font-weight: 800; color: var(--primary); margin: 6px 0; }
    .bar { background: rgba(255, 255, 255, 0.1); height: 6px; border-radius: 999px; overflow: hidden; }
    .bar-fill { background: var(--primary); height: 100%; }
    .section-title { font-size: 18px; font-weight: 800; margin: 32px 0 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    .finding-card { background: var(--card); border: 1px solid var(--border); border-left: 4px solid var(--primary); border-radius: 14px; padding: 18px; margin-bottom: 14px; }
    .finding-title { font-size: 15px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .impact-tag { font-size: 11px; color: var(--accent); font-weight: 700; font-family: monospace; }
    .finding-desc { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
    .finding-action { background: #070C1B; border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #E2E8F0; }
    .roadmap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 32px; }
    .roadmap-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; gap: 14px; }
    .step-num { width: 36px; height: 36px; border-radius: 10px; background: rgba(0, 229, 255, 0.15); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; shrink: 0; }
    .actions { display: flex; gap: 12px; margin-top: 32px; justify-content: center; }
    .btn { background: var(--primary); color: #070C1B; padding: 12px 24px; border-radius: 12px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; font-size: 14px; }
    .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
    @media print {
      body { background: #fff !important; color: #000 !important; padding: 0 !important; }
      .header, .metric-card, .finding-card, .roadmap-card, .summary-box { background: #fff !important; border: 1px solid #ccc !important; color: #000 !important; }
      .brand, .metric-val, .score-num, .finding-title { color: #008060 !important; }
      .actions, .btn { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Culturisk Platform Intelligence</div>
      <h1 class="title">${audit.appName}</h1>
      <div class="meta">Ecosystem: <strong>${audit.marketplaceName}</strong> • Generated: ${dateStr}</div>
      <span class="badge">ASO Performance Audit</span>
      ${audit.targetUrl ? `<div style="font-size:12px; color:var(--muted); margin-top:8px;">URL: ${audit.targetUrl}</div>` : ''}

      <div class="score-circle">
        <span class="score-num">${audit.overallScore}</span>
        <span class="score-label">Score</span>
      </div>
    </div>

    <div class="summary-box">
      <h3>Executive Summary</h3>
      <p style="font-size: 14px; color: #CBD5E1;">${audit.executiveSummary}</p>
    </div>

    <div class="grid-4">
      <div class="metric-card">
        <div class="metric-title">Keyword Saturation</div>
        <div class="metric-val">${audit.keywordScore}/100</div>
        <div class="bar"><div class="bar-fill" style="width:${audit.keywordScore}%;"></div></div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Visual Media CRO</div>
        <div class="metric-val" style="color:var(--accent);">${audit.visualCroScore}/100</div>
        <div class="bar"><div class="bar-fill" style="width:${audit.visualCroScore}%; background:var(--accent);"></div></div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Review Health</div>
        <div class="metric-val" style="color:#F59E0B;">${audit.reviewScore}/100</div>
        <div class="bar"><div class="bar-fill" style="width:${audit.reviewScore}%; background:#F59E0B;"></div></div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Badge Compliance</div>
        <div class="metric-val" style="color:#A855F7;">${audit.complianceScore}/100</div>
        <div class="bar"><div class="bar-fill" style="width:${audit.complianceScore}%; background:#A855F7;"></div></div>
      </div>
    </div>

    <h2 class="section-title">Critical Findings & Gaps</h2>
    ${audit.findings
      .map(
        (f) => `
      <div class="finding-card">
        <div class="finding-title">
          <span>${f.title}</span>
          <span class="impact-tag">${f.impact}</span>
        </div>
        <p class="finding-desc">${f.description}</p>
        ${f.action ? `<div class="finding-action"><strong>RECOMMENDED ACTION:</strong> ${f.action}</div>` : ''}
      </div>
    `
      )
      .join('')}

    ${
      audit.ruleEvaluations && audit.ruleEvaluations.length > 0
        ? `
    <h2 class="section-title">22-Rule Shopify App Directory & Polaris Guideline Matrix</h2>
    <div style="background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
        <thead>
          <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--border);">
            <th style="padding: 10px 14px;">Status</th>
            <th style="padding: 10px 14px;">Rule & Category</th>
            <th style="padding: 10px 14px;">Observed vs Benchmark</th>
            <th style="padding: 10px 14px;">Score</th>
          </tr>
        </thead>
        <tbody>
          ${audit.ruleEvaluations
            .map(
              (r) => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px 14px; vertical-align: top;">
                <span style="display:inline-block; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 10px; background: ${
                  r.status === 'pass'
                    ? 'rgba(0,128,96,0.2); color: #00a877'
                    : r.status === 'warning'
                    ? 'rgba(245,158,11,0.2); color: #F59E0B'
                    : 'rgba(239,68,68,0.2); color: #EF4444'
                };">${r.status.toUpperCase()}</span>
              </td>
              <td style="padding: 10px 14px; vertical-align: top;">
                <div style="font-weight: 700; color: var(--text);">${r.ruleName}</div>
                <div style="font-size: 11px; color: var(--muted);">${r.category} • ${r.impact}</div>
                <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px;">Rec: ${r.recommendation}</div>
              </td>
              <td style="padding: 10px 14px; vertical-align: top; color: var(--muted);">
                <div><strong>Observed:</strong> ${r.observed}</div>
                <div><strong>Benchmark:</strong> ${r.benchmark}</div>
              </td>
              <td style="padding: 10px 14px; vertical-align: top; font-weight: 800; color: var(--primary);">
                ${r.score}/100
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    `
        : ''
    }

    <h2 class="section-title">30-Day Execution Roadmap</h2>
    <div class="roadmap-grid">
      ${audit.roadmap
        .map(
          (r) => `
        <div class="roadmap-card">
          <div class="step-num">0${r.step}</div>
          <div>
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase; font-weight:700;">${r.pillar} ${r.timeframe ? `• ${r.timeframe}` : ''}</div>
            <div style="font-size:13px; font-weight:700; margin:4px 0;">${r.recommendation}</div>
            <div style="font-size:12px; color:var(--accent); font-weight:600;">Expected Lift: ${r.expectedLift}</div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="actions">
      <button class="btn" onclick="window.print()">Print / Save as PDF</button>
      <a href="https://culturisk.com" class="btn btn-outline" target="_blank">Book Strategy Consultation</a>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(audit.appName)}_ASO_Audit_Report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download HTML audit report:', err);
    return false;
  }
}

/**
 * Downloads a structured Markdown report
 */
export function downloadAsoAuditMarkdown(
  rawAudit: MarketplaceAuditResponse | AuditResult,
  targetUrl?: string
): boolean {
  try {
    const audit = normalizeAuditData(rawAudit, targetUrl);
    const dateStr = getReportDate();

    const mdContent = `# Culturisk ASO Diagnostic Report: ${audit.appName}
**Marketplace:** ${audit.marketplaceName}  
**Date:** ${dateStr}  
${audit.targetUrl ? `**URL Audited:** ${audit.targetUrl}  ` : ''}
**Overall Listing Health Score:** ${audit.overallScore} / 100

---

## Executive Growth Summary
${audit.executiveSummary}

---

## Pillar Performance Breakdown
- **Keyword Saturation & Semantic Search:** ${audit.keywordScore} / 100
- **Visual Media & Screenshot Carousel CRO:** ${audit.visualCroScore} / 100
- **Review Velocity & Rating Health:** ${audit.reviewScore} / 100
- **Ecosystem Compliance & Official Badging:** ${audit.complianceScore} / 100

---

## Key Algorithmic Gaps & Findings
${audit.findings
  .map(
    (f, i) => `### ${i + 1}. ${f.title}
- **Status:** ${f.status}
- **Projected Impact:** ${f.impact}
- **Description:** ${f.description}
${f.action ? `- **Recommended Action:** ${f.action}` : ''}
`
  )
  .join('\n')}

---

## 30-Day Execution Roadmap
${audit.roadmap
  .map(
    (r) => `### Step 0${r.step}: ${r.pillar} ${r.timeframe ? `(${r.timeframe})` : ''}
- **Action:** ${r.recommendation}
- **Expected Lift:** ${r.expectedLift}
`
  )
  .join('\n')}

${
  audit.keywords && audit.keywords.length > 0
    ? `---
## High-Conversion Search Keyword Opportunities
${audit.keywords.map((k) => `- \`${k}\``).join('\n')}
`
    : ''
}

---
*Report generated by Culturisk Growth Architecture Engine (https://culturisk.com)*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(audit.appName)}_ASO_Report.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download Markdown report:', err);
    return false;
  }
}

/**
 * Triggers native print preview
 */
export function printAsoAuditReport(
  rawAudit: MarketplaceAuditResponse | AuditResult,
  targetUrl?: string
) {
  // Try opening standalone HTML in a new print window
  const audit = normalizeAuditData(rawAudit, targetUrl);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${audit.appName} - ASO Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; }
            h1 { color: #008060; }
            .score { font-size: 24px; font-weight: bold; color: #008060; }
            .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>Culturisk ASO Audit: ${audit.appName}</h1>
          <p><strong>Marketplace:</strong> ${audit.marketplaceName} | <strong>Overall Score:</strong> <span class="score">${audit.overallScore}/100</span></p>
          <p>${audit.executiveSummary}</p>
          <hr />
          <h2>Findings</h2>
          ${audit.findings
            .map(
              (f) => `
            <div class="card">
              <h3>${f.title} (${f.impact})</h3>
              <p>${f.description}</p>
              ${f.action ? `<p><strong>Action:</strong> ${f.action}</p>` : ''}
            </div>
          `
            )
            .join('')}
          <h2>30-Day Roadmap</h2>
          ${audit.roadmap
            .map(
              (r) => `
            <div class="card">
              <h4>Step ${r.step}: ${r.pillar}</h4>
              <p>${r.recommendation} — <strong>Lift: ${r.expectedLift}</strong></p>
            </div>
          `
            )
            .join('')}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    window.print();
  }
}
