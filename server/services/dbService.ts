import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getDBMode } from '../config/db';
import {
  AdminModel,
  CategoryModel,
  ProductModel,
  ContactMessageModel,
  NewsletterSubscriberModel,
  PurchaseRequestModel,
  SettingModel
} from '../models/mongooseSchemas';

// Paths for local storage fallback
const DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_PATH = path.join(DATA_DIR, 'local_db.json');

// Interface for local database structure
interface ILocalDB {
  admins: any[];
  categories: any[];
  products: any[];
  contactMessages: any[];
  newsletterSubscribers: any[];
  purchaseRequests: any[];
  settings: any[];
}

// Ensure local DB file exists with proper structure and seed data
function ensureLocalDB(): ILocalDB {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const salt = bcrypt.genSaltSync(10);
  const defaultAdminHash = bcrypt.hashSync('admin123', salt);

  const initialCategories = [
    { id: 'cat_1', name: 'Furniture', slug: 'furniture', description: 'Premium designer sofas, chairs, tables, and consoles', imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=80' },
    { id: 'cat_2', name: 'Lighting', slug: 'lighting', description: 'Nordic and modern pendant lights, table lamps, and chandeliers', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80' },
    { id: 'cat_3', name: 'Wall Decor', slug: 'wall-decor', description: 'Designer wallpapers, mirrors, paintings, and panels', imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80' },
    { id: 'cat_4', name: 'Decorative Crafts', slug: 'crafts', description: 'Handcrafted ceramic vases, sculptures, and tabletop accents', imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80' },
    { id: 'cat_5', name: 'Rugs & Carpets', slug: 'rugs', description: 'Elegant hand-tufted wool carpets and area rugs', imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80' }
  ];

  const initialProducts = [
    {
      id: 'prod_1',
      title: 'Nordic Velvet Accent Chair',
      description: 'An elegant accent chair wrapped in ultra-soft velvet fabric with metal legs in brass finish. Features high-density foam cushioning for maximum comfort and style in any contemporary living room.',
      price: 349,
      originalPrice: 429,
      category: 'furniture',
      imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80',
      stockStatus: 'In Stock',
      rating: 4.8,
      specs: [
        { key: 'Material', value: 'Velvet, Brass, Steel' },
        { key: 'Dimensions', value: '32" H x 28" W x 30" D' },
        { key: 'Color', value: 'Emerald Green / Mustard Yellow' },
        { key: 'Assembly Required', value: 'No' }
      ],
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_2',
      title: 'Minimalist Pendant Dome Light',
      description: 'A striking aluminum dome pendant light with a matte outer coating and warm metallic gold inner lining. Emits a beautifully focused warm glow, perfect for kitchen islands, dining tables, or study spaces.',
      price: 189,
      originalPrice: 249,
      category: 'lighting',
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80',
      stockStatus: 'In Stock',
      rating: 4.6,
      specs: [
        { key: 'Fixture Material', value: 'Aluminum, Brass' },
        { key: 'Light Source', value: 'E27 (LED Compatible)' },
        { key: 'Cord Length', value: '1.5m (Adjustable)' },
        { key: 'Power', value: 'Max 60W' }
      ],
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_3',
      title: 'Handcrafted Organic Ceramic Vases',
      description: 'A curated trio of organic, asymmetrical ceramic vases with textured sand finishes. These decorative sculptures look striking both holding dried pampas grass or standing alone as minimalist shelf statements.',
      price: 79,
      originalPrice: 110,
      category: 'crafts',
      imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80',
      stockStatus: 'In Stock',
      rating: 4.7,
      specs: [
        { key: 'Material', value: 'Glazed Earth Clay' },
        { key: 'Pack Quantity', value: 'Set of 3 (Small, Medium, Large)' },
        { key: 'Finishing', value: 'Matte Sand Texture' },
        { key: 'Waterproof', value: 'Yes' }
      ],
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_4',
      title: 'Luxury Gold Framed Arch Mirror',
      description: 'Introduce depth and premium charm to your foyer or bedroom with this exquisite arch floor mirror. Enclosed in an elegant thin aluminum frame polished in brushed champagne gold finish.',
      price: 299,
      originalPrice: 380,
      category: 'wall-decor',
      imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
      stockStatus: 'In Stock',
      rating: 4.9,
      specs: [
        { key: 'Frame Material', value: 'Polished Arch Aluminum' },
        { key: 'Dimensions', value: '65" H x 22" W x 1.2" D' },
        { key: 'Weight', value: '14.5 lbs' },
        { key: 'Mounting Type', value: 'Leaning or Wall Mounted' }
      ],
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_5',
      title: 'Hand-Tufted Geometric Wool Rug',
      description: 'Woven with dense New Zealand wool, this geometric area rug provides luxurious comfort and soft stepping. Showcases a modern cream and charcoal abstract line pattern that integrates seamlessly into any mid-century modern aesthetic.',
      price: 449,
      originalPrice: 599,
      category: 'rugs',
      imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80',
      stockStatus: 'In Stock',
      rating: 4.5,
      specs: [
        { key: 'Composition', value: '80% Wool, 20% Organic Cotton backing' },
        { key: 'Dimensions', value: '5ft x 8ft' },
        { key: 'Thickness', value: '0.6 inches' },
        { key: 'Origin', value: 'Handmade in India' }
      ],
      featured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod_6',
      title: 'Mid-Century Brass Table Lamp',
      description: 'A classic mid-century retro silhouette table lamp boasting a circular marble base and adjustable gold brass shade dome. A timeless addition to any luxury reading desk or bedside table.',
      price: 139,
      originalPrice: 179,
      category: 'lighting',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
      stockStatus: 'In Stock',
      rating: 4.7,
      specs: [
        { key: 'Base Material', value: 'Premium White Carrara Marble' },
        { key: 'Stem & Shade', value: 'Brushed Brass Metal' },
        { key: 'Dimensions', value: '21" Height x 11" Shade Diameter' },
        { key: 'Switch Type', value: 'In-line Rotary' }
      ],
      featured: false,
      createdAt: new Date().toISOString()
    }
  ];

  const initialSettings = [
    {
      key: 'contact_details',
      value: {
        companyName: 'Dr. Decors',
        email: 'info@drdecors.com',
        phone: '+1 (555) 732-6789',
        address: '742 Design Boulevard, Suite 300, New York, NY 10003',
        businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM (EST)',
        mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6175390947746!2d-73.98822608459392!3d40.74844047932824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1652193264903!5m2!1sen!2sus',
        facebook: 'https://facebook.com/drdecors',
        instagram: 'https://instagram.com/drdecors',
        pinterest: 'https://pinterest.com/drdecors'
      }
    },
    {
      key: 'faqs',
      value: [
        { q: 'Can I request customization for the furniture designs?', a: 'Yes! We specialize in custom fabric upholstery, custom dimensions, and finish variations. Please submit an enquiry or call our design assistants directly.' },
        { q: 'How long does shipping take for order items?', a: 'Standard items in stock ship within 3-5 business days and deliver in 7-10 days. Customized furniture and wallpaper prints take 4-6 weeks to build, inspect, and ship.' },
        { q: 'Do you offer virtual interior design consultations?', a: 'Absolutely! Our design doctors offer a 45-minute virtual video walkthrough to assist with room styling, spatial planning, and material selections.' },
        { q: 'What is your return policy for delicate decor items?', a: 'We accept returns on all standard unused items within 14 days of delivery. Custom-made orders or bespoke wallpaper measurements cannot be returned unless damaged during shipping.' }
      ]
    },
    {
      key: 'hero_slides',
      value: [
        {
          title: 'Prescribe Style to Your Space',
          subtitle: 'Welcome to Dr. Decors. We heal dull rooms with handcrafted furnishings, designer lighting, and tailored wallpapers.',
          image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&auto=format&fit=crop&q=80',
          ctaText: 'Explore Collection',
          ctaLink: '/products'
        },
        {
          title: 'Sculpted Lighting Masterpieces',
          subtitle: 'A stunning collection of modern pendant globes, solid marble desk lamps, and warm light sculptures.',
          image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1600&auto=format&fit=crop&q=80',
          ctaText: 'Shop Lighting',
          ctaLink: '/products?category=lighting'
        }
      ]
    }
  ];

  const defaultDB: ILocalDB = {
    admins: [
      { id: 'admin_1', username: 'admin', email: 'admin@drdecors.com', passwordHash: defaultAdminHash, role: 'admin', createdAt: new Date().toISOString() }
    ],
    categories: initialCategories,
    products: initialProducts,
    contactMessages: [
      { id: 'msg_1', name: 'Sophia Loren', email: 'sophia@example.com', subject: 'Consultation Inquiry', message: 'Hi there, I am looking to style my penthouse living room. Do you offer on-site consultations in NY?', status: 'unread', createdAt: new Date().toISOString() }
    ],
    newsletterSubscribers: [
      { id: 'sub_1', email: 'welcome@drdecors.com', createdAt: new Date().toISOString() }
    ],
    purchaseRequests: [
      { id: 'req_1', productId: 'prod_1', productTitle: 'Nordic Velvet Accent Chair', customerName: 'Johnathan Doe', customerEmail: 'john@example.com', customerPhone: '+1 234 567 8900', customerAddress: '123 Park Avenue, New York NY', message: 'I would love to purchase 2 of these chairs in Emerald Green. Please let me know how to wire the payment.', status: 'pending', createdAt: new Date().toISOString() }
    ],
    settings: initialSettings
  };

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf-8');
    console.log('✅ Local JSON fallback Database seeded and created successfully.');
    return defaultDB;
  }

  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON database, recreating it.');
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf-8');
    return defaultDB;
  }
}

// Ensure database file is generated immediately on startup
const localDB = ensureLocalDB();

// Read current local database state
function getLocalDBState(): ILocalDB {
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return localDB;
  }
}

// Write new state to local file
function saveLocalDBState(state: ILocalDB) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save local DB state:', err);
  }
}

// MongoDB database initializer / seeder
export async function seedMongoDB(): Promise<void> {
  try {
    const local = getLocalDBState();

    // 1. Seed Admin
    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      console.log('🌱 Seeding Admins into MongoDB...');
      await AdminModel.insertMany(local.admins.map((a) => ({
        username: a.username,
        email: a.email,
        passwordHash: a.passwordHash,
        role: a.role,
        createdAt: new Date(a.createdAt)
      })));
    }

    // 2. Seed Categories
    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding Categories into MongoDB...');
      await CategoryModel.insertMany(local.categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl,
        createdAt: new Date()
      })));
    }

    // 3. Seed Products
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding Products into MongoDB...');
      await ProductModel.insertMany(local.products.map((p) => ({
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        imageUrl: p.imageUrl,
        stockStatus: p.stockStatus,
        rating: p.rating,
        specs: p.specs,
        featured: p.featured,
        createdAt: new Date()
      })));
    }

    // 4. Seed Settings
    const settingsCount = await SettingModel.countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 Seeding Settings into MongoDB...');
      await SettingModel.insertMany(local.settings.map((s) => ({
        key: s.key,
        value: s.value,
        createdAt: new Date()
      })));
    }

    // 5. Seed Contact Messages
    const enquiriesCount = await ContactMessageModel.countDocuments();
    if (enquiriesCount === 0 && local.contactMessages?.length > 0) {
      await ContactMessageModel.insertMany(local.contactMessages.map((m) => ({
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        status: m.status,
        createdAt: new Date(m.createdAt)
      })));
    }

    // 6. Seed Purchase Requests
    const purchaseCount = await PurchaseRequestModel.countDocuments();
    if (purchaseCount === 0 && local.purchaseRequests?.length > 0) {
      await PurchaseRequestModel.insertMany(local.purchaseRequests.map((r) => ({
        productId: r.productId,
        productTitle: r.productTitle,
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        customerPhone: r.customerPhone,
        customerAddress: r.customerAddress,
        message: r.message,
        status: r.status,
        createdAt: new Date(r.createdAt)
      })));
    }

    // 7. Seed Newsletter Subscribers
    const subscriberCount = await NewsletterSubscriberModel.countDocuments();
    if (subscriberCount === 0 && local.newsletterSubscribers?.length > 0) {
      await NewsletterSubscriberModel.insertMany(local.newsletterSubscribers.map((s) => ({
        email: s.email,
        createdAt: new Date(s.createdAt)
      })));
    }

    console.log('🌱 MongoDB Atlas seeding successfully verified.');
  } catch (error) {
    console.error('❌ Error during seeding MongoDB Atlas:', error);
  }
}

// UNIVERSAL DB SERVICE WRAPPER
// Dynamically performs either MongoDB queries or fallbacks to Local JSON file system
export const dbService = {
  // PRODUCTS OPERATIONS
  getProducts: async (filters: { category?: string; search?: string; featured?: boolean } = {}, options: { page?: number; limit?: number; sort?: string } = {}) => {
    const { isMockDB } = getDBMode();
    const page = options.page || 1;
    const limit = options.limit || 12;
    const skip = (page - 1) * limit;

    if (!isMockDB) {
      // 1. MongoDB Query
      const query: any = {};
      if (filters.category) query.category = filters.category;
      if (filters.featured !== undefined) query.featured = filters.featured;
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (options.sort === 'price-low') sortOption = { price: 1 };
      else if (options.sort === 'price-high') sortOption = { price: -1 };
      else if (options.sort === 'rating') sortOption = { rating: -1 };

      const products = await ProductModel.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

      const total = await ProductModel.countDocuments(query);

      return {
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } else {
      // 2. Local Fallback
      const state = getLocalDBState();
      let products = [...state.products];

      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.featured !== undefined) {
        products = products.filter(p => p.featured === filters.featured);
      }
      if (filters.search) {
        const keyword = filters.search.toLowerCase();
        products = products.filter(p =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword)
        );
      }

      if (options.sort === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (options.sort === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (options.sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else {
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = products.length;
      const paginatedProducts = products.slice(skip, skip + limit);

      return {
        products: paginatedProducts,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    }
  },

  getProductById: async (id: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await ProductModel.findById(id);
    } else {
      const state = getLocalDBState();
      return state.products.find(p => p.id === id || p._id === id) || null;
    }
  },

  createProduct: async (data: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      const product = new ProductModel(data);
      return await product.save();
    } else {
      const state = getLocalDBState();
      const newProduct = {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        id: 'prod_' + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      };
      state.products.push(newProduct);
      saveLocalDBState(state);
      return newProduct;
    }
  },

  updateProduct: async (id: string, data: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await ProductModel.findByIdAndUpdate(id, data, { new: true });
    } else {
      const state = getLocalDBState();
      const idx = state.products.findIndex(p => p.id === id || p._id === id);
      if (idx !== -1) {
        state.products[idx] = { ...state.products[idx], ...data };
        saveLocalDBState(state);
        return state.products[idx];
      }
      return null;
    }
  },

  deleteProduct: async (id: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await ProductModel.findByIdAndDelete(id);
    } else {
      const state = getLocalDBState();
      const initialLen = state.products.length;
      state.products = state.products.filter(p => p.id !== id && p._id !== id);
      saveLocalDBState(state);
      return state.products.length < initialLen;
    }
  },

  // CATEGORIES OPERATIONS
  getCategories: async () => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await CategoryModel.find().sort({ name: 1 });
    } else {
      const state = getLocalDBState();
      return [...state.categories].sort((a, b) => a.name.localeCompare(b.name));
    }
  },

  getCategoryBySlug: async (slug: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await CategoryModel.findOne({ slug });
    } else {
      const state = getLocalDBState();
      return state.categories.find(c => c.slug === slug) || null;
    }
  },

  createCategory: async (data: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      // Prevent duplicate
      const exists = await CategoryModel.findOne({ slug: data.slug });
      if (exists) throw new Error('Category with this slug already exists.');
      const category = new CategoryModel(data);
      return await category.save();
    } else {
      const state = getLocalDBState();
      const exists = state.categories.some(c => c.slug === data.slug);
      if (exists) throw new Error('Category with this slug already exists.');

      const newCategory = {
        _id: 'cat_' + Math.random().toString(36).substr(2, 9),
        id: 'cat_' + Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString()
      };
      state.categories.push(newCategory);
      saveLocalDBState(state);
      return newCategory;
    }
  },

  updateCategory: async (id: string, data: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    } else {
      const state = getLocalDBState();
      const idx = state.categories.findIndex(c => c.id === id || c._id === id);
      if (idx !== -1) {
        state.categories[idx] = { ...state.categories[idx], ...data };
        saveLocalDBState(state);
        return state.categories[idx];
      }
      return null;
    }
  },

  deleteCategory: async (id: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await CategoryModel.findByIdAndDelete(id);
    } else {
      const state = getLocalDBState();
      const initialLen = state.categories.length;
      state.categories = state.categories.filter(c => c.id !== id && c._id !== id);
      saveLocalDBState(state);
      return state.categories.length < initialLen;
    }
  },

  // ADMIN OPERATIONS
  getAdminByUsername: async (username: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await AdminModel.findOne({ username });
    } else {
      const state = getLocalDBState();
      return state.admins.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
    }
  },

  updateAdminPassword: async (username: string, newPasswordPlain: string) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPasswordPlain, salt);

    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await AdminModel.findOneAndUpdate({ username }, { passwordHash }, { new: true });
    } else {
      const state = getLocalDBState();
      const idx = state.admins.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
      if (idx !== -1) {
        state.admins[idx].passwordHash = passwordHash;
        saveLocalDBState(state);
        return state.admins[idx];
      }
      return null;
    }
  },

  // CONTACT ENQUIRIES OPERATIONS
  getContactMessages: async () => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await ContactMessageModel.find().sort({ createdAt: -1 });
    } else {
      const state = getLocalDBState();
      return [...state.contactMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  createContactMessage: async (data: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      const msg = new ContactMessageModel({ ...data, status: 'unread' });
      return await msg.save();
    } else {
      const state = getLocalDBState();
      const newMsg = {
        _id: 'msg_' + Math.random().toString(36).substr(2, 9),
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        ...data,
        status: 'unread',
        createdAt: new Date().toISOString()
      };
      state.contactMessages.push(newMsg);
      saveLocalDBState(state);
      return newMsg;
    }
  },

  updateContactMessageStatus: async (id: string, status: 'read' | 'replied') => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await ContactMessageModel.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const state = getLocalDBState();
      const idx = state.contactMessages.findIndex(m => m.id === id || m._id === id);
      if (idx !== -1) {
        state.contactMessages[idx].status = status;
        saveLocalDBState(state);
        return state.contactMessages[idx];
      }
      return null;
    }
  },

  deleteContactMessage: async (id: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await ContactMessageModel.findByIdAndDelete(id);
    } else {
      const state = getLocalDBState();
      const initialLen = state.contactMessages.length;
      state.contactMessages = state.contactMessages.filter(m => m.id !== id && m._id !== id);
      saveLocalDBState(state);
      return state.contactMessages.length < initialLen;
    }
  },

  // PURCHASE REQUESTS OPERATIONS
  getPurchaseRequests: async () => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await PurchaseRequestModel.find().sort({ createdAt: -1 });
    } else {
      const state = getLocalDBState();
      return [...state.purchaseRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  createPurchaseRequest: async (data: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      const req = new PurchaseRequestModel({ ...data, status: 'pending' });
      return await req.save();
    } else {
      const state = getLocalDBState();
      const newReq = {
        _id: 'req_' + Math.random().toString(36).substr(2, 9),
        id: 'req_' + Math.random().toString(36).substr(2, 9),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      state.purchaseRequests.push(newReq);
      saveLocalDBState(state);
      return newReq;
    }
  },

  updatePurchaseRequestStatus: async (id: string, status: 'pending' | 'contacted' | 'completed') => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await PurchaseRequestModel.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const state = getLocalDBState();
      const idx = state.purchaseRequests.findIndex(r => r.id === id || r._id === id);
      if (idx !== -1) {
        state.purchaseRequests[idx].status = status;
        saveLocalDBState(state);
        return state.purchaseRequests[idx];
      }
      return null;
    }
  },

  deletePurchaseRequest: async (id: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await PurchaseRequestModel.findByIdAndDelete(id);
    } else {
      const state = getLocalDBState();
      const initialLen = state.purchaseRequests.length;
      state.purchaseRequests = state.purchaseRequests.filter(r => r.id !== id && r._id !== id);
      saveLocalDBState(state);
      return state.purchaseRequests.length < initialLen;
    }
  },

  // NEWSLETTER SUBSCRIBERS
  getNewsletterSubscribers: async () => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await NewsletterSubscriberModel.find().sort({ createdAt: -1 });
    } else {
      const state = getLocalDBState();
      return [...state.newsletterSubscribers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  createNewsletterSubscriber: async (email: string) => {
    const { isMockDB } = getDBMode();
    const cleanEmail = email.trim().toLowerCase();

    if (!isMockDB) {
      // Prevent duplicate
      const exists = await NewsletterSubscriberModel.findOne({ email: cleanEmail });
      if (exists) return exists;
      const sub = new NewsletterSubscriberModel({ email: cleanEmail });
      return await sub.save();
    } else {
      const state = getLocalDBState();
      const exists = state.newsletterSubscribers.find(s => s.email.toLowerCase() === cleanEmail);
      if (exists) return exists;

      const newSub = {
        _id: 'sub_' + Math.random().toString(36).substr(2, 9),
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        email: cleanEmail,
        createdAt: new Date().toISOString()
      };
      state.newsletterSubscribers.push(newSub);
      saveLocalDBState(state);
      return newSub;
    }
  },

  deleteNewsletterSubscriber: async (id: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await NewsletterSubscriberModel.findByIdAndDelete(id);
    } else {
      const state = getLocalDBState();
      const initialLen = state.newsletterSubscribers.length;
      state.newsletterSubscribers = state.newsletterSubscribers.filter(s => s.id !== id && s._id !== id);
      saveLocalDBState(state);
      return state.newsletterSubscribers.length < initialLen;
    }
  },

  // SYSTEM SETTINGS OPERATIONS
  getSettings: async () => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      const settings = await SettingModel.find();
      const result: any = {};
      settings.forEach((s) => {
        result[s.key] = s.value;
      });
      return result;
    } else {
      const state = getLocalDBState();
      const result: any = {};
      state.settings.forEach((s) => {
        result[s.key] = s.value;
      });
      return result;
    }
  },

  getSettingByKey: async (key: string) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      const setting = await SettingModel.findOne({ key });
      return setting ? setting.value : null;
    } else {
      const state = getLocalDBState();
      const s = state.settings.find(x => x.key === key);
      return s ? s.value : null;
    }
  },

  updateSetting: async (key: string, value: any) => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      return await SettingModel.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    } else {
      const state = getLocalDBState();
      const idx = state.settings.findIndex(x => x.key === key);
      if (idx !== -1) {
        state.settings[idx].value = value;
      } else {
        state.settings.push({ key, value, createdAt: new Date().toISOString() });
      }
      saveLocalDBState(state);
      return { key, value };
    }
  },

  // DASHBOARD GENERAL STATS
  getDashboardStats: async () => {
    const { isMockDB } = getDBMode();
    if (!isMockDB) {
      const totalProducts = await ProductModel.countDocuments();
      const totalEnquiries = await ContactMessageModel.countDocuments();
      const pendingEnquiries = await ContactMessageModel.countDocuments({ status: 'unread' });
      const totalPurchaseRequests = await PurchaseRequestModel.countDocuments();
      const pendingPurchaseRequests = await PurchaseRequestModel.countDocuments({ status: 'pending' });
      const totalSubscribers = await NewsletterSubscriberModel.countDocuments();
      const totalCategories = await CategoryModel.countDocuments();

      return {
        products: totalProducts,
        enquiries: totalEnquiries,
        pendingEnquiries,
        purchaseRequests: totalPurchaseRequests,
        pendingPurchaseRequests,
        subscribers: totalSubscribers,
        categories: totalCategories
      };
    } else {
      const state = getLocalDBState();
      const totalProducts = state.products.length;
      const totalEnquiries = state.contactMessages.length;
      const pendingEnquiries = state.contactMessages.filter(m => m.status === 'unread').length;
      const totalPurchaseRequests = state.purchaseRequests.length;
      const pendingPurchaseRequests = state.purchaseRequests.filter(r => r.status === 'pending').length;
      const totalSubscribers = state.newsletterSubscribers.length;
      const totalCategories = state.categories.length;

      return {
        products: totalProducts,
        enquiries: totalEnquiries,
        pendingEnquiries,
        purchaseRequests: totalPurchaseRequests,
        pendingPurchaseRequests,
        subscribers: totalSubscribers,
        categories: totalCategories
      };
    }
  }
};
