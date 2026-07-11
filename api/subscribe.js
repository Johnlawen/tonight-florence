import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

function buildWelcomeEmail() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#030303;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;padding:40px 20px;"><tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1a1a1a;max-width:500px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#0f0f0f 0%,#030303 100%);padding:40px 30px;text-align:center;border-bottom:2px solid #c6a87c;">
<h1 style="margin:0;font-family:Georgia,'Playfair Display',serif;font-size:28px;color:#fff;font-weight:400;letter-spacing:2px;">FLORENCE <span style="color:#6a42b0;">TONIGHT</span></h1>
<p style="margin:8px 0 0;font-size:11px;color:#9e9e9e;letter-spacing:4px;text-transform:uppercase;">Welcome to the list</p>
</td></tr>
<tr><td style="padding:36px 30px; text-align:center;">
<h2 style="color:#fff; font-size:22px; font-weight:500; margin-top:0;">You're in.</h2>
<p style="color:#9e9e9e; font-size:14px; line-height:1.6; margin-top:16px;">
Thanks for subscribing to Florence Tonight. You'll now be the first to know about new hidden gems, exclusive aperitivo spots, and the best events happening in the city after dark.
</p>
<p style="color:#c6a87c; font-size:14px; font-weight:600; margin-top:24px;">Don't miss a night.</p>
</td></tr>
<tr><td style="padding:24px 30px;background:#030303;text-align:center;border-top:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#444;letter-spacing:1px;text-transform:uppercase;">&copy; 2026 Florence Tonight &middot; All rights reserved</p>
</td></tr></table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Florence Tonight <hello@yoursite.com>',
      to: [email],
      subject: `Welcome to Florence Tonight 🥂`,
      html: buildWelcomeEmail(),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
