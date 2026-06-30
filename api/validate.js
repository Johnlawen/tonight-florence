import crypto from 'crypto';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const QR_SECRET = process.env.QR_SIGNING_SECRET || 'ft-default-secret-change-me';

function verifySignature(ticketId, providedSig) {
  const expected = crypto.createHmac('sha256', QR_SECRET).update(ticketId).digest('hex').substring(0, 16);
  return expected === providedSig;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ticketId = req.query.id || (req.body && req.body.id);
  const signature = req.query.sig || (req.body && req.body.sig);
  const action = req.method === 'POST' ? 'checkin' : 'check';

  if (!ticketId || !signature) {
    return res.status(400).json({ valid: false, status: 'error', message: 'Missing ticket ID or signature' });
  }

  if (!verifySignature(ticketId, signature)) {
    return res.status(403).json({ valid: false, status: 'invalid', message: 'Invalid QR code — this ticket may be fake.' });
  }

  try {
    const raw = await redis.get(`ticket:${ticketId}`);
    if (!raw) return res.status(404).json({ valid: false, status: 'not_found', message: 'Ticket not found.' });

    const ticket = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (ticket.status === 'used') {
      return res.status(200).json({
        valid: false, status: 'already_used', message: 'This ticket has already been scanned.',
        ticket: { ticketId: ticket.ticketId, customerName: ticket.customerName, eventName: ticket.eventName, checkedInAt: ticket.checkedInAt, quantity: ticket.quantity }
      });
    }

    if (ticket.status === 'cancelled') {
      return res.status(200).json({ valid: false, status: 'cancelled', message: 'This ticket has been cancelled.' });
    }

    if (action === 'checkin') {
      ticket.status = 'used';
      ticket.checkedInAt = new Date().toISOString();
      await redis.set(`ticket:${ticketId}`, JSON.stringify(ticket));
    }

    return res.status(200).json({
      valid: true,
      status: action === 'checkin' ? 'checked_in' : 'valid',
      message: action === 'checkin' ? 'Ticket valid — guest checked in!' : 'Ticket is valid.',
      ticket: {
        ticketId: ticket.ticketId, customerName: ticket.customerName, customerEmail: ticket.customerEmail,
        eventName: ticket.eventName, quantity: ticket.quantity, amountPaid: ticket.amountPaid,
        purchasedAt: ticket.purchasedAt, checkedInAt: ticket.checkedInAt
      }
    });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ valid: false, status: 'error', message: 'Server error.' });
  }
}
