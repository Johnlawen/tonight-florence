import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEventEmail(event, type) {
  const isComingSoon = type === 'coming_soon';
  const headerLabel = isComingSoon ? 'COMING SOON' : 'NEW EVENT';
  const ctaText = isComingSoon ? 'VIEW UPCOMING EVENTS' : 'GET TICKETS NOW';
  const siteUrl = process.env.SITE_URL || 'https://florencetonight.com';
  const linkUrl = isComingSoon ? `${siteUrl}/events.html` : `${siteUrl}/events.html`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#030303;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;padding:40px 20px;"><tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1a1a1a;max-width:500px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#0f0f0f 0%,#030303 100%);padding:40px 30px;text-align:center;border-bottom:2px solid #6a42b0;">
<h1 style="margin:0;font-family:Georgia,'Playfair Display',serif;font-size:28px;color:#fff;font-weight:400;letter-spacing:2px;">FLORENCE <span style="color:#6a42b0;">TONIGHT</span></h1>
<p style="margin:8px 0 0;font-size:11px;color:#c6a87c;letter-spacing:4px;text-transform:uppercase;">${headerLabel}</p>
</td></tr>
<tr><td style="padding:36px 30px; text-align:center;">
<img src="${event.image}" onerror="this.style.display='none'" style="width:100%; max-width:400px; height:auto; border-radius:4px; margin-bottom:24px; border:1px solid #1a1a1a;">
<p style="margin:0;font-size:11px;color:#6a42b0;letter-spacing:3px;text-transform:uppercase;font-weight:600;">${event.tag || 'UPDATE'}</p>
<h2 style="color:#fff; font-size:24px; font-weight:500; margin-top:8px; margin-bottom:12px;">${event.title}</h2>
<p style="color:#9e9e9e; font-size:15px; line-height:1.6; margin-top:0;">${event.subtitle}</p>

${event.date || event.days ? `
<div style="margin-top:24px; padding-top:24px; border-top:1px solid #1a1a1a;">
  <p style="margin:0;font-size:13px;color:#c6a87c;font-weight:600;">WHEN</p>
  <p style="margin:4px 0 0;font-size:15px;color:#fff;">${event.date || event.days}</p>
</div>
` : ''}

${event.location ? `
<div style="margin-top:16px;">
  <p style="margin:0;font-size:13px;color:#c6a87c;font-weight:600;">WHERE</p>
  <p style="margin:4px 0 0;font-size:15px;color:#fff;">${event.location}</p>
</div>
` : ''}

<div style="margin-top:36px;">
  <a href="${linkUrl}" style="background:#6a42b0; color:#fff; text-decoration:none; padding:12px 24px; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600; border-radius:2px; display:inline-block;">${ctaText}</a>
</div>

</td></tr>
<tr><td style="padding:24px 30px;background:#030303;text-align:center;border-top:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#444;letter-spacing:1px;text-transform:uppercase;">&copy; 2026 Florence Tonight &middot; All rights reserved</p>
<p style="margin:6px 0 0;font-size:10px;color:#444;">You are receiving this because you subscribed to our list.</p>
</td></tr></table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { emails, event, type } = req.body;
  if (!emails || !emails.length || !event) {
    return res.status(400).json({ error: 'Missing emails or event data' });
  }

  try {
    const htmlContent = buildEventEmail(event, type);
    const subjectLine = type === 'coming_soon' 
      ? `Coming Soon: ${event.title} 🌙`
      : `New Event: ${event.title} 🎟️`;

    // Resend supports sending up to 50 emails in a single array (they are sent as separate emails via Bcc-like functionality or batch)
    // To be safe and protect privacy, we use Resend's 'bcc' field, or send individually.
    // The cleanest way for a newsletter is to use bcc so recipients don't see each other.
    
    // We chunk emails into groups of 50 (Resend limits)
    const chunkSize = 50;
    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Florence Tonight <hello@yoursite.com>',
        to: ['hello@yoursite.com'], // Primary recipient (can be a dummy or the admin)
        bcc: chunk,
        subject: subjectLine,
        html: htmlContent,
      });
    }

    return res.status(200).json({ success: true, sentTo: emails.length });
  } catch (error) {
    console.error('Error sending event notifications:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
