import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';

export const authRoutes = Router();

authRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) { res.status(400).json({ message: 'Email already registered' }); return; }
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Registration failed' }); }
});

authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: 'Login failed' }); }
});

authRoutes.get('/me', authenticate, async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});