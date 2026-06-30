import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';
import { ICategory } from '../types';

interface CategoriesProps {
  categories: ICategory[];
  onFilterCategory: (slug: string) => void;
}

export default function CategoriesView({ categories, onFilterCategory }: CategoriesProps) {
  return (
    <div id="categories-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-natural-accent text-xs font-bold uppercase tracking-widest">Our Specialties</span>
        <h1 className="font-serif text-3xl md:text-4.5xl font-extrabold text-natural-text-dark tracking-tight">Browse Design Departments</h1>
        <div className="w-12 h-0.5 bg-natural-accent mx-auto" />
        <p className="text-sm text-natural-text-muted font-normal leading-relaxed">
          Each department is fully staffed with design blueprints, material recipes, and customized diagnostic accents. Select a department to explore products.
        </p>
      </div>

      {/* Grid List of Category Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {categories.map((cat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            key={cat.slug || i}
            className="group flex flex-col bg-white border border-natural-border rounded-3xl overflow-hidden shadow-none hover:shadow-md transition-all duration-300"
          >
            {/* Category Image */}
            <div className="relative h-56 overflow-hidden bg-natural-bg">
              <div className="absolute inset-0 bg-natural-text-dark/20 group-hover:bg-natural-text-dark/10 transition-colors z-10" />
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-4 left-4 z-20 bg-natural-text-dark/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-natural-card-warm font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                <Compass size={11} /> Dept. 0{i + 1}
              </span>
            </div>

            {/* Category Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-natural-text-dark group-hover:text-natural-accent transition-colors">
                  {cat.name} Collection
                </h3>
                <p className="text-xs text-natural-text-muted font-normal leading-relaxed">
                  {cat.description || 'Premium design accents, handpicked furnishings, and customized layout diagnostics curated to elevate home spaces.'}
                </p>
              </div>

              <div className="pt-4 border-t border-natural-border/60">
                <button
                  onClick={() => onFilterCategory(cat.slug)}
                  className="group flex items-center gap-1.5 text-xs font-bold text-natural-accent hover:text-natural-accent-hover transition-colors"
                >
                  Explore Specialty Catalog
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
