import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, price, customerName, customerEmail, qty } = req.body || {};

    if (!eventName || !price || !customerName || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quantity = parseInt(qty) || 1;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: eventName + ' — Florence Tonight',
              description: 'Event ticket for ' + eventName,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      metadata: {
        customerName: customerName,
        customerEmail: customerEmail,
        eventName: eventName,
        quantity: String(quantity),
      },
      success_url: (req.headers.origin || process.env.SITE_URL) + '/events.html?payment=success',
      cancel_url: (req.headers.origin || process.env.SITE_URL) + '/events.html?payment=cancelled',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
