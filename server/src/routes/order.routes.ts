import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Order } from '../models/Order';

export const orderRoutes = Router();

orderRoutes.get('/', authenticate, async (req: Request, res: Response) => {
  const filter = req.user?.role === 'admin' ? {} : { user: req.user?.userId };
  const orders = await Order.find(filter).sort('-createdAt').populate('user', 'name email');
  res.json(orders);
});

orderRoutes.get('/:id', authenticate, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404).json({ message: 'Order not found' }); return; }
  res.json(order);
});

orderRoutes.put('/:id/status', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) { res.status(404).json({ message: 'Order not found' }); return; }
  res.json(order);
});