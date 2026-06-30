import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/dbService';

export const getPurchaseRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requests = await dbService.getPurchaseRequests();
    res.status(200).json({ success: true, purchaseRequests: requests });
  } catch (error) {
    next(error);
  }
};

export const createPurchaseRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, productTitle, customerName, customerEmail, customerPhone, customerAddress, message } = req.body;

    if (!productId || !productTitle || !customerName || !customerEmail || !customerPhone || !customerAddress) {
      res.status(400).json({ success: false, error: 'Product details and all contact fields are required.' });
      return;
    }

    const requestData = {
      productId,
      productTitle,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      message,
    };

    const newRequest = await dbService.createPurchaseRequest(requestData);
    res.status(201).json({ success: true, message: 'Your purchase request has been submitted successfully! We will contact you shortly.', purchaseRequest: newRequest });
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending' | 'contacted' | 'completed'

    if (!status || !['pending', 'contacted', 'completed'].includes(status)) {
      res.status(400).json({ success: false, error: 'Valid status ("pending", "contacted", "completed") is required.' });
      return;
    }

    const updated = await dbService.updatePurchaseRequestStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Purchase request not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Purchase request status updated.', purchaseRequest: updated });
  } catch (error) {
    next(error);
  }
};

export const deletePurchaseRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deletePurchaseRequest(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Purchase request not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Purchase request deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
