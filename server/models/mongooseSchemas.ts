import mongoose, { Schema, Document } from 'mongoose';

// 1. User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

// 2. Admin Schema (Separate as specified by user)
export interface IAdmin extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

// 3. Category Schema
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Specification interface for products
interface ISpec {
  key: string;
  value: string;
}

// 4. Product Schema
export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // matches Category slug
  imageUrl: string;
  stockStatus: 'In Stock' | 'Out of Stock';
  rating: number;
  specs: ISpec[];
  featured: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  stockStatus: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
  rating: { type: Number, default: 4.5 },
  specs: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Text index for search optimization
ProductSchema.index({ title: 'text', description: 'text' });

// 5. Order Schema
export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  items: { type: Array, default: [] },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// 6. Contact Message (Enquiry) Schema
export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  createdAt: { type: Date, default: Date.now },
});

// 7. Newsletter Subscriber Schema
export interface INewsletterSubscriber extends Document {
  email: string;
  createdAt: Date;
}

const NewsletterSubscriberSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

// 8. Purchase Request Schema
export interface IPurchaseRequest extends Document {
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: Date;
}

const PurchaseRequestSchema: Schema = new Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, index: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// 9. Settings Schema
export interface ISetting extends Document {
  key: string;
  value: any;
  createdAt: Date;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});


// Export models with clean Type Casting to Model<T> to prevent typescript union inference issues with mongoose.models
export const UserModel = (mongoose.models.User || mongoose.model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;
export const AdminModel = (mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)) as mongoose.Model<IAdmin>;
export const CategoryModel = (mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)) as mongoose.Model<ICategory>;
export const ProductModel = (mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)) as mongoose.Model<IProduct>;
export const OrderModel = (mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)) as mongoose.Model<IOrder>;
export const ContactMessageModel = (mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema)) as mongoose.Model<IContactMessage>;
export const NewsletterSubscriberModel = (mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema)) as mongoose.Model<INewsletterSubscriber>;
export const PurchaseRequestModel = (mongoose.models.PurchaseRequest || mongoose.model<IPurchaseRequest>('PurchaseRequest', PurchaseRequestSchema)) as mongoose.Model<IPurchaseRequest>;
export const SettingModel = (mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)) as mongoose.Model<ISetting>;
