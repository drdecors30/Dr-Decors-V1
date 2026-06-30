import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Heart, Check, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { IProduct } from '../types';

interface ProductDetailsProps {
  product: IProduct;
  allProducts: IProduct[];
  onSelectProduct: (product: IProduct) => void;
  setActivePage: (page: string) => void;
}

export default function ProductDetailsView({
  product,
  allProducts,
  onSelectProduct,
  setActivePage,
}: ProductDetailsProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  
  // Inquiry form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [message, setMessage] = useState(`Hi Dr. Decors, I am highly interested in purchasing the "${product.title}" ($${product.price}). Please contact me with availability and payment options.`);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Sourcing related items (same category, excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && (p.id !== product.id && p._id !== product._id))
    .slice(0, 3);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      setError('Please fill in all contact and address fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id || product._id,
          productTitle: product.title,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          message,
        }),
      });
      const data = await res.json();

      if (data.success) {
  const whatsappNumber = "919876543210"; // Replace with your WhatsApp number (country code, no +)

  const whatsappMessage = `
 *New Purchase Request*

 Product: ${product.title}
 Price: ₹${product.price}

 Customer: ${customerName}
 Email: ${customerEmail}
 Phone: ${customerPhone}

 Address:
${customerAddress}

 Notes:
${message || "None"}

 Product ID: ${product.id || product._id}
`;

  window.open(
    `https://wa.me/${9620532473}?text=${encodeURIComponent(
      whatsappMessage
    )}`,
    "_blank"
  );

  setSuccess(true);

  setCustomerName("");
  setCustomerEmail("");
  setCustomerPhone("");
  setCustomerAddress("");
  setMessage("");
} else {
        setError(data.error || 'Failed to submit purchase request.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="product-details-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Back Button Link */}
      <button
        onClick={() => setActivePage('products')}
        className="flex items-center gap-1.5 text-xs font-bold uppercase text-natural-text-muted hover:text-natural-accent tracking-widest transition-colors"
      >
        <ArrowLeft size={15} /> Back to Apothecary
      </button>

      {/* PRIMARY PRODUCT LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: IMAGE VIEWER */}
        <div className="relative group rounded-3xl overflow-hidden bg-natural-bg border border-natural-border aspect-square shadow-none">
          {/* Stock Tag */}
          <span className={`absolute top-4 left-4 z-10 text-xs font-bold uppercase px-3.5 py-1.5 rounded-full shadow-xs ${
            product.stockStatus === 'In Stock' ? 'bg-[#5A5A40] text-white' : 'bg-[#8a7b5a] text-white'
          }`}>
            {product.stockStatus}
          </span>

          {/* Zoomable Image container */}
          <div className="w-full h-full overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: DATA SPECIFICATIONS */}
        <div className="space-y-6 lg:py-2">
          
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold text-natural-accent tracking-widest">{product.category} SPECIALTY</span>
            <h1 className="font-serif text-3xl font-extrabold text-natural-text-dark tracking-tight leading-tight">
              {product.title}
            </h1>
            
            {/* Rating Stars row */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex text-natural-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating || 4.5) ? 'fill-natural-accent text-natural-accent' : 'text-natural-border'}
                  />
                ))}
              </div>
              <span className="text-xs text-natural-text-muted font-bold">({product.rating || 4.5} out of 5 stars)</span>
            </div>
          </div>

          <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Box */}
          <div className="bg-[#fcfcf9] border border-natural-border p-5 rounded-2xl flex items-baseline gap-3">
            <span className="text-2xl font-bold text-natural-text-dark">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-natural-text-muted line-through font-light">${product.originalPrice}</span>
            )}
            <span className="text-[10px] uppercase font-bold text-[#5A5A40] tracking-widest bg-[#e9e9e0] px-3 py-1 rounded-full ml-auto">
              Diagnostic Cleared
            </span>
          </div>

          {/* Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold text-natural-text-dark tracking-wider">Product Specifications</h3>
              <div className="border border-natural-border rounded-2xl overflow-hidden text-xs">
                <table className="w-full divide-y divide-natural-border text-left">
                  <tbody className="divide-y divide-natural-border bg-white">
                    {product.specs.map((spec, sIdx) => (
                      <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-[#fcfcf9]' : 'bg-white'}>
                        <td className="px-4 py-3 font-semibold font-serif text-natural-text-dark w-1/3 border-r border-natural-border">{spec.key}</td>
                        <td className="px-4 py-3 font-normal text-natural-text-muted">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action CTA Box */}
          <div className="pt-4 flex gap-4">
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="flex-grow bg-natural-accent hover:bg-natural-accent-hover text-white text-center py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 active:scale-98"
            >
              Request to Purchase
            </button>
            <button
              className="p-3.5 border border-natural-border hover:border-natural-accent hover:text-natural-accent rounded-full text-natural-text-muted transition-colors bg-white"
              title="Add to Wishlist"
            >
              <Heart size={18} />
            </button>
          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS DRAWER */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-natural-border pt-12 space-y-8">
          <div className="space-y-1.5">
            <span className="text-natural-accent text-[11px] font-bold uppercase tracking-widest">Aesthetic Diagnosis</span>
            <h2 className="font-serif text-2xl font-extrabold text-natural-text-dark tracking-tight">Department Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p, i) => (
              <div
                key={p.id || p._id || i}
                onClick={() => {
                  onSelectProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer space-y-3 bg-white border border-natural-border p-4 rounded-[24px] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-natural-bg relative">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-natural-text-muted tracking-wider">{p.category}</span>
                  <h3 className="font-serif text-sm font-bold text-natural-text-dark line-clamp-1 group-hover:text-natural-accent transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="text-xs font-bold text-natural-text-dark">${p.price}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-natural-text-muted line-through font-light">${p.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PURCHASE INQUIRY DIALOG MODAL */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsInquiryModalOpen(false);
                setSuccess(false);
              }}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-[24px] shadow-2xl max-w-lg w-full overflow-hidden border border-natural-border z-10"
            >
              
              {/* Modal Header */}
              <div className="bg-natural-accent text-white p-5 flex justify-between items-center border-b border-natural-border">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-natural-card-warm" />
                  <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">Design Prescription Desk</h3>
                </div>
                <button
                  onClick={() => {
                    setIsInquiryModalOpen(false);
                    setSuccess(false);
                  }}
                  className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!success ? (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleInquirySubmit}
                      className="space-y-4 text-xs"
                    >
                      {/* Product Summary mini card */}
                      <div className="flex gap-4 p-3 bg-[#fcfcf9] border border-natural-border rounded-2xl items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-xl bg-natural-bg border border-natural-border"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-natural-text-dark text-sm">{product.title}</h4>
                          <p className="font-bold text-natural-accent mt-0.5">${product.price}</p>
                        </div>
                      </div>

                      {/* Customer Info Input fields */}
                      <div className="space-y-1">
                        <label className="font-bold text-natural-text-dark">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          disabled={loading}
                          placeholder="Johnathan Doe"
                          className="w-full border border-natural-border px-4.5 py-2.5 rounded-full text-xs bg-natural-input/30 focus:outline-none focus:ring-1 focus:ring-natural-accent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-natural-text-dark">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            disabled={loading}
                            placeholder="john@example.com"
                            className="w-full border border-natural-border px-4.5 py-2.5 rounded-full text-xs bg-natural-input/30 focus:outline-none focus:ring-1 focus:ring-natural-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-natural-text-dark">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            disabled={loading}
                            placeholder="+1 (555) 000-0000"
                            className="w-full border border-natural-border px-4.5 py-2.5 rounded-full text-xs bg-natural-input/30 focus:outline-none focus:ring-1 focus:ring-natural-accent"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-natural-text-dark">Delivery/Shipping Address *</label>
                        <input
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          disabled={loading}
                          placeholder="123 Luxury Street, Apt 4B, New York NY"
                          className="w-full border border-natural-border px-4.5 py-2.5 rounded-full text-xs bg-natural-input/30 focus:outline-none focus:ring-1 focus:ring-natural-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-natural-text-dark">Special Notes or Requests (Color/Scale)</label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          disabled={loading}
                          className="w-full border border-natural-border px-4.5 py-2.5 rounded-[16px] text-xs bg-natural-input/30 focus:outline-none focus:ring-1 focus:ring-natural-accent resize-none"
                        />
                      </div>

                      {error && (
                        <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                          <ShieldAlert size={14} />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-natural-accent hover:bg-natural-accent-hover text-white py-3.5 rounded-full font-bold uppercase tracking-widest transition-all mt-2 shadow-md"
                      >
                        {loading ? 'Submitting Purchase Request...' : 'Confirm Request'}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-10 text-center space-y-4 flex flex-col items-center"
                    >
                      <span className="p-4 bg-natural-accent/10 text-natural-accent rounded-full inline-block">
                        <CheckCircle2 size={40} className="fill-natural-accent/10" />
                      </span>
                      <h4 className="font-serif text-lg font-bold text-natural-text-dark">Inquiry Logged Successfully!</h4>
                      <p className="text-xs text-natural-text-muted font-normal max-w-sm leading-relaxed">
                        Your purchase request for **{product.title}** is safely synced with our MongoDB collections. A Dr. Decors specialist will reach out via **{customerEmail}** or **{customerPhone}** to arrange invoicing and delivery details.
                      </p>
                      <button
                        onClick={() => {
                          setIsInquiryModalOpen(false);
                          setSuccess(false);
                        }}
                        className="bg-natural-accent hover:bg-natural-accent-hover text-white text-xs font-bold uppercase px-6 py-3 rounded-full transition-all mt-4 shadow-md"
                      >
                        Close Portal
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
