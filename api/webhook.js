import Stripe from 'stripe';
import { Resend } from 'resend';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const redis = Redis.fromEnv();
const QR_SECRET = process.env.QR_SIGNING_SECRET || 'ft-default-secret-change-me';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function generateTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'FT-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function signTicket(ticketId) {
  return crypto.createHmac('sha256', QR_SECRET).update(ticketId).digest('hex').substring(0, 16);
}

function buildTicketEmail(ticket, qrDataUrl) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#030303;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#030303;padding:40px 20px;"><tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1a1a1a;max-width:500px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#0f0f0f 0%,#030303 100%);padding:40px 30px;text-align:center;border-bottom:2px solid #6a42b0;">
<h1 style="margin:0;font-family:Georgia,'Playfair Display',serif;font-size:28px;color:#fff;font-weight:400;letter-spacing:2px;">FLORENCE <span style="color:#6a42b0;">TONIGHT</span></h1>
<p style="margin:8px 0 0;font-size:11px;color:#9e9e9e;letter-spacing:4px;text-transform:uppercase;">Event Ticket</p>
</td></tr>
<tr><td style="padding:36px 30px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#9e9e9e;letter-spacing:3px;text-transform:uppercase;">Event</p>
<p style="margin:4px 0 0;font-size:20px;color:#fff;font-weight:700;letter-spacing:1px;">${ticket.eventName}</p>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#9e9e9e;letter-spacing:3px;text-transform:uppercase;">Guest Name</p>
<p style="margin:4px 0 0;font-size:16px;color:#fff;font-weight:500;">${ticket.customerName}</p>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#9e9e9e;letter-spacing:3px;text-transform:uppercase;">Quantity</p>
<p style="margin:4px 0 0;font-size:16px;color:#fff;font-weight:500;">${ticket.quantity} ticket(s)</p>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#9e9e9e;letter-spacing:3px;text-transform:uppercase;">Ticket ID</p>
<p style="margin:4px 0 0;font-size:16px;color:#6a42b0;font-weight:600;letter-spacing:2px;">${ticket.ticketId}</p>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#9e9e9e;letter-spacing:3px;text-transform:uppercase;">Amount Paid</p>
<p style="margin:4px 0 0;font-size:16px;color:#c6a87c;font-weight:600;">&euro;${ticket.amountPaid}</p>
</td></tr>
</table></td></tr>
<tr><td style="padding:10px 30px 36px;text-align:center;">
<div style="background:#fff;display:inline-block;padding:16px;border-radius:8px;">
<img src="${qrDataUrl}" alt="Ticket QR Code" width="200" height="200" style="display:block;">
</div>
<p style="margin:16px 0 0;font-size:12px;color:#6a42b0;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Show this QR code at the door</p>
<p style="margin:6px 0 0;font-size:11px;color:#9e9e9e;">Save this email or screenshot the QR code</p>
</td></tr>
<tr><td style="padding:24px 30px;background:#030303;text-align:center;border-top:1px solid #1a1a1a;">
<p style="margin:0;font-size:10px;color:#444;letter-spacing:1px;text-transform:uppercase;">&copy; 2026 Florence Tonight &middot; All rights reserved</p>
<p style="margin:6px 0 0;font-size:10px;color:#444;">This ticket is non-transferable and non-refundable.</p>
</td></tr></table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let event;
  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata;

    console.log('=== PAYMENT RECEIVED ===');
    console.log(`Customer: ${meta.customerName} | Email: ${meta.customerEmail}`);
    console.log(`Event: ${meta.eventName} | Qty: ${meta.quantity}`);

    try {
      const ticketId = generateTicketId();
      const signature = signTicket(ticketId);

      const ticketData = {
        ticketId,
        customerName: meta.customerName,
        customerEmail: meta.customerEmail,
        eventName: meta.eventName,
        quantity: parseInt(meta.quantity) || 1,
        amountPaid: session.amount_total / 100,
        currency: session.currency,
        stripeSessionId: session.id,
        purchasedAt: new Date().toISOString(),
        status: 'valid',
        checkedInAt: null,
      };

      await redis.set(`ticket:${ticketId}`, JSON.stringify(ticketData));
      await redis.sadd(`event:${meta.eventName}`, ticketId);

      const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
      const validationUrl = `${siteUrl}/api/validate?id=${ticketId}&sig=${signature}`;
      const qrDataUrl = await QRCode.toDataURL(validationUrl, {
        width: 400, margin: 2, errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      });

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Florence Tonight <tickets@yoursite.com>',
        to: [meta.customerEmail],
        subject: `🎫 Your Ticket for ${meta.eventName} — Florence Tonight`,
        html: buildTicketEmail(ticketData, qrDataUrl),
      });

      console.log(`Ticket ${ticketId} created and emailed to ${meta.customerEmail}`);
    } catch (error) {
      console.error('Error processing ticket:', error);
    }
  }

  return res.status(200).json({ received: true });
}
