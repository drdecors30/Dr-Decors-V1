import { Mail, Phone, Clock, MapPin, Facebook, Instagram, Pin as Pinterest } from 'lucide-react';
import { ICompanyDetails } from '../types';

interface FooterProps {
  contactDetails: ICompanyDetails | null;
  setActivePage: (page: string) => void;
}

export default function Footer({ contactDetails, setActivePage }: FooterProps) {
  const defaultContact: ICompanyDetails = {
    companyName: 'Dr. Decors',
    email: 'info@drdecors.com',
    phone: '+1 (555) 732-6789',
    address: '742 Design Boulevard, Suite 300, New York, NY 10003',
    businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM (EST)',
    mapLink: '',
    facebook: 'https://facebook.com/drdecors',
    instagram: 'https://instagram.com/drdecors',
    pinterest: 'https://pinterest.com/drdecors'
  };

  const contact = contactDetails || defaultContact;

  return (
    <footer id="app-footer" className="bg-natural-card text-natural-text-main border-t border-natural-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('home')}>
              <div className="w-8 h-8 bg-natural-accent rounded-full"></div>
              <span className="font-serif text-2xl font-bold tracking-tight text-natural-text-dark">
                Dr. Decors
              </span>
            </div>
            <p className="text-sm text-natural-text-muted leading-relaxed font-normal">
              Healing spaces with premium furniture, organic decorative crafts, tailored wall coverings, and luxury styling doctor diagnostics since 2018.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a href={contact.facebook || '#'} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-natural-bg hover:bg-natural-accent hover:text-white rounded-full text-natural-text-main border border-natural-border transition-colors">
                <Facebook size={16} />
              </a>
              <a href={contact.instagram || '#'} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-natural-bg hover:bg-natural-accent hover:text-white rounded-full text-natural-text-main border border-natural-border transition-colors">
                <Instagram size={16} />
              </a>
              <a href={contact.pinterest || '#'} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-natural-bg hover:bg-natural-accent hover:text-white rounded-full text-natural-text-main border border-natural-border transition-colors">
                <Pinterest size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-xs font-bold text-natural-text-dark tracking-widest uppercase mb-6 font-serif">Quick Links</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-natural-accent transition-colors font-medium">Home Directory</button>
              </li>
              <li>
                <button onClick={() => setActivePage('products')} className="hover:text-natural-accent transition-colors font-medium">Luxury Products</button>
              </li>
              <li>
                <button onClick={() => setActivePage('categories')} className="hover:text-natural-accent transition-colors font-medium">Browse Categories</button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-natural-accent transition-colors font-medium">Styling Doctors Story</button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-natural-accent transition-colors font-medium">Book Consultation</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Coordinates */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-natural-text-dark tracking-widest uppercase mb-6 font-serif">Contact Us</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="text-natural-accent mt-0.5 shrink-0" />
                <span className="font-normal text-natural-text-muted leading-relaxed">{contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-natural-accent shrink-0" />
                <span className="font-normal text-natural-text-muted">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-natural-accent shrink-0" />
                <span className="font-normal text-natural-text-muted">{contact.email}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Operational Hours */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-natural-text-dark tracking-widest uppercase mb-6 font-serif">Showroom Hours</h3>
            <div className="flex items-start gap-3 text-sm">
              <Clock size={16} className="text-natural-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-normal text-natural-text-muted">{contact.businessHours}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 bg-natural-accent/10 text-natural-accent text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Doctor consult is active
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-natural-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-natural-text-muted gap-4">
          <p>© {new Date().getFullYear()} Dr. Decors. All luxury designs reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setActivePage('admin-login')} className="hover:text-natural-accent transition-colors">Admin Portal</button>
            <a href="#" className="hover:text-natural-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-natural-accent transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
