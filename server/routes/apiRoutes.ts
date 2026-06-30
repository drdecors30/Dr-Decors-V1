import express from 'express';
import { authAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

// Import Controllers
import * as adminController from '../controllers/adminController';
import * as productController from '../controllers/productController';
import * as categoryController from '../controllers/categoryController';
import * as enquiryController from '../controllers/enquiryController';
import * as purchaseRequestController from '../controllers/purchaseRequestController';
import * as newsletterController from '../controllers/newsletterController';

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Catalog Browsing
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);

// Public Enquiries & Subscriptions
router.post('/contact', enquiryController.createEnquiry);
router.post('/purchase', purchaseRequestController.createPurchaseRequest);
router.post('/newsletter', newsletterController.subscribeNewsletter);

// Settings
router.get('/settings', adminController.getSettings);

// Admin Authentication
router.post('/admin/login', adminController.loginAdmin);


// ==========================================
// SECURED ADMIN ROUTES (Requires Bearer Token)
// ==========================================

// Admin Actions & Profile
router.post('/admin/change-password', authAdmin, adminController.updatePassword);
router.get('/admin/stats', authAdmin, adminController.getDashboardStats);
router.put('/admin/settings', authAdmin, adminController.updateSetting);

// Admin Product Management
router.post('/products', authAdmin, upload.single('image'), productController.createProduct);
router.put('/products/:id', authAdmin, upload.single('image'), productController.updateProduct);
router.delete('/products/:id', authAdmin, productController.deleteProduct);

// Admin Category Management
router.post('/categories', authAdmin, upload.single('image'), categoryController.createCategory);
router.put('/categories/:id', authAdmin, upload.single('image'), categoryController.updateCategory);
router.delete('/categories/:id', authAdmin, categoryController.deleteCategory);

// Admin Enquiries Management
router.get('/admin/enquiries', authAdmin, enquiryController.getEnquiries);
router.put('/admin/enquiries/:id', authAdmin, enquiryController.updateEnquiryStatus);
router.delete('/admin/enquiries/:id', authAdmin, enquiryController.deleteEnquiry);

// Admin Purchase Requests Management
router.get('/admin/purchase-requests', authAdmin, purchaseRequestController.getPurchaseRequests);
router.put('/admin/purchase-requests/:id', authAdmin, purchaseRequestController.updatePurchaseRequestStatus);
router.delete('/admin/purchase-requests/:id', authAdmin, purchaseRequestController.deletePurchaseRequest);

// Admin Newsletter Subscribers Management
router.get('/admin/subscribers', authAdmin, newsletterController.getNewsletterSubscribers);
router.delete('/admin/subscribers/:id', authAdmin, newsletterController.unsubscribeNewsletter);

export default router;
