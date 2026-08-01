import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', { apiVersion: '2024-12-18.acacia' as any });

export const paymentRoutes = Router();

paymentRoutes.post('/create-intent', authenticate, async (req: Request, res: Response) => {
  const { items, shipping } = req.body;
  const totalAmount = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  if (totalAmount <= 0) { res.status(400).json({ message: 'Cart is empty' }); return; }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: 'usd',
    metadata: { userId: req.user!.userId },
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

paymentRoutes.post('/confirm', authenticate, async (req: Request, res: Response) => {
  const { paymentIntentId, items, shippingAddress } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== 'succeeded') { res.status(400).json({ message: 'Payment not confirmed' }); return; }
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }
  const totalAmount = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const order = await Order.create({
    user: req.user!.userId, items, totalAmount, shippingAddress,
    paymentStatus: 'paid', stripePaymentId: paymentIntentId, status: 'processing'
  });
  res.status(201).json(order);
});

paymentRoutes.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || ''); }
  catch { res.status(400).send('Webhook error'); return; }
  if (event.type === 'payment_intent.succeeded') {
    console.log('Payment succeeded:', event.data.object.id);
  }
  res.json({ received: true });
});