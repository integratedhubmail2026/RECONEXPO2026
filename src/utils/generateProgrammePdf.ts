import { jsPDF } from 'jspdf';
import { Session, ExpoDetails } from '../types';

interface GeneratePdfOptions {
  sessions: Session[];
  expoDetails: ExpoDetails;
}

export const buildProgrammePdfDocument = ({ sessions, expoDetails }: GeneratePdfOptions): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  let currentY = margin;

  const primaryColor: [number, number, number] = [2, 44, 34]; // Deep Nigerian Forest Green (#022c22)
  const emeraldColor: [number, number, number] = [16, 185, 129]; // Emerald (#10b981)
  const redColor: [number, number, number] = [220, 38, 38]; // Red (#dc2626)
  const goldColor: [number, number, number] = [217, 119, 6]; // Amber Gold
  const darkText: [number, number, number] = [15, 23, 42]; // Slate 900
  const mutedText: [number, number, number] = [71, 85, 105]; // Slate 600
  const lightBg: [number, number, number] = [248, 250, 252]; // Slate 50

  // Dynamically derive days from sessions
  const uniqueDayNumbers = Array.from(new Set(sessions.map(s => s.day))).sort((a, b) => a - b);
  const dayNumbers = uniqueDayNumbers.length > 0 ? uniqueDayNumbers : [1];

  const defaultThemes: Record<number, string> = {
    1: 'Opening Ceremony, Policy Architecture, Infrastructure Investment & Plenary Keynotes',
    2: 'PropTech Hackathons, Real Estate Tokenization, Green Building & Deal Rooms',
    3: 'Sustainable Materials, Affordable Housing PPP, Startup Pitch & National Awards Gala',
  };

  const daysInfo: { day: number; label: string; date: string; theme: string }[] = dayNumbers.map(d => {
    const daySessions = sessions.filter(s => s.day === d);
    const sampleDate = daySessions[0]?.date || `Day ${d} Schedule`;
    const defaultTheme = defaultThemes[d] || daySessions[0]?.description || `Special Sessions, Exhibition & Panels for Day ${d}`;
    return {
      day: d,
      label: `DAY ${d}: ${daySessions[0]?.title || `EXPO AGENDA - DAY ${d}`}`.toUpperCase(),
      date: sampleDate,
      theme: defaultTheme
    };
  });

  // Helper: Draw Header Banner on top of pages
  const drawPageHeader = (pageNumber: number) => {
    // Top colored accent stripes (Green & Red)
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFillColor(...emeraldColor);
    doc.rect(0, 5, pageWidth * 0.7, 1.5, 'F');
    doc.setFillColor(...redColor);
    doc.rect(pageWidth * 0.7, 5, pageWidth * 0.3, 1.5, 'F');

    // Page header text for subsequent pages
    if (pageNumber > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...primaryColor);
      doc.text(`${(expoDetails.name || 'RECON EXPO 2026').toUpperCase()} — OFFICIAL PROGRAMME`, margin, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...mutedText);
      doc.text(`${expoDetails.dateRange || '29th – 30th October 2026'} | ${expoDetails.venue || "Shehu Musa Yar'Adua Centre"}`, pageWidth - margin, 12, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, 14, pageWidth - margin, 14);
    }
  };

  // Helper: Draw Footer on all pages
  const drawPageFooter = (pageNumber: number, totalPages: number) => {
    const footerY = pageHeight - 9;
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2.5, pageWidth - margin, footerY - 2.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...mutedText);
    doc.text(
      `Official Event Schedule • Secretariat: ${expoDetails.contactEmail || 'reconexpo@afrinetgroup.com'} • ${expoDetails.contactPhone || '+234 800 732 6639'}`,
      margin,
      footerY + 1
    );

    doc.setFont('helvetica', 'bold');
    doc.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth - margin,
      footerY + 1,
      { align: 'right' }
    );
  };

  // Check and create new page if space is low
  const ensureSpace = (neededHeightMm: number) => {
    if (currentY + neededHeightMm > pageHeight - 16) {
      doc.addPage();
      currentY = 20;
    }
  };

  // --- FIRST PAGE COVER BANNER ---
  drawPageHeader(1);
  currentY = 13;

  // Header Box
  doc.setFillColor(2, 44, 34); // Deep green
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'F');

  // Decorative badge inside header
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin + 5, currentY + 5, 48, 5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(2, 44, 34);
  doc.text('OFFICIAL CONFERENCE GUIDE', margin + 7, currentY + 8.5);

  // Expo Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text((expoDetails.name || 'RECON EXPO 2026').toUpperCase(), margin + 5, currentY + 17);

  // Subtitle / Theme
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(167, 243, 208); // Light emerald
  const themeLines = doc.splitTextToSize(`Theme: "${expoDetails.theme || 'Building Tomorrow: Sustainable Infrastructure, PropTech & Capital Investment'}"`, contentWidth - 10);
  doc.text(themeLines, margin + 5, currentY + 23);

  // Date & Venue Details Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`DATE: ${expoDetails.dateRange || '29th – 30th October 2026'}`, margin + 5, currentY + 33);
  doc.text(`VENUE: ${expoDetails.venue || "Shehu Musa Yar'Adua Centre"}, ${expoDetails.venueAddress || 'Abuja, Nigeria'}`, margin + 65, currentY + 33);

  currentY += 43;

  // Quick Executive Summary Box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text(`${daysInfo.length}-DAY EXECUTIVE PROGRAMME OVERVIEW`, margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...darkText);
  const overviewText = `Join 5,000+ delegates, 120+ exhibitors, and 50+ sovereign fund leaders across ${daysInfo.length} intensive days featuring Plenary Keynotes, PropTech Demonstrations, B2B Investor Rooms, and the National Real Estate Excellence Awards Gala.`;
  const overviewLines = doc.splitTextToSize(overviewText, contentWidth - 8);
  doc.text(overviewLines, margin + 4, currentY + 9.5);

  currentY += 23;

  // Render Day by Day Sessions
  for (const dayInfo of daysInfo) {
    const daySessions = sessions
      .filter(s => s.day === dayInfo.day)
      .sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

    // Check space for Day header
    ensureSpace(24);

    // Day Heading Banner
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, 'F');
    
    // Day indicator tab on left
    doc.setFillColor(...emeraldColor);
    doc.roundedRect(margin + 2, currentY + 2, 16, 8, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 44, 34);
    doc.text(`DAY ${dayInfo.day}`, margin + 4, currentY + 7);

    // Day title & Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(dayInfo.date.toUpperCase(), margin + 22, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(167, 243, 208);
    doc.text(dayInfo.theme, margin + 22, currentY + 9.5);

    currentY += 15;

    // Render Each Session in Day
    for (let i = 0; i < daySessions.length; i++) {
      const session = daySessions[i];
      
      const titleLines = doc.splitTextToSize(session.title, contentWidth - 48);
      const descLines = doc.splitTextToSize(session.description, contentWidth - 48);
      const speakerText = session.speakerName 
        ? `Speaker: ${session.speakerName} (${session.speakerRole || 'Keynote Presenter'})`
        : '';
      const speakerLines = speakerText ? doc.splitTextToSize(speakerText, contentWidth - 48) : [];
      
      const titleHeight = titleLines.length * 3.8;
      const descHeight = descLines.length * 3.2;
      const speakerHeight = speakerLines.length > 0 ? (speakerLines.length * 3 + 2) : 0;
      
      const cardHeight = Math.max(18, 10 + titleHeight + descHeight + speakerHeight);

      ensureSpace(cardHeight + 4);

      // Session Card Container
      const isEven = i % 2 === 0;
      if (session.featured) {
        doc.setFillColor(236, 253, 245); // Very soft emerald
        doc.setDrawColor(...emeraldColor);
        doc.setLineWidth(0.5);
      } else {
        doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.25);
      }
      doc.roundedRect(margin, currentY, contentWidth, cardHeight, 1.5, 1.5, 'FD');

      // Left Time Column
      doc.setFillColor(...primaryColor);
      doc.roundedRect(margin + 2, currentY + 2.5, 38, 5.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(session.time, margin + 3.5, currentY + 6.2);

      // Track / Category Badge
      let badgeColor: [number, number, number] = emeraldColor;
      let badgeTextColor: [number, number, number] = [2, 44, 34];
      if (session.category.toLowerCase().includes('keynote')) {
        badgeColor = redColor;
        badgeTextColor = [255, 255, 255];
      } else if (session.category.toLowerCase().includes('awards') || session.category.toLowerCase().includes('gala')) {
        badgeColor = goldColor;
        badgeTextColor = [255, 255, 255];
      }

      doc.setFillColor(...badgeColor);
      doc.roundedRect(margin + 2, currentY + 9, 38, 4.5, 0.8, 0.8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(...badgeTextColor);
      const catText = session.category.length > 20 ? session.category.substring(0, 18) + '...' : session.category;
      doc.text(catText.toUpperCase(), margin + 3.5, currentY + 12.2);

      // Location
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor(...mutedText);
      const locText = doc.splitTextToSize(session.location, 38);
      doc.text(locText, margin + 2, currentY + 16.5);

      // Right Main Content Column
      let innerY = currentY + 4.5;
      
      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...primaryColor);
      doc.text(titleLines, margin + 44, innerY);
      innerY += titleHeight + 0.5;

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...darkText);
      doc.text(descLines, margin + 44, innerY);
      innerY += descHeight + 0.5;

      // Speaker Box if present
      if (speakerLines.length > 0) {
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(6.2);
        doc.setTextColor(...emeraldColor);
        doc.text(speakerLines, margin + 44, innerY);
      }

      currentY += cardHeight + 2.5;
    }

    currentY += 4;
  }

  // Draw Page Numbering & Footers across all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    if (p > 1) {
      drawPageHeader(p);
    }
    drawPageFooter(p, totalPages);
  }

  return doc;
};

export const generateProgrammePdfDataUri = ({ sessions, expoDetails }: GeneratePdfOptions): { dataUri: string; sizeFormatted: string; name: string } => {
  const doc = buildProgrammePdfDocument({ sessions, expoDetails });
  const dataUri = doc.output('datauristring');
  const byteLength = dataUri.length * (3 / 4); // Approx size
  const sizeFormatted = byteLength > 1024 * 1024 
    ? `${(byteLength / (1024 * 1024)).toFixed(2)} MB` 
    : `${(byteLength / 1024).toFixed(1)} KB`;
  const name = `RECON_Expo_2026_Full_Conference_Programme_Updated.pdf`;
  return { dataUri, sizeFormatted, name };
};

export const generateProgrammePdf = async ({ sessions, expoDetails }: GeneratePdfOptions): Promise<void> => {
  const doc = buildProgrammePdfDocument({ sessions, expoDetails });
  const filename = `RECON_Expo_2026_Full_Conference_Programme.pdf`;
  doc.save(filename);
};
