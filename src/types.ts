export interface ISpec {
  key: string;
  value: string;
}

export interface IProduct {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  stockStatus: 'In Stock' | 'Out of Stock';
  rating: number;
  specs: ISpec[];
  featured: boolean;
  createdAt?: string;
}

export interface ICategory {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface IContactMessage {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: string;
}

export interface IPurchaseRequest {
  _id?: string;
  id?: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt?: string;
}

export interface INewsletterSubscriber {
  _id?: string;
  id?: string;
  email: string;
  createdAt?: string;
}

export interface ICompanyDetails {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  mapLink: string;
  facebook?: string;
  instagram?: string;
  pinterest?: string;
}

export interface IFAQ {
  q: string;
  a: string;
}

export interface IHeroSlide {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface ISettings {
  contact_details: ICompanyDetails;
  faqs: IFAQ[];
  hero_slides: IHeroSlide[];
}
