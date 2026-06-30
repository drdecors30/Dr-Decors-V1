import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService';

export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Please enter both username and password.' });
      return;
    }

    const admin = await dbService.getAdminByUsername(username);
    if (!admin) {
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
      return;
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'dr_decors_default_secret_jwt_key_9876';
    const token = jwt.sign(
      { username: admin.username, role: admin.role || 'admin' },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role || 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminReq = req as any;
    const username = adminReq.admin?.username;

    if (!username) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, error: 'Please specify both current and new passwords.' });
      return;
    }

    const admin = await dbService.getAdminByUsername(username);
    if (!admin) {
      res.status(404).json({ success: false, error: 'Admin account not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, error: 'Incorrect current password.' });
      return;
    }

    await dbService.updateAdminPassword(username, newPassword);

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await dbService.getDashboardStats();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await dbService.getSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      res.status(400).json({ success: false, error: 'Key and value are required.' });
      return;
    }

    await dbService.updateSetting(key, value);
    res.status(200).json({ success: true, message: `Setting '${key}' updated successfully.` });
  } catch (error) {
    next(error);
  }
};
