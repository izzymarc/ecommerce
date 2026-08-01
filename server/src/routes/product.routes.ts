import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { authenticate, authorize } from '../middleware/auth';

export const productRoutes = Router();

productRoutes.get('/', async (_req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, page = '1', limit = '20' } = _req.query;
  const filter: any = { isActive: true };
  if (category) filter.category = category;
  if (minPrice || maxPrice) { filter.price = {}; if (minPrice) filter.price.$gte = Number(minPrice); if (maxPrice) filter.price.$lte = Number(maxPrice); }
  if (search) filter.$text = { $search: search as string };
  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([Product.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'), Product.countDocuments(filter)]);
  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

productRoutes.get('/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
  res.json(product);
});

productRoutes.post('/', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

productRoutes.put('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
  res.json(product);
});

productRoutes.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Product deactivated' });
});