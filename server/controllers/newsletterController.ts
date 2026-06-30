import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/dbService';

export const getNewsletterSubscribers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const list = await dbService.getNewsletterSubscribers();
    res.status(200).json({ success: true, subscribers: list });
  } catch (error) {
    next(error);
  }
};

export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'A valid email address is required.' });
      return;
    }

    const subscriber = await dbService.createNewsletterSubscriber(email);
    res.status(201).json({ success: true, message: 'Thank you for subscribing to our luxury design letter!', subscriber });
  } catch (error) {
    next(error);
  }
};

export const unsubscribeNewsletter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteNewsletterSubscriber(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Subscriber not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Unsubscribed successfully.' });
  } catch (error) {
    next(error);
  }
};
