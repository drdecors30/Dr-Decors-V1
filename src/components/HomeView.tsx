import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Heart, CheckCircle2 } from 'lucide-react';
import { IProduct, ICategory, IHeroSlide } from '../types';

interface HomeProps {
  products: IProduct[];
  categories: ICategory[];
  heroSlides: IHeroSlide[] | null;
  onSelectProduct: (product: IProduct) => void;
  onFilterCategory: (slug: string) => void;
  setActivePage: (page: string) => void;
}

export default function HomeView({
  products,
  categories,
  heroSlides,
  onSelectProduct,
  onFilterCategory,
  setActivePage,
}: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const defaultSlides: IHeroSlide[] = [
    {
      title: 'Prescribe Luxury Style to Your Home',
      subtitle: 'Heal your dull spaces with handcrafted furniture, designer lighting, and tailored wallpapers.',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&auto=format&fit=crop&q=80',
      ctaText: 'Explore Collection',
      ctaLink: 'products'
    },
    {
      title: 'Sculpted Lighting Masterpieces',
      subtitle: 'Stunning hand-polished lighting globes, solid marble desk lamps, and organic brass ceiling chandeliers.',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1600&auto=format&fit=crop&q=80',
      ctaText: 'View Lighting',
      ctaLink: 'lighting'
    }
  ];

  const slides = heroSlides || defaultSlides;

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeError('Please specify a valid email address.');
      return;
    }

    setLoadingSubscribe(true);
    setSubscribeError('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        setSubscribeError(data.error || 'Failed to subscribe.');
      }
    } catch {
      setSubscribeError('Network error. Please try again.');
    } finally {
      setLoadingSubscribe(false);
    }
  };

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div id="home-view" className="space-y-16 pb-16">
      
      {/* 1. HERO CAROUSEL */}
      <section className="relative h-[500px] md:h-[620px] bg-natural-text-dark overflow-hidden">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => {
            if (index !== currentSlide) return null;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {/* Overlay background filter */}
                <div className="absolute inset-0 bg-gradient-to-r from-natural-text-dark/80 to-natural-text-dark/30 z-10" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Content Box */}
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl text-white space-y-6">
                      <motion.span
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block py-1.5 px-3.5 bg-natural-card text-natural-accent text-[10px] uppercase font-bold tracking-[0.2em] rounded-sm"
                      >
                        Premium Interior Reimagined
                      </motion.span>
                      
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] text-white"
                      >
                        {slide.title}
                      </motion.h1>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-natural-border text-sm md:text-lg leading-relaxed font-light"
                      >
                        {slide.subtitle}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="pt-4"
                      >
                        <button
                          onClick={() => {
                            if (slide.ctaLink.includes('lighting') || slide.ctaLink.includes('furniture')) {
                              onFilterCategory(slide.ctaLink);
                            } else {
                              setActivePage('products');
                            }
                          }}
                          className="group flex items-center gap-2 bg-natural-accent hover:bg-natural-accent-hover text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide"
                        >
                          {slide.ctaText}
                          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full z-30 backdrop-blur-sm transition-all"
          title="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full z-30 backdrop-blur-sm transition-all"
          title="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? 'w-6 bg-natural-accent' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-natural-accent text-xs font-bold uppercase tracking-widest">Curated Collections</span>
          <h2 className="font-serif text-3xl font-extrabold text-natural-text-dark tracking-tight">Shop by Styling Category</h2>
          <div className="w-12 h-0.5 bg-natural-accent mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={cat.slug || i}
              onClick={() => onFilterCategory(cat.slug)}
              className="group relative h-48 md:h-64 rounded-[24px] overflow-hidden shadow-none cursor-pointer bg-natural-card"
            >
              <div className="absolute inset-0 bg-natural-text-dark/40 group-hover:bg-natural-text-dark/20 transition-colors duration-300 z-10" />
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 z-20 text-white flex flex-col justify-end">
                <span className="text-xs uppercase tracking-widest text-natural-card-warm font-bold">Diagnose</span>
                <h3 className="font-serif text-lg md:text-xl font-medium tracking-tight">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-natural-accent text-xs font-bold uppercase tracking-widest">The Apothecary Picks</span>
            <h2 className="font-serif text-3xl font-extrabold text-natural-text-dark tracking-tight">Luxury Healing Accents</h2>
            <div className="w-12 h-0.5 bg-natural-accent" />
          </div>
          <button
            onClick={() => setActivePage('products')}
            className="flex items-center gap-1.5 text-sm font-bold text-natural-accent hover:text-natural-accent-hover transition-colors hover:translate-x-1"
          >
            Browse Full Catalog <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((p, i) => (
            <motion.div
              key={p.id || p._id || i}
              whileHover={{ y: -4 }}
              className="group flex flex-col bg-white border border-natural-border rounded-[24px] overflow-hidden shadow-none hover:shadow-md transition-all duration-300"
            >
              {/* Product Image */}
              <div
                className="relative aspect-square overflow-hidden cursor-pointer bg-[#f5f5f0]"
                onClick={() => onSelectProduct(p)}
              >
                {/* Stock Badge */}
                <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                  p.stockStatus === 'In Stock' ? 'bg-[#5A5A40]/90 text-white' : 'bg-[#8a7b5a]/90 text-white'
                }`}>
                  {p.stockStatus}
                </span>

                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rating Overlay */}
                <div className="absolute bottom-3 left-3 bg-natural-text-dark/85 backdrop-blur-sm px-2.5 py-1 rounded-full text-white flex items-center gap-1 text-[11px]">
                  <Star size={11} className="fill-natural-accent text-natural-accent" />
                  <span>{p.rating || 4.5}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-natural-text-muted tracking-[0.15em] block mb-1">
                    {p.category}
                  </span>
                  <h3
                    className="font-serif text-base font-bold text-natural-text-dark hover:text-natural-accent cursor-pointer line-clamp-1 transition-colors"
                    onClick={() => onSelectProduct(p)}
                  >
                    {p.title}
                  </h3>
                  <p className="text-xs text-natural-text-muted font-normal mt-1.5 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 mt-4 border-t border-natural-border/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-md font-bold text-natural-text-dark">${p.price}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-natural-text-muted line-through">${p.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="text-xs font-semibold uppercase tracking-wider text-natural-accent hover:text-white bg-natural-input hover:bg-natural-accent px-4 py-2 rounded-full transition-all"
                  >
                    View Specs
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. BRAND PILLARS / PROMO BANNER */}
      <section className="bg-natural-input py-16 border-y border-natural-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            
            <div className="space-y-4">
              <span className="inline-block p-3.5 bg-natural-accent/10 text-natural-accent rounded-full">
                <Star size={24} className="fill-natural-accent text-natural-accent" />
              </span>
              <h3 className="font-serif text-xl font-bold text-natural-text-dark">1. Architectural Diagnostics</h3>
              <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
                We diagnose uninspiring corners and formulate precise spatial recipes, prescribing furniture shapes and color tones customized for light orientation.
              </p>
            </div>

            <div className="space-y-4">
              <span className="inline-block p-3.5 bg-natural-accent/10 text-natural-accent rounded-full">
                <CheckCircle2 size={24} className="text-natural-accent" />
              </span>
              <h3 className="font-serif text-xl font-bold text-natural-text-dark">2. Hypoallergenic Crafts</h3>
              <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
                Our ceramic vases are hand-thrown using premium clay and sealed with organic, lead-free glazes. Elegant, safe, and built to capture light.
              </p>
            </div>

            <div className="space-y-4">
              <span className="inline-block p-3.5 bg-natural-accent/10 text-natural-accent rounded-full">
                <Heart size={24} className="fill-natural-accent text-natural-accent" />
              </span>
              <h3 className="font-serif text-xl font-bold text-natural-text-dark">3. Complimentary Consults</h3>
              <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
                Enjoy a 45-minute virtual video consult with Dr. Decors. We assist with choosing rug scales, matching textiles, or wallpaper calculations completely free.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-[32px] bg-natural-accent text-white p-8 md:p-14 overflow-hidden shadow-none"
        >
          {/* Background Vector Highlights */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-natural-card-warm text-xs font-bold uppercase tracking-widest block">Bespoke Design Letter</span>
              <h3 className="font-serif text-2xl md:text-3.5xl font-extrabold tracking-tight">Subscribe to Our Aesthetic Prescriptions</h3>
              <p className="text-sm text-white/80 font-normal leading-relaxed">
                Get monthly interior trend analysis, limited handcrafted release alerts, and design secrets sent directly by Dr. Decors.
              </p>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loadingSubscribe}
                      className="flex-grow bg-white/10 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white px-5 py-3 rounded-full text-sm text-white placeholder-white/50"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loadingSubscribe}
                      className="bg-white hover:bg-natural-card-warm text-natural-accent font-bold px-8 py-3 rounded-full text-sm transition-all shrink-0 flex justify-center items-center gap-1.5 shadow-sm"
                    >
                      {loadingSubscribe ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center flex flex-col items-center gap-2"
                  >
                    <CheckCircle2 size={36} className="text-white fill-white/10" />
                    <h4 className="text-md font-bold text-natural-card-warm">Subscription Completed!</h4>
                    <p className="text-xs text-white/80 font-light">
                      Welcome to Dr. Decors. We have successfully recorded your email!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {subscribeError && (
                <p className="text-rose-200 text-xs mt-2 font-medium">{subscribeError}</p>
              )}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
