import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { ICompanyDetails, IFAQ } from '../types';

interface ContactProps {
  contactDetails: ICompanyDetails | null;
  faqsList: IFAQ[] | null;
}

export default function ContactView({ contactDetails, faqsList }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  const defaultContact: ICompanyDetails = {
    companyName: 'Dr. Decors',
    email: 'info@drdecors.com',
    phone: '+1 (555) 732-6789',
    address: '742 Design Boulevard, Suite 300, New York, NY 10003',
    businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM (EST)',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6175390947746!2d-73.98822608459392!3d40.74844047932824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1652193264903!5m2!1sen!2sus',
    facebook: 'https://facebook.com/drdecors',
    instagram: 'https://instagram.com/drdecors',
    pinterest: 'https://pinterest.com/drdecors'
  };

  const defaultFaqs: IFAQ[] = [
    { q: 'Can I request customization for the furniture designs?', a: 'Yes! We specialize in custom fabric upholstery, custom dimensions, and finish variations. Please submit an enquiry or call our design assistants.' },
    { q: 'How long does shipping take for order items?', a: 'Standard items in stock ship within 3-5 business days and deliver in 7-10 days. Customized orders take 4-6 weeks to manufacture.' },
    { q: 'Do you offer virtual interior design consultations?', a: 'Absolutely! Our design doctors offer a 45-minute virtual video walkthrough to assist with room styling, spatial planning, and material selections.' }
  ];

  const contact = contactDetails || defaultContact;
  const faqs = faqsList || defaultFaqs;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError(data.error || 'Failed to submit enquiry.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaqIdx(activeFaqIdx === idx ? null : idx);
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-natural-accent text-xs font-bold uppercase tracking-widest">Connect with Us</span>
        <h1 className="font-serif text-3xl md:text-4.5xl font-extrabold text-natural-text-dark tracking-tight">Book a Room Diagnosis</h1>
        <div className="w-12 h-0.5 bg-natural-accent mx-auto" />
        <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
          Need a prescription for a lifeless corner? Send us a message, dial our showroom desk, or expand the FAQs below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: CONTACT DETAILS & FAQ ACCORDION */}
        <div className="space-y-8">
          
          {/* Card: Showroom Coordinates */}
          <div className="bg-white border border-natural-border p-8 rounded-[24px] shadow-none space-y-6">
            <h3 className="font-serif text-xl font-bold text-natural-text-dark">Showroom Headquarters</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="text-natural-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-natural-text-dark font-serif">Visit Us</p>
                  <p className="text-natural-text-muted font-normal mt-0.5">{contact.address}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="text-natural-accent shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold text-natural-text-dark font-serif">Call Support</p>
                  <p className="text-natural-text-muted font-normal mt-0.5">{contact.phone}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="text-natural-accent shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold text-natural-text-dark font-serif">Email Enquiries</p>
                  <p className="text-natural-text-muted font-normal mt-0.5">{contact.email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="text-natural-accent shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-bold text-natural-text-dark font-serif">Showroom Hours</p>
                  <p className="text-natural-text-muted font-normal mt-0.5">{contact.businessHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-natural-text-dark px-1">Aesthetic FAQs</h3>
            
            <div className="border border-natural-border rounded-[24px] overflow-hidden bg-white divide-y divide-natural-border">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-natural-text-dark hover:text-natural-accent transition-colors text-sm"
                  >
                    <span>{faq.q}</span>
                    {activeFaqIdx === idx ? <Minus size={15} className="text-natural-accent" /> : <Plus size={15} className="text-natural-text-muted" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {activeFaqIdx === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-xs text-natural-text-muted leading-relaxed font-normal border-t border-natural-border/50 pt-2 bg-natural-input/10">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ENQUIRY FORM */}
        <div className="bg-white border border-natural-border p-8 rounded-[24px] shadow-none">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleContactSubmit}
                className="space-y-5"
              >
                <h3 className="font-serif text-xl font-bold text-natural-text-dark mb-6">Write to Dr. Decors</h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-natural-text-dark">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your name"
                    className="w-full border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-accent px-5 py-3 rounded-full text-sm bg-natural-input/30 placeholder-natural-text-muted/60"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-natural-text-dark">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      placeholder="Enter your email"
                      className="w-full border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-accent px-5 py-3 rounded-full text-sm bg-natural-input/30 placeholder-natural-text-muted/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-natural-text-dark">Subject (Optional)</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={loading}
                      placeholder="Topic of interest"
                      className="w-full border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-accent px-5 py-3 rounded-full text-sm bg-natural-input/30 placeholder-natural-text-muted/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-natural-text-dark">Your Diagnostic Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    placeholder="Describe your styling concerns, room measurements, or custom furniture requirements..."
                    className="w-full border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-accent px-5 py-3.5 rounded-[20px] text-sm bg-natural-input/30 placeholder-natural-text-muted/60 resize-none"
                  />
                </div>

                {error && <p className="text-rose-500 text-xs font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-natural-accent hover:bg-natural-accent-hover text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? 'Submitting Form...' : 'Submit Diagnostics'}
                </button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-4 flex flex-col items-center justify-center"
              >
                <span className="p-4 bg-natural-accent/10 text-natural-accent rounded-full inline-block">
                  <CheckCircle2 size={44} className="fill-natural-accent/10" />
                </span>
                <h3 className="font-serif text-xl font-bold text-natural-text-dark">Message Delivered Successfully!</h3>
                <p className="text-xs text-natural-text-muted font-normal max-w-xs leading-relaxed">
                  Thank you, your enquiry has been stored in our MongoDB cluster. One of our layout design assistants will inspect your request and contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-natural-input hover:bg-natural-accent hover:text-white text-natural-accent font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all border-none shadow-none"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Map Embed iframe Card */}
      {contact.mapLink && (
        <div className="bg-[#fcfcf9] rounded-[24px] overflow-hidden border border-natural-border h-96 shadow-none">
          <iframe
            src={contact.mapLink}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dr. Decors Google Map Showroom Location"
          />
        </div>
      )}

    </div>
  );
}
