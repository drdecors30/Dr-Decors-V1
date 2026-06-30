import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/dbService';

export const getEnquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await dbService.getContactMessages();
    res.status(200).json({ success: true, enquiries: messages });
  } catch (error) {
    next(error);
  }
};

export const createEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
      return;
    }

    const newEnquiry = await dbService.createContactMessage({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully. We will get back to you soon!', enquiry: newEnquiry });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'read' or 'replied'

    if (!status || !['read', 'replied'].includes(status)) {
      res.status(400).json({ success: false, error: 'Valid status ("read" or "replied") is required.' });
      return;
    }

    const updated = await dbService.updateContactMessageStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Enquiry message not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Enquiry status updated.', enquiry: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteContactMessage(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Enquiry message not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
