import { EmailBlock, EmailTemplate } from '../types/marketing';
import { SmtpConfig } from './emailService';

export function renderEmailBlocksToHtml(
  blocks: EmailBlock[],
  tags: Record<string, string> = {},
  config?: Partial<SmtpConfig>
): string {
  const brandName = config?.headerTitle || 'RECON EXPO ABUJA';
  const tagline = config?.headerTagline || '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO 2026';
  const subtitle = config?.headerSubtitle || "October 29–31, 2026 • Shehu Musa Yar'Adua Centre, Abuja, Nigeria";
  const bannerColor = config?.headerBannerColor || '#012a20';
  const logoUrl = config?.headerLogoUrl || 'https://www.afrinetgroup.com/recon-logo.svg';

  const orgName = config?.footerOrganization || 'RECON Expo 2026 Secretariat & Organizing Committee';
  const venue = config?.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, CBD, Abuja, Nigeria";
  const hotlines = config?.footerHotlines || '+234 803 234 5678 | +234 802 987 6543';
  const email = config?.footerOfficialEmail || 'reconexpo@afrinetgroup.com';
  const website = config?.footerWebsite || 'https://reconexpo.afrinetgroup.com';
  const disclaimer = config?.footerDisclaimer || 'You are receiving this official communication because you registered for the 8th Real Estate & Construction Expo 2026. To manage your email preferences or update registration details, reply directly to this email or visit our secretariat portal.';

  // Default tag replacements
  const mergedTags: Record<string, string> = {
    name: 'Distinguished Delegate',
    email: 'delegate@example.com',
    ticket: 'RECON-2026-VIP-889',
    category: 'VIP Corporate Delegate',
    company: 'Leading Property Developments Ltd',
    booth: 'A-14 (Main Pavilion)',
    package_name: 'Platinum Executive Stand (36sqm)',
    date: 'October 29–31, 2026',
    venue: "Shehu Musa Yar'Adua Centre, Abuja",
    ...tags
  };

  const replaceTags = (str: string = ''): string => {
    let res = str;
    for (const [key, val] of Object.entries(mergedTags)) {
      res = res.replace(new RegExp(`{${key}}`, 'gi'), val);
    }
    return res;
  };

  const renderedBlocksHtml = blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${block.bgColor || bannerColor}; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 4px solid #d4af37;">
            <tr>
              <td style="padding: 28px 24px;" align="center">
                <div style="font-size: 11px; font-weight: 800; letter-spacing: 2.5px; color: #d4af37; text-transform: uppercase; margin-bottom: 8px;">
                  ${replaceTags(block.title || tagline)}
                </div>
                <div style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 1px; line-height: 1.2; text-transform: uppercase; margin-bottom: 6px;">
                  ${replaceTags(brandName)}
                </div>
                <div style="font-size: 13px; color: #a3e635; font-weight: 600; letter-spacing: 0.5px;">
                  ${replaceTags(block.subtitle || subtitle)}
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'hero':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 24px 24px 16px 24px;">
            ${block.imageUrl ? `
              <tr>
                <td style="padding-bottom: 16px;" align="${block.align || 'center'}">
                  ${block.buttonUrl ? `<a href="${replaceTags(block.buttonUrl)}" target="_blank" style="display: block; text-decoration: none;">` : ''}
                    <img 
                      src="${block.imageUrl}" 
                      alt="${replaceTags(block.imageAlt || block.title || 'RECON Expo 2026')}" 
                      width="552" 
                      style="display: block; width: 100%; max-width: 552px; height: auto; border-radius: ${block.imageBorderRadius || '8px'}; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);" 
                    />
                  ${block.buttonUrl ? `</a>` : ''}
                </td>
              </tr>
            ` : ''}
            <tr>
              <td style="text-align: ${block.align || 'left'};">
                ${block.title ? `<h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #012a20; line-height: 1.3;">${replaceTags(block.title)}</h1>` : ''}
                ${block.subtitle ? `<h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #15803d; line-height: 1.4;">${replaceTags(block.subtitle)}</h2>` : ''}
                ${block.content ? `<div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line;">${replaceTags(block.content)}</div>` : ''}
              </td>
            </tr>
          </table>
        `;

      case 'image':
        const imgWidth = block.imageWidth || '100%';
        const isFull = imgWidth === '100%';
        const maxWidthPx = imgWidth.includes('px') ? imgWidth : imgWidth === '80%' ? '440px' : imgWidth === '60%' ? '330px' : imgWidth === '50%' ? '275px' : '552px';
        const borderRadius = block.imageBorderRadius || '10px';
        const imgAlign = block.align || 'center';

        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 16px 24px;">
            <tr>
              <td align="${imgAlign}">
                ${block.title ? `<div style="font-size: 15px; font-weight: 800; color: #012a20; margin-bottom: 10px; text-align: ${imgAlign};">${replaceTags(block.title)}</div>` : ''}
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%; width: ${isFull ? '100%' : 'auto'};">
                  <tr>
                    <td align="${imgAlign}">
                      ${block.buttonUrl ? `<a href="${replaceTags(block.buttonUrl)}" target="_blank" style="text-decoration: none; display: block;">` : ''}
                        <img 
                          src="${block.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=1000&auto=format&fit=crop&q=80'}" 
                          alt="${replaceTags(block.imageAlt || block.title || 'RECON Expo 2026')}" 
                          style="display: block; width: 100%; max-width: ${maxWidthPx}; height: auto; border-radius: ${borderRadius}; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px -2px rgba(0,0,0,0.08);" 
                        />
                      ${block.buttonUrl ? `</a>` : ''}
                    </td>
                  </tr>
                </table>
                ${(block.imageCaption || block.content) ? `
                  <div style="font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic; text-align: ${imgAlign}; line-height: 1.4;">
                    ${replaceTags(block.imageCaption || block.content || '')}
                  </div>
                ` : ''}
              </td>
            </tr>
          </table>
        `;

      case 'text':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 12px 24px;">
            ${block.imageUrl ? `
              <tr>
                <td style="padding-bottom: 12px;" align="${block.align || 'center'}">
                  ${block.buttonUrl ? `<a href="${replaceTags(block.buttonUrl)}" target="_blank" style="display: block; text-decoration: none;">` : ''}
                    <img 
                      src="${block.imageUrl}" 
                      alt="${replaceTags(block.imageAlt || block.title || 'RECON Expo')}" 
                      style="display: block; width: 100%; max-width: 552px; height: auto; border-radius: ${block.imageBorderRadius || '8px'}; border: 1px solid #e2e8f0;" 
                    />
                  ${block.buttonUrl ? `</a>` : ''}
                </td>
              </tr>
            ` : ''}
            <tr>
              <td style="text-align: ${block.align || 'left'};">
                ${block.title ? `<div style="font-size: 16px; font-weight: 800; color: #012a20; margin-bottom: 8px;">${replaceTags(block.title)}</div>` : ''}
                <div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line;">
                  ${replaceTags(block.content || '')}
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'button':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px 24px;">
            <tr>
              <td align="${block.align || 'center'}">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: ${block.bgColor || '#d4af37'};">
                      <a href="${replaceTags(block.buttonUrl || '#')}" target="_blank" style="font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${block.textColor || '#012a20'}; text-decoration: none; padding: 14px 28px; display: inline-block; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        ${replaceTags(block.buttonText || 'Learn More')}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;

      case 'qr_badge':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 16px 24px;">
            <tr>
              <td>
                <div style="background: linear-gradient(135deg, #012a20 0%, #064e3b 100%); border-radius: 12px; padding: 24px; color: #ffffff; border: 2px solid #d4af37; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);">
                  <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #d4af37; text-transform: uppercase; margin-bottom: 4px;">
                    ${block.title || 'OFFICIAL ACCESS CREDENTIALS'}
                  </div>
                  <div style="font-size: 18px; font-weight: 800; margin-bottom: 16px; color: #ffffff;">
                    ${replaceTags(block.subtitle || 'VIP Delegate Fast-Track Pass')}
                  </div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-size: 13px; line-height: 1.8; color: #e2e8f0; vertical-align: middle;">
                        ${replaceTags(block.content || '').split('\n').map(l => `<div>• ${l}</div>`).join('')}
                      </td>
                      <td width="110" align="right" style="vertical-align: middle; padding-left: 12px;">
                        <div style="background-color: #ffffff; padding: 8px; border-radius: 8px; display: inline-block; border: 2px solid #d4af37;">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=95x95&data=RECON2026-${encodeURIComponent(mergedTags.ticket || 'VIP-889')}" alt="QR Pass" width="95" height="95" style="display: block; border-radius: 4px;" />
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        `;

      case 'features_2col':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 16px 24px;">
            <tr>
              <td>
                ${block.title ? `<div style="font-size: 13px; font-weight: 800; color: #012a20; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-left: 3px solid #d4af37; padding-left: 8px;">${replaceTags(block.title)}</div>` : ''}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${(block.items || []).map(item => `
                    <tr>
                      <td style="padding: 12px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            ${item.imageUrl ? `
                              <td width="72" style="vertical-align: top; padding-right: 12px;">
                                <img src="${item.imageUrl}" alt="${replaceTags(item.imageAlt || item.title)}" width="64" height="64" style="display: block; width: 64px; height: 64px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" />
                              </td>
                            ` : ''}
                            <td style="vertical-align: top;">
                              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${replaceTags(item.title)}</div>
                              ${item.description ? `<div style="font-size: 12px; color: #475569; line-height: 1.5;">${replaceTags(item.description)}</div>` : ''}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td height="8"></td></tr>
                  `).join('')}
                </table>
              </td>
            </tr>
          </table>
        `;

      case 'speaker_grid':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 16px 24px;">
            <tr>
              <td>
                ${block.title ? `<div style="font-size: 13px; font-weight: 800; color: #012a20; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-left: 3px solid #d4af37; padding-left: 8px;">${replaceTags(block.title)}</div>` : ''}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${(block.items || []).map(spk => `
                    <tr>
                      <td style="padding: 12px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; border-top: 1px solid #dcfce7; border-right: 1px solid #dcfce7; border-bottom: 1px solid #dcfce7;">
                        <table role="presentation" width="100%">
                          <tr>
                            ${spk.imageUrl ? `
                              <td width="56" style="vertical-align: middle; padding-right: 12px;">
                                <img src="${spk.imageUrl}" alt="${replaceTags(spk.title)}" width="48" height="48" style="display: block; width: 48px; height: 48px; border-radius: 9999px; object-fit: cover; border: 2px solid #16a34a;" />
                              </td>
                            ` : ''}
                            <td style="vertical-align: middle;">
                              <div style="font-size: 14px; font-weight: 800; color: #012a20;">${replaceTags(spk.title)}</div>
                              <div style="font-size: 12px; color: #166534; font-weight: 500; margin-top: 2px;">${replaceTags(spk.description || '')}</div>
                            </td>
                            ${spk.tag ? `<td align="right" width="110" style="vertical-align: top;"><span style="font-size: 10px; font-weight: 800; background-color: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 12px; text-transform: uppercase;">${replaceTags(spk.tag)}</span></td>` : ''}
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td height="8"></td></tr>
                  `).join('')}
                </table>
              </td>
            </tr>
          </table>
        `;

      case 'schedule_box':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 16px 24px;">
            <tr>
              <td>
                ${block.title ? `<div style="font-size: 13px; font-weight: 800; color: #012a20; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-left: 3px solid #d4af37; padding-left: 8px;">${replaceTags(block.title)}</div>` : ''}
                
                ${(block.items || []).map((item, dayIdx) => {
                  const itemTitle = replaceTags(item.title || '');
                  const lines = (item.description || '').split('\n').map(l => l.trim()).filter(l => l.length > 0);
                  
                  return `
                    <!-- Calendar Day Card Block -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                      <!-- Visual Calendar Header Tab -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #012a20 0%, #0c3e32 100%); padding: 14px 18px; border-bottom: 3.5px solid #d4af37;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" style="vertical-align: middle;">
                                <div style="background-color: rgba(212, 175, 55, 0.15); border-radius: 8px; width: 28px; height: 28px; line-height: 28px; text-align: center; border: 1px solid rgba(212, 175, 55, 0.3);">
                                  <span style="font-size: 15px;">📅</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle; padding-left: 4px;">
                                <div style="font-size: 11px; font-weight: 800; color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1px;">
                                  SCHEDULE ITINERARY
                                </div>
                                <div style="font-size: 14px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">
                                  ${itemTitle}
                                </div>
                              </td>
                              <td align="right" style="vertical-align: middle;">
                                <span style="font-size: 10px; font-weight: 800; color: #012a20; background-color: #d4af37; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                                  DAY ${dayIdx + 1}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Calendar Sessions List Container -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 12px 16px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${lines.map((line, lineIdx) => {
                              // Regex to parse timing format from session text
                              const timeRegex = /^(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?(?:\s*[-–—:]\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)?)\s*[-–—:]\s*(.*)$/i;
                              const timeMatch = line.match(timeRegex);
                              
                              const isLast = lineIdx === lines.length - 1;
                              const borderStyle = isLast ? '' : 'border-bottom: 1px solid #e2e8f0;';
                              
                              if (timeMatch) {
                                const rawTime = replaceTags(timeMatch[1].trim());
                                const sessionText = replaceTags(timeMatch[2].trim());
                                
                                // Clean timing output format
                                const timingLabel = rawTime.toUpperCase();
                                
                                // Determine dynamic location badges & track categories based on keywords
                                let track = 'General Session';
                                let trackBg = '#f1f5f9';
                                let trackColor = '#475569';
                                let location = 'Exhibition Pavilion';
                                
                                const lowerText = sessionText.toLowerCase();
                                if (lowerText.includes('opening') || lowerText.includes('ribbon') || lowerText.includes('ministerial') || lowerText.includes('keynote') || lowerText.includes('plenary') || lowerText.includes('gala') || lowerText.includes('awards')) {
                                  track = 'Plenary Session';
                                  trackBg = '#f0fdf4';
                                  trackColor = '#166534';
                                  location = 'Main Plenary Hall';
                                } else if (lowerText.includes('proptech') || lowerText.includes('smart') || lowerText.includes('materials') || lowerText.includes('concrete') || lowerText.includes('masterclass') || lowerText.includes('technical') || lowerText.includes('workshop')) {
                                  track = 'Technical Masterclass';
                                  trackBg = '#eff6ff';
                                  trackColor = '#1e40af';
                                  location = 'CPD Masterclass Room';
                                } else if (lowerText.includes('b2b') || lowerText.includes('matchmaking') || lowerText.includes('pitch') || lowerText.includes('investor') || lowerText.includes('deal')) {
                                  track = 'B2B Matchmaking';
                                  trackBg = '#fff7ed';
                                  trackColor = '#9a3412';
                                  location = 'Executive VIP Deal Lounge';
                                } else if (lowerText.includes('site tour') || lowerText.includes('shuttle') || lowerText.includes('boarding') || lowerText.includes('tour')) {
                                  track = 'Field Study';
                                  trackBg = '#faf5ff';
                                  trackColor = '#6b21a8';
                                  location = 'Main Gate Assembly';
                                }
                                
                                if (lowerText.includes('gala') || lowerText.includes('awards') || lowerText.includes('dinner')) {
                                  location = 'Grand Ballroom';
                                  track = 'VIP Gala Event';
                                  trackBg = '#fffbeb';
                                  trackColor = '#b45309';
                                }
                                
                                return `
                                  <tr>
                                    <td style="padding: 12px 0; ${borderStyle} vertical-align: top;">
                                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <!-- Timeline Time Marker Column -->
                                          <td width="110" style="vertical-align: top; padding-right: 14px;">
                                            <div style="background-color: #012a20; border-radius: 20px; padding: 4px 10px; text-align: center; border: 1.5px solid #d4af37; box-shadow: 0 2px 4px rgba(1,42,32,0.15);">
                                              <span style="font-size: 10px; font-weight: 900; color: #d4af37; font-family: 'Courier New', Courier, monospace; letter-spacing: 0.2px; white-space: nowrap;">
                                                ⏰ ${timingLabel}
                                              </span>
                                            </div>
                                          </td>
                                          
                                          <!-- Session Title & Badge Details -->
                                          <td style="vertical-align: top;">
                                            <div style="font-size: 13px; font-weight: 800; color: #012a20; line-height: 1.45; margin-bottom: 5px;">
                                              ${sessionText}
                                            </div>
                                            <!-- Responsive Visual Badges -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                              <tr>
                                                <td style="padding-right: 8px;">
                                                  <span style="font-size: 9px; font-weight: 800; background-color: ${trackBg}; color: ${trackColor}; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; border: 1px solid rgba(0,0,0,0.03); display: inline-block;">
                                                    ${track}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span style="font-size: 9px; font-weight: 700; background-color: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 4px; display: inline-block;">
                                                    📍 ${location}
                                                  </span>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                `;
                              } else {
                                // Fallback for general text line
                                return `
                                  <tr>
                                    <td style="padding: 10px 0; ${borderStyle} font-size: 12.5px; color: #334155; line-height: 1.6; vertical-align: top;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                          <td width="20" style="vertical-align: top; font-size: 13px; color: #d4af37;">🔸</td>
                                          <td style="vertical-align: top;">
                                            ${replaceTags(line)}
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                `;
                              }
                            }).join('')}
                          </table>
                        </td>
                      </tr>
                    </table>
                  `;
                }).join('')}
              </td>
            </tr>
          </table>
        `;

      case 'pricing_table':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 16px 24px;">
            <tr>
              <td>
                ${block.title ? `<div style="font-size: 13px; font-weight: 800; color: #012a20; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-left: 3px solid #d4af37; padding-left: 8px;">${replaceTags(block.title)}</div>` : ''}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${(block.items || []).map(item => `
                    <tr>
                      <td style="padding: 14px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">
                        <table role="presentation" width="100%">
                          <tr>
                            <td>
                              <div style="font-size: 15px; font-weight: 800; color: #012a20;">${replaceTags(item.title)}</div>
                              <div style="font-size: 12px; color: #475569; margin-top: 4px;">${replaceTags(item.description || '')}</div>
                            </td>
                            ${item.tag ? `<td align="right" width="90"><span style="background-color: #d4af37; color: #012a20; font-weight: 800; font-size: 10px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">${replaceTags(item.tag)}</span></td>` : ''}
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td height="8"></td></tr>
                  `).join('')}
                </table>
              </td>
            </tr>
          </table>
        `;

      case 'divider':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 8px 24px;">
            <tr>
              <td><hr style="border: none; border-top: 1px solid #e2e8f0; margin: 8px 0;" /></td>
            </tr>
          </table>
        `;

      case 'footer':
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #011b15; border-radius: 0 0 12px 12px; text-align: center; border-top: 2px solid #d4af37;">
            <tr>
              <td style="padding: 28px 24px;">
                <div style="font-size: 12px; font-weight: 800; color: #d4af37; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase;">
                  ${replaceTags(orgName)}
                </div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">
                  📍 ${replaceTags(venue)}<br/>
                  📞 ${replaceTags(hotlines)} &nbsp;|&nbsp; ✉️ <a href="mailto:${replaceTags(email)}" style="color: #4ade80; text-decoration: none;">${replaceTags(email)}</a>
                </div>
                <div style="font-size: 11px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
                  🌐 <a href="${replaceTags(website)}" target="_blank" style="color: #d4af37; text-decoration: none; font-weight: 700;">${replaceTags(website)}</a> &nbsp;|&nbsp;
                  <a href="${replaceTags(website)}/portal" target="_blank" style="color: #94a3b8; text-decoration: underline;">Manage Pass</a> &nbsp;|&nbsp;
                  <a href="${replaceTags(website)}/unsubscribe?email=${encodeURIComponent(mergedTags.email || '')}" target="_blank" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
                </div>
                <div style="font-size: 10px; color: #475569; line-height: 1.4; border-top: 1px solid #0f2d25; padding-top: 12px;">
                  ${replaceTags(disclaimer)}<br/>
                  <span style="opacity: 0.8;">© 2026 RECON Expo Secretariat. Registered in the Federal Republic of Nigeria.</span>
                </div>
              </td>
            </tr>
          </table>
        `;

      default:
        return '';
    }
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${brandName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style type="text/css">
    body, table, td, a, span {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: #15803d; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #f1f5f9;">
  <!-- Hidden Preheader Anti-Spam Inbox Optimization -->
  <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${replaceTags(tagline)} • Official Notification for RECON Expo 2026 Abuja.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <center style="width: 100%; table-layout: fixed;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9;">
      <tr>
        <td align="center" style="padding: 0 12px;">
          <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
            <tr>
              <td>
                ${renderedBlocksHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `.trim();
}

// Generates RFC-compliant clean Plain Text for Multi-part MIME alternative
export function renderEmailBlocksToPlainText(
  blocks: EmailBlock[],
  tags: Record<string, string> = {},
  config?: Partial<SmtpConfig>
): string {
  const brandName = config?.headerTitle || 'RECON EXPO ABUJA';
  const orgName = config?.footerOrganization || 'RECON Expo 2026 Secretariat';
  const venue = config?.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Abuja, Nigeria";
  const hotlines = config?.footerHotlines || '+234 803 234 5678';
  const email = config?.footerOfficialEmail || 'reconexpo@afrinetgroup.com';
  const website = config?.footerWebsite || 'https://www.afrinetgroup.com';

  const mergedTags: Record<string, string> = {
    name: 'Distinguished Delegate',
    email: 'delegate@example.com',
    ticket: 'RECON-2026-VIP-889',
    category: 'VIP Corporate Delegate',
    company: 'Leading Property Developments Ltd',
    booth: 'A-14',
    date: 'October 29–31, 2026',
    venue: "Shehu Musa Yar'Adua Centre, Abuja",
    ...tags
  };

  const replaceTags = (str: string = ''): string => {
    let res = str;
    for (const [key, val] of Object.entries(mergedTags)) {
      res = res.replace(new RegExp(`{${key}}`, 'gi'), val);
    }
    return res;
  };

  const lines: string[] = [
    `=== ${brandName} ===`,
    `8th Real Estate & Construction Expo • October 29–31, 2026`,
    `Shehu Musa Yar'Adua Centre, Abuja, Nigeria`,
    `-----------------------------------------------------\n`
  ];

  for (const block of blocks) {
    if (block.type === 'hero') {
      if (block.title) lines.push(replaceTags(block.title).toUpperCase());
      if (block.subtitle) lines.push(replaceTags(block.subtitle));
      if (block.content) lines.push(`\n${replaceTags(block.content)}\n`);
      if (block.imageUrl) lines.push(`[Hero Image: ${block.imageUrl}]`);
    } else if (block.type === 'image') {
      if (block.title) lines.push(`[Image: ${replaceTags(block.title)}]`);
      if (block.imageUrl) lines.push(`URL: ${block.imageUrl}`);
      if (block.buttonUrl) lines.push(`Link: ${replaceTags(block.buttonUrl)}`);
      if (block.imageCaption || block.content) lines.push(`Caption: ${replaceTags(block.imageCaption || block.content || '')}`);
    } else if (block.type === 'text') {
      if (block.title) lines.push(replaceTags(block.title));
      if (block.content) lines.push(`${replaceTags(block.content)}\n`);
    } else if (block.type === 'button') {
      lines.push(`>> ${replaceTags(block.buttonText || 'Link')}: ${replaceTags(block.buttonUrl || website)} <<\n`);
    } else if (block.type === 'qr_badge') {
      lines.push(`[DIGITAL PASS CREDENTIALS]`);
      lines.push(`Delegate: ${mergedTags.name}`);
      lines.push(`Ticket #: ${mergedTags.ticket}`);
      lines.push(`Category: ${mergedTags.category}\n`);
    } else if (block.type === 'features_2col' || block.type === 'speaker_grid' || block.type === 'schedule_box' || block.type === 'pricing_table') {
      if (block.title) lines.push(`\n-- ${replaceTags(block.title)} --`);
      for (const item of block.items || []) {
        lines.push(`• ${replaceTags(item.title)}`);
        if (item.description) lines.push(`  ${replaceTags(item.description)}`);
      }
      lines.push('');
    }
  }

  lines.push(`-----------------------------------------------------`);
  lines.push(`Secretariat: ${orgName}`);
  lines.push(`Venue: ${venue}`);
  lines.push(`Hotlines: ${hotlines} | Email: ${email}`);
  lines.push(`Website: ${website}`);
  lines.push(`To manage preferences or unsubscribe: ${website}/unsubscribe?email=${encodeURIComponent(mergedTags.email || '')}`);

  return lines.join('\n');
}

// ----------------------------------------------------------------------
// Dedicated High-Converting Renderer for Visitor -> Elite VIP Upgrade Drip
// ----------------------------------------------------------------------
export function renderVisitorUpgradeDripStepToHtml(
  step: {
    id: string;
    dayNumber: number;
    title: string;
    badge: string;
    subject: string;
    preheader: string;
    benefitFocus: string;
    vipBenefitList: string[];
    bodyContent: string;
    callToActionText: string;
    callToActionUrl: string;
    imageUrl?: string;
    imageAlt?: string;
  },
  tags: Record<string, string> = {},
  config?: Partial<SmtpConfig>
): string {
  const brandName = config?.headerTitle || 'RECON EXPO ABUJA';
  const tagline = config?.headerTagline || '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO 2026';
  const subtitle = config?.headerSubtitle || "October 29–31, 2026 • Shehu Musa Yar'Adua Centre, Abuja, Nigeria";
  const bannerColor = config?.headerBannerColor || '#012a20';
  const logoUrl = config?.headerLogoUrl || 'https://www.afrinetgroup.com/recon-logo.svg';

  const orgName = config?.footerOrganization || 'RECON Expo 2026 Secretariat & Organizing Committee';
  const venue = config?.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, CBD, Abuja, Nigeria";
  const hotlines = config?.footerHotlines || '+234 803 234 5678 | +234 802 987 6543';
  const email = config?.footerOfficialEmail || 'reconexpo@afrinetgroup.com';
  const website = config?.footerWebsite || 'https://www.afrinetgroup.com';
  const disclaimer = config?.footerDisclaimer || 'You are receiving this exclusive upgrade follow-up series because you registered as a Free General Visitor for RECON Expo 2026. If you upgrade to Elite VIP Guest pass, this follow-up sequence will immediately and automatically stop.';

  const mergedTags: Record<string, string> = {
    name: 'Distinguished Visitor',
    email: 'visitor@example.com',
    ticket: 'RECON-2026-VIS-001',
    organization: 'General Visitor',
    date: 'October 29–31, 2026',
    venue: "Shehu Musa Yar'Adua Centre, Abuja",
    upgrade_price: '₦20,000 / $20',
    discount_code: 'VIPUPGRADE5K',
    ...tags
  };

  const replaceTags = (str: string = ''): string => {
    let res = str;
    for (const [key, val] of Object.entries(mergedTags)) {
      res = res.replace(new RegExp(`{${key}}`, 'gi'), val);
    }
    return res;
  };

  const replacedSubject = replaceTags(step.subject);
  const replacedPreheader = replaceTags(step.preheader);
  const replacedBody = replaceTags(step.bodyContent);
  const replacedCta = replaceTags(step.callToActionText);
  const replacedUrl = replaceTags(step.callToActionUrl);
  const replacedFocus = replaceTags(step.benefitFocus);

  const vipBenefitListHtml = (step.vipBenefitList || []).map(b => `
    <tr>
      <td style="padding: 6px 0; vertical-align: top; width: 24px;">
        <span style="display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; background-color: #dcfce7; color: #15803d; border-radius: 50%; font-size: 11px; font-weight: bold;">✓</span>
      </td>
      <td style="padding: 6px 0 6px 8px; font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.4;">
        ${replaceTags(b)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${replacedSubject}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- INVISIBLE PREHEADER -->
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: monospace; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${replacedPreheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background-color: ${bannerColor}; padding: 28px 24px; text-align: center; border-bottom: 4px solid #d4af37;" align="center">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #d4af37; text-transform: uppercase; margin-bottom: 6px;">
                ${replaceTags(tagline)}
              </div>
              <div style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">
                ${replaceTags(brandName)}
              </div>
              <div style="font-size: 12px; color: #a3e635; font-weight: 600;">
                ${replaceTags(subtitle)}
              </div>
            </td>
          </tr>

          <!-- SEQUENCE BADGE -->
          <tr>
            <td style="padding: 16px 24px 0 24px; text-align: center;">
              <span style="display: inline-block; background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                🌟 ${replaceTags(step.badge)} • VIP UPGRADE SERIES
              </span>
            </td>
          </tr>

          <!-- HERO BANNER IMAGE (IF PRESENT) -->
          ${step.imageUrl ? `
          <tr>
            <td style="padding: 16px 24px 8px 24px; text-align: center;">
              <a href="${replacedUrl}" target="_blank" style="display: block; text-decoration: none;">
                <img 
                  src="${step.imageUrl}" 
                  alt="${replaceTags(step.imageAlt || step.title)}" 
                  width="552" 
                  style="display: block; width: 100%; max-width: 552px; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);" 
                />
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- MAIN CONTENT BODY -->
          <tr>
            <td style="padding: 16px 24px 20px 24px; text-align: left;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #012a20; line-height: 1.35;">
                ${replacedSubject}
              </h1>

              <div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line; margin-bottom: 20px;">
                ${replacedBody}
              </div>

              <!-- VIP BENEFIT HIGHLIGHT BOX -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #d4af37; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #012a20; letter-spacing: 0.5px; margin-bottom: 8px;">
                      👑 Key Privilege Highlight: ${replacedFocus}
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${vipBenefitListHtml}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- PRIMARY UPGRADE ACTION BUTTON -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${replacedUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #15803d 0%, #012a20 100%); background-color: #15803d; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 15px 28px; border-radius: 8px; border: 1px solid #166534; box-shadow: 0 4px 12px rgba(21,128,61,0.3); text-align: center; letter-spacing: 0.3px;">
                      ${replacedCta} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- AUTO-STOP POLICY ASSURANCE NOTICE -->
              <div style="background-color: #f0fdf4; border: 1px dashed #86efac; border-radius: 6px; padding: 10px 14px; text-align: center; margin-top: 16px;">
                <span style="font-size: 11px; color: #166534; font-weight: 600;">
                  🛡️ <strong>Automated Stop Guarantee:</strong> Once you complete your Elite VIP Guest registration, all upgrade follow-up emails will immediately stop.
                </span>
              </div>
            </td>
          </tr>

          <!-- COMPLIANT FOOTER -->
          <tr>
            <td style="background-color: #011b15; color: #cbd5e1; padding: 24px; font-size: 12px; line-height: 1.6; text-align: center; border-top: 3px solid #d4af37;">
              <div style="font-weight: 800; font-size: 13px; color: #f8fafc; margin-bottom: 6px;">
                ${replaceTags(orgName)}
              </div>
              <div style="color: #94a3b8; margin-bottom: 8px;">
                📍 ${replaceTags(venue)}
              </div>
              <div style="color: #94a3b8; margin-bottom: 12px;">
                📞 ${replaceTags(hotlines)} &nbsp;|&nbsp; ✉️ <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a>
              </div>
              <div style="margin-bottom: 12px;">
                <a href="${website}" target="_blank" style="color: #a3e635; font-weight: bold; text-decoration: none;">Visit Official Portal (${website})</a>
              </div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #1e293b; padding-top: 12px; margin-top: 12px;">
                ${replaceTags(disclaimer)}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function renderVisitorUpgradeDripStepToPlainText(
  step: {
    id: string;
    title: string;
    badge: string;
    subject: string;
    benefitFocus: string;
    vipBenefitList: string[];
    bodyContent: string;
    callToActionText: string;
    callToActionUrl: string;
  },
  tags: Record<string, string> = {},
  config?: Partial<SmtpConfig>
): string {
  const brandName = config?.headerTitle || 'RECON EXPO ABUJA';
  const orgName = config?.footerOrganization || 'RECON Expo 2026 Secretariat & Organizing Committee';
  const venue = config?.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, CBD, Abuja, Nigeria";
  const hotlines = config?.footerHotlines || '+234 803 234 5678 | +234 802 987 6543';
  const email = config?.footerOfficialEmail || 'reconexpo@afrinetgroup.com';
  const website = config?.footerWebsite || 'https://www.afrinetgroup.com';

  const mergedTags: Record<string, string> = {
    name: 'Distinguished Visitor',
    email: 'visitor@example.com',
    ticket: 'RECON-2026-VIS-001',
    upgrade_price: '₦20,000 / $20',
    discount_code: 'VIPUPGRADE5K',
    ...tags
  };

  const replaceTags = (str: string = ''): string => {
    let res = str;
    for (const [key, val] of Object.entries(mergedTags)) {
      res = res.replace(new RegExp(`{${key}}`, 'gi'), val);
    }
    return res;
  };

  const lines: string[] = [
    `=== ${brandName} ===`,
    `[${replaceTags(step.badge)} • VIP UPGRADE FOLLOW-UP]`,
    `-----------------------------------------------------`,
    `${replaceTags(step.subject)}\n`,
    `${replaceTags(step.bodyContent)}\n`,
    `--- KEY ELITE VIP BENEFITS ---`,
    `Focus: ${replaceTags(step.benefitFocus)}`
  ];

  for (const benefit of step.vipBenefitList || []) {
    lines.push(`• ${replaceTags(benefit)}`);
  }

  lines.push(`\n>> ${replaceTags(step.callToActionText)}: ${replaceTags(step.callToActionUrl)} <<\n`);
  lines.push(`* Note: Once upgraded to Elite VIP Guest, this follow-up sequence immediately stops.`);
  lines.push(`-----------------------------------------------------`);
  lines.push(`Secretariat: ${orgName}`);
  lines.push(`Venue: ${venue}`);
  lines.push(`Hotlines: ${hotlines} | Email: ${email}`);
  lines.push(`Website: ${website}`);

  return lines.join('\n');
}

// ----------------------------------------------------------------------------------
// High-Converting Recovery Renderer for Unconfirmed / Abandoned Elite VIP Payment
// ----------------------------------------------------------------------------------
export function renderUnconfirmedVipRecoveryStepToHtml(
  step: {
    id: string;
    dayNumber: number;
    title: string;
    badge: string;
    subject: string;
    preheader: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    vipBenefitFocus: string;
    vipBenefitsList: string[];
    bodyContent: string;
    paymentButtonText: string;
    paymentButtonUrl: string;
    alternateBankTransferText?: string;
    imageUrl?: string;
    imageAlt?: string;
  },
  tags: Record<string, string> = {},
  config?: Partial<SmtpConfig>
): string {
  const brandName = config?.headerTitle || 'RECON EXPO ABUJA';
  const tagline = config?.headerTagline || '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO 2026';
  const subtitle = config?.headerSubtitle || "October 29–31, 2026 • Shehu Musa Yar'Adua Centre, Abuja, Nigeria";
  const bannerColor = config?.headerBannerColor || '#012a20';
  const logoUrl = config?.headerLogoUrl || 'https://www.afrinetgroup.com/recon-logo.svg';

  const orgName = config?.footerOrganization || 'RECON Expo 2026 Secretariat & Organizing Committee';
  const venue = config?.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, CBD, Abuja, Nigeria";
  const hotlines = config?.footerHotlines || '+234 803 234 5678 | +234 802 987 6543';
  const email = config?.footerOfficialEmail || 'reconexpo@afrinetgroup.com';
  const website = config?.footerWebsite || 'https://www.afrinetgroup.com';
  const disclaimer = config?.footerDisclaimer || 'You are receiving this payment confirmation reminder because an Elite VIP registration was initiated under this email address. Once payment is confirmed by our admin secretariat, this reminder follow-up will immediately and permanently stop.';

  const mergedTags: Record<string, string> = {
    name: 'Distinguished VIP Guest',
    email: 'delegate@example.com',
    ticket: 'RECON-2026-VIP-PENDING',
    amount_due: '₦25,000 ($25)',
    date: 'October 29–31, 2026',
    venue: "Shehu Musa Yar'Adua Centre, Abuja",
    ...tags
  };

  const replaceTags = (str: string = ''): string => {
    let res = str;
    for (const [key, val] of Object.entries(mergedTags)) {
      res = res.replace(new RegExp(`{${key}}`, 'gi'), val);
    }
    return res;
  };

  const replacedSubject = replaceTags(step.subject);
  const replacedPreheader = replaceTags(step.preheader);
  const replacedBody = replaceTags(step.bodyContent);
  const replacedBtnText = replaceTags(step.paymentButtonText);
  const replacedBtnUrl = replaceTags(step.paymentButtonUrl);
  const replacedFocus = replaceTags(step.vipBenefitFocus);
  const replacedBankInfo = replaceTags(step.alternateBankTransferText || '');

  const urgencyBadgeColor = step.urgencyLevel === 'critical'
    ? 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
    : step.urgencyLevel === 'high'
    ? 'background-color: #ffedd5; color: #9a3412; border: 1px solid #fdba74;'
    : 'background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a;';

  const vipBenefitListHtml = (step.vipBenefitsList || []).map(b => `
    <tr>
      <td style="padding: 5px 0; vertical-align: top; width: 22px;">
        <span style="display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; background-color: #fef3c7; color: #b45309; border-radius: 50%; font-size: 11px; font-weight: 900;">👑</span>
      </td>
      <td style="padding: 5px 0 5px 8px; font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.4;">
        ${replaceTags(b)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${replacedSubject}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- INVISIBLE PREHEADER -->
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: monospace; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${replacedPreheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background-color: ${bannerColor}; padding: 28px 24px; text-align: center; border-bottom: 4px solid #d4af37;" align="center">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #d4af37; text-transform: uppercase; margin-bottom: 6px;">
                ${replaceTags(tagline)}
              </div>
              <div style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">
                ${replaceTags(brandName)}
              </div>
              <div style="font-size: 12px; color: #a3e635; font-weight: 600;">
                ${replaceTags(subtitle)}
              </div>
            </td>
          </tr>

          <!-- URGENCY & RECOVERY BADGE -->
          <tr>
            <td style="padding: 16px 24px 0 24px; text-align: center;">
              <span style="display: inline-block; ${urgencyBadgeColor} font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                ⚠️ ${replaceTags(step.badge)} • VIP PAYMENT RECOVERY
              </span>
            </td>
          </tr>

          <!-- HERO BANNER IMAGE (IF PRESENT) -->
          ${step.imageUrl ? `
          <tr>
            <td style="padding: 16px 24px 8px 24px; text-align: center;">
              <a href="${replacedBtnUrl}" target="_blank" style="display: block; text-decoration: none;">
                <img 
                  src="${step.imageUrl}" 
                  alt="${replaceTags(step.imageAlt || step.title)}" 
                  width="552" 
                  style="display: block; width: 100%; max-width: 552px; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);" 
                />
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- MAIN CONTENT BODY -->
          <tr>
            <td style="padding: 16px 24px 20px 24px; text-align: left;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #012a20; line-height: 1.35;">
                ${replacedSubject}
              </h1>

              <div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line; margin-bottom: 20px;">
                ${replacedBody}
              </div>

              <!-- PENDING PASS DETAILS SUMMARY BOX -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #b45309; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #92400e; letter-spacing: 0.5px; margin-bottom: 6px;">
                      📋 RESERVATION SUMMARY (STATUS: PENDING CONFIRMATION)
                    </div>
                    <div style="font-size: 13px; color: #78350f; line-height: 1.6;">
                      • <strong>Pass Category:</strong> Elite VIP Guest (All 10-in-1 Privileges Included)<br/>
                      • <strong>Amount Due:</strong> ₦25,000 ($25)<br/>
                      • <strong>Venue:</strong> Shehu Musa Yar'Adua Centre, Central Business District, Abuja<br/>
                      • <strong>Dates:</strong> October 29–31, 2026
                    </div>
                  </td>
                </tr>
              </table>

              <!-- VIP BENEFIT SHOWCASE -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #012a20; letter-spacing: 0.5px; margin-bottom: 8px;">
                      👑 Key Privilege on Hold: ${replacedFocus}
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${vipBenefitListHtml}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- DELEGATE PORTAL ACTION BUTTON -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 22px 0;">
                <tr>
                  <td align="center">
                    <a href="https://reconexpo.afrinetgroup.com/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); background-color: #d97706; color: #022019; text-decoration: none; font-size: 15px; font-weight: 800; padding: 15px 32px; border-radius: 10px; border: 1px solid #f59e0b; box-shadow: 0 4px 14px rgba(245,158,11,0.35); text-align: center; letter-spacing: 0.5px; text-transform: uppercase;">
                      Open Delegate Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- SECRETARIAT SUPPORT HELP DESK -->
              ${replacedBankInfo ? `
              <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-top: 16px; font-size: 12px; color: #475569; text-align: center; line-height: 1.5;">
                📞 <strong>Secretariat Support Desk:</strong><br/>
                ${replacedBankInfo}
              </div>
              ` : ''}

              <!-- AUTO-STOP POLICY ASSURANCE NOTICE -->
              <div style="background-color: #f0fdf4; border: 1px dashed #86efac; border-radius: 6px; padding: 10px 14px; text-align: center; margin-top: 16px;">
                <span style="font-size: 11px; color: #166534; font-weight: 600;">
                  🛡️ <strong>Automated Stop Guarantee:</strong> As soon as payment is confirmed by our admin secretariat or completed via card, all reminder follow-ups immediately stop.
                </span>
              </div>
            </td>
          </tr>

          <!-- COMPLIANT FOOTER -->
          <tr>
            <td style="background-color: #011b15; color: #cbd5e1; padding: 24px; font-size: 12px; line-height: 1.6; text-align: center; border-top: 3px solid #d4af37;">
              <div style="font-weight: 800; font-size: 13px; color: #f8fafc; margin-bottom: 6px;">
                ${replaceTags(orgName)}
              </div>
              <div style="color: #94a3b8; margin-bottom: 8px;">
                📍 ${replaceTags(venue)}
              </div>
              <div style="color: #94a3b8; margin-bottom: 12px;">
                📞 ${replaceTags(hotlines)} &nbsp;|&nbsp; ✉️ <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a>
              </div>
              <div style="margin-bottom: 12px;">
                <a href="${website}" target="_blank" style="color: #a3e635; font-weight: bold; text-decoration: none;">Visit Secretariat Portal (${website})</a>
              </div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #1e293b; padding-top: 12px; margin-top: 12px;">
                ${replaceTags(disclaimer)}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function renderUnconfirmedVipRecoveryStepToPlainText(
  step: {
    id: string;
    title: string;
    badge: string;
    subject: string;
    vipBenefitFocus: string;
    vipBenefitsList: string[];
    bodyContent: string;
    paymentButtonText: string;
    paymentButtonUrl: string;
    alternateBankTransferText?: string;
  },
  tags: Record<string, string> = {},
  config?: Partial<SmtpConfig>
): string {
  const brandName = config?.headerTitle || 'RECON EXPO ABUJA';
  const orgName = config?.footerOrganization || 'RECON Expo 2026 Secretariat & Organizing Committee';
  const venue = config?.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, CBD, Abuja, Nigeria";
  const hotlines = config?.footerHotlines || '+234 803 234 5678 | +234 802 987 6543';
  const email = config?.footerOfficialEmail || 'reconexpo@afrinetgroup.com';
  const website = config?.footerWebsite || 'https://www.afrinetgroup.com';

  const mergedTags: Record<string, string> = {
    name: 'Distinguished VIP Guest',
    email: 'delegate@example.com',
    ticket: 'RECON-2026-VIP-PENDING',
    amount_due: '₦25,000 ($25)',
    ...tags
  };

  const replaceTags = (str: string = ''): string => {
    let res = str;
    for (const [key, val] of Object.entries(mergedTags)) {
      res = res.replace(new RegExp(`{${key}}`, 'gi'), val);
    }
    return res;
  };

  const lines: string[] = [
    `=== ${brandName} ===`,
    `[${replaceTags(step.badge)} • ELITE VIP PAYMENT CONFIRMATION REMINDER]`,
    `-----------------------------------------------------`,
    `${replaceTags(step.subject)}\n`,
    `${replaceTags(step.bodyContent)}\n`,
    `--- RESERVED VIP PRIVILEGES ---`,
    `Focus: ${replaceTags(step.vipBenefitFocus)}`
  ];

  for (const benefit of step.vipBenefitsList || []) {
    lines.push(`• ${replaceTags(benefit)}`);
  }

  lines.push(`\n>> ${replaceTags(step.paymentButtonText)}: ${replaceTags(step.paymentButtonUrl)} <<\n`);
  if (step.alternateBankTransferText) {
    lines.push(`Bank Transfer: ${replaceTags(step.alternateBankTransferText)}\n`);
  }
  lines.push(`* Note: As soon as payment is confirmed by our admin secretariat, this follow-up immediately stops.`);
  lines.push(`-----------------------------------------------------`);
  lines.push(`Secretariat: ${orgName}`);
  lines.push(`Venue: ${venue}`);
  lines.push(`Hotlines: ${hotlines} | Email: ${email}`);

  return lines.join('\n');
}
