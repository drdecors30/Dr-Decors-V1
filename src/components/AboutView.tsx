import { motion } from 'motion/react';
import { ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

interface AboutProps {
  setActivePage: (page: string) => void;
}

export default function AboutView({ setActivePage }: AboutProps) {
  return (
    <div id="about-view" className="space-y-16 pb-16">
      
      {/* 1. HERO STORY BLOCK */}
      <section className="relative h-96 bg-natural-text-dark overflow-hidden flex items-center">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-natural-text-dark/80 to-natural-text-dark/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&auto=format&fit=crop&q=80"
          alt="Dr. Decors luxury showroom"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full text-white space-y-4">
          <span className="inline-block py-1.5 px-3.5 bg-natural-card text-natural-accent text-[10px] uppercase font-bold tracking-[0.2em] rounded-sm">
            Our Story & Blueprint
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight max-w-xl text-white leading-[1.15]">
            Healing Dull Spaces Since 2018
          </h1>
          <p className="text-natural-border text-sm md:text-md font-light max-w-lg leading-relaxed">
            At Dr. Decors, we treat interior design as an art of clinical wellness. We diagnose room shapes, assess daylight shadows, and prescribe customized furnishings.
          </p>
        </div>
      </section>

      {/* 2. CORE MOTIVE CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-natural-accent text-xs font-bold uppercase tracking-widest block">The Aesthetic Apothecary</span>
            <h2 className="font-serif text-3xl font-extrabold text-natural-text-dark tracking-tight leading-tight">
              Design is Medicine for the Soul
            </h2>
            <div className="w-12 h-0.5 bg-natural-accent" />
            <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
              Dr. Decors was founded by a team of architect-builders who felt traditional home retail was sterile and disorganized. Customers had to wade through endless catalogs without understanding how textures react to sunlight, or how rugs influence walking acoustics.
            </p>
            <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
              We developed the **Diagnostic Design Method**. Every product we stock is examined for material purity, acoustic damping, and tactile stress-relief. When you buy from Dr. Decors, you are purchasing a calculated, cohesive prescription for spatial harmony.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => setActivePage('contact')}
                className="group flex items-center gap-1.5 bg-natural-accent hover:bg-natural-accent-hover text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-md hover:shadow-lg"
              >
                Schedule Consultation <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Collage Images on Right */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-[24px] overflow-hidden shadow-none h-64">
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=80"
                alt="Finishing process"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-[24px] overflow-hidden shadow-none h-64 mt-6">
              <img
                src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80"
                alt="Clay molding"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. BRAND VALUES ACCENTS */}
      <section className="bg-natural-input py-16 border-y border-natural-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-natural-accent text-xs font-bold uppercase tracking-widest">Operational Integrity</span>
            <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold text-natural-text-dark tracking-tight">Our Quality Guarantee</h2>
            <div className="w-12 h-0.5 bg-natural-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="bg-white p-8 rounded-[24px] shadow-none border border-natural-border space-y-4">
              <span className="inline-block p-3.5 bg-natural-accent/10 text-natural-accent rounded-full">
                <ShieldCheck size={24} />
              </span>
              <h3 className="font-serif text-lg font-bold text-natural-text-dark">100% Lead-Free Glazes</h3>
              <p className="text-xs text-natural-text-muted font-normal leading-relaxed">
                All decor crafts, flower pots, and ceramic table vases undergo thermal kiln firing at 1200°C and are sealed completely using food-safe organic compounds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[24px] shadow-none border border-natural-border space-y-4">
              <span className="inline-block p-3.5 bg-natural-accent/10 text-natural-accent rounded-full">
                <Award size={24} className="fill-natural-accent/10 text-natural-accent" />
              </span>
              <h3 className="font-serif text-lg font-bold text-natural-text-dark">Traceable Wool Sourcing</h3>
              <p className="text-xs text-natural-text-muted font-normal leading-relaxed">
                Rugs are hand-tufted using 100% natural wool sourced from cruelty-free heritage farms in New Zealand. Soft under foot, safe for toddlers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[24px] shadow-none border border-natural-border space-y-4">
              <span className="inline-block p-3.5 bg-natural-accent/10 text-natural-accent rounded-full">
                <Heart size={24} className="fill-natural-accent/10 text-natural-accent" />
              </span>
              <h3 className="font-serif text-lg font-bold text-natural-text-dark">Bespoke Scaled Sizing</h3>
              <p className="text-xs text-natural-text-muted font-normal leading-relaxed">
                Need a sofa built to fit exactly in a recessed nook? Our manufacturing team builds bespoke scales, altering lengths down to the centimeter.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
