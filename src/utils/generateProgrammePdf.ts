import { SCHEDULE, DEFAULT_SITE_CONTENT } from '../data/expoData';

export const generateAndDownloadProgrammePdf = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the official programme guide.');
    return;
  }

  const day1 = SCHEDULE.filter(s => s.day === 1);
  const day2 = SCHEDULE.filter(s => s.day === 2);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>RECON Expo 2026 - Official Programme Guide</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
          .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 26px; font-weight: 900; color: #064e3b; margin: 0; }
          .subtitle { font-size: 14px; color: #059669; font-weight: 700; margin-top: 5px; }
          .meta { font-size: 13px; color: #64748b; margin-top: 8px; }
          .day-header { background: #064e3b; color: white; padding: 10px 16px; border-radius: 8px; font-size: 18px; font-weight: bold; margin-top: 30px; }
          .session-card { border-left: 4px solid #10b981; padding: 12px 16px; margin: 12px 0; background: #f8fafc; border-radius: 0 8px 8px 0; }
          .time { font-size: 12px; font-weight: bold; color: #059669; }
          .session-title { font-size: 15px; font-weight: bold; color: #0f172a; margin: 4px 0; }
          .location { font-size: 12px; color: #475569; font-style: italic; }
          .desc { font-size: 13px; color: #334155; margin-top: 4px; }
          .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${DEFAULT_SITE_CONTENT.eventTitle} (8th Edition)</div>
          <div class="subtitle">${DEFAULT_SITE_CONTENT.heroHeadline}</div>
          <div class="meta">${DEFAULT_SITE_CONTENT.eventDates} • ${DEFAULT_SITE_CONTENT.eventVenue}, Abuja</div>
        </div>

        <div class="day-header">DAY 1 - Thursday, 29th October 2026</div>
        ${day1.map(s => `
          <div class="session-card">
            <div class="time">${s.time} • [${s.track.toUpperCase()}]</div>
            <div class="session-title">${s.title}</div>
            <div class="location">📍 ${s.location}</div>
            <div class="desc">${s.description}</div>
          </div>
        `).join('')}

        <div class="day-header">DAY 2 - Friday, 30th October 2026</div>
        ${day2.map(s => `
          <div class="session-card">
            <div class="time">${s.time} • [${s.track.toUpperCase()}]</div>
            <div class="session-title">${s.title}</div>
            <div class="location">📍 ${s.location}</div>
            <div class="desc">${s.description}</div>
          </div>
        `).join('')}

        <div class="footer">
          Official Secretariat: ${DEFAULT_SITE_CONTENT.contactEmail} • ${DEFAULT_SITE_CONTENT.contactPhone} • www.reconexpo.ng
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
