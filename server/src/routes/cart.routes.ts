import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { Product } from '../models/Product';

export const cartRoutes = Router();

// In-memory cart (replace with Redis in production)
const carts = new Map<string, { product: string; name: string; quantity: number; price: number }[]>();

cartRoutes.get('/', authenticate, (req: Request, res: Response) => {
  res.json({ items: carts.get(req.user!.userId) || [] });
});

cartRoutes.post('/add', authenticate, async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) { res.status(400).json({ message: 'Insufficient stock' }); return; }
  const cart = carts.get(req.user!.userId) || [];
  const existing = cart.find(i => i.product === productId);
  if (existing) { existing.quantity += quantity; } else { cart.push({ product: productId, name: product.name, quantity, price: product.price }); }
  carts.set(req.user!.userId, cart);
  res.json({ items: cart });
});

cartRoutes.delete('/remove/:productId', authenticate, (req: Request, res: Response) => {
  const cart = carts.get(req.user!.userId) || [];
  carts.set(req.user!.userId, cart.filter(i => i.product !== req.params.productId));
  res.json({ items: carts.get(req.user!.userId) });
});

cartRoutes.delete('/', authenticate, (_req: Request, res: Response) => {
  carts.delete(_req.user!.userId);
  res.json({ items: [] });
});