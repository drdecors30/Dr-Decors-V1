import { motion } from 'motion/react';
import { Star, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Ban } from 'lucide-react';
import { IProduct, ICategory } from '../types';

interface ProductsProps {
  products: IProduct[];
  categories: ICategory[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  onSelectProduct: (product: IProduct) => void;
}

export default function ProductsView({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  currentPage,
  setCurrentPage,
  totalPages,
  onSelectProduct,
}: ProductsProps) {
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div id="products-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header Banner */}
      <div className="bg-natural-card border border-natural-border rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold text-natural-accent tracking-widest">Apothecary Collection</span>
          <h1 className="font-serif text-3xl md:text-4.5xl font-extrabold text-natural-text-dark tracking-tight">Prescribe Your Style</h1>
          <p className="text-sm text-natural-text-muted font-normal max-w-xl">
            Browse our catalog of pharmaceutical-grade design elements. Filter by specialty area, search by keyword, or sort by pricing density.
          </p>
        </div>
        
        {/* Active Filters Display */}
        {selectedCategory && (
          <button
            onClick={() => {
              setSelectedCategory('');
              setCurrentPage(1);
            }}
            className="bg-natural-accent/10 border border-natural-accent/20 text-natural-accent rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-natural-accent/20 transition-all flex items-center gap-1 shrink-0"
          >
            Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
            <span className="text-natural-text-muted font-normal">×</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS (Column 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Live Search */}
          <div className="bg-white border border-natural-border p-5 rounded-[24px] shadow-none space-y-3">
            <h3 className="text-sm font-bold text-natural-text-dark uppercase tracking-wider flex items-center gap-2 font-serif">
              <SlidersHorizontal size={14} className="text-natural-text-muted" /> Filter & Search
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-natural-border rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-natural-accent bg-natural-input/30"
              />
            </div>
          </div>

          {/* Category List */}
          <div className="bg-white border border-natural-border p-5 rounded-[24px] shadow-none space-y-4">
            <h3 className="text-sm font-bold text-natural-text-dark uppercase tracking-wider font-serif">Specialties</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
                className={`text-left text-xs font-medium px-4 py-2.5 rounded-full transition-all ${
                  selectedCategory === ''
                    ? 'bg-natural-accent text-white font-bold shadow-xs'
                    : 'bg-natural-input/30 text-natural-text-main hover:bg-natural-input'
                }`}
              >
                All Specialties
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                     setSelectedCategory(cat.slug);
                     setCurrentPage(1);
                  }}
                  className={`text-left text-xs font-medium px-4 py-2.5 rounded-full transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-natural-accent text-white font-bold shadow-xs'
                      : 'bg-natural-input/30 text-natural-text-main hover:bg-natural-input'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown Selector */}
          <div className="bg-white border border-natural-border p-5 rounded-[24px] shadow-none space-y-3">
            <h3 className="text-sm font-bold text-natural-text-dark uppercase tracking-wider flex items-center gap-2 font-serif">
              <ArrowUpDown size={14} className="text-natural-text-muted" /> Sort Order
            </h3>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-natural-border rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-natural-accent bg-natural-input/30"
            >
              <option value="newest">Newest Receipts</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Popularity Rating</option>
            </select>
          </div>

        </div>

        {/* PRODUCTS GRID & PAGINATION (Columns 2-4) */}
        <div className="lg:col-span-3 space-y-8">
          
          {products.length > 0 ? (
            <>
              {/* Product cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={p.id || p._id || i}
                    className="group flex flex-col bg-white border border-natural-border rounded-3xl overflow-hidden shadow-none hover:shadow-md transition-all duration-300"
                  >
                    {/* Image Area */}
                    <div
                      className="relative aspect-square overflow-hidden cursor-pointer bg-natural-bg"
                      onClick={() => onSelectProduct(p)}
                    >
                      <span className={`absolute top-3 left-3 z-10 text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        p.stockStatus === 'In Stock' ? 'bg-[#5A5A40]/90 text-white' : 'bg-[#8a7b5a]/90 text-white'
                      }`}>
                        {p.stockStatus}
                      </span>
                      
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute bottom-3 left-3 bg-natural-text-dark/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-white flex items-center gap-1 text-[10px]">
                        <Star size={10} className="fill-natural-accent text-natural-accent" />
                        <span>{p.rating || 4.5}</span>
                      </div>
                    </div>

                    {/* Meta Data */}
                    <div className="p-4.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-natural-text-muted tracking-wider">
                          {p.category}
                        </span>
                        <h3
                          className="font-serif text-sm font-bold text-natural-text-dark hover:text-natural-accent cursor-pointer line-clamp-1 transition-colors mt-0.5"
                          onClick={() => onSelectProduct(p)}
                        >
                          {p.title}
                        </h3>
                        <p className="text-xs text-natural-text-muted font-normal mt-1.5 line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-natural-border/60">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-natural-text-dark">${p.price}</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-natural-text-muted line-through">${p.originalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="text-[10px] font-bold uppercase tracking-wider text-natural-accent hover:text-white bg-natural-input hover:bg-natural-accent px-4 py-1.5 rounded-full transition-all"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* PAGINATION PANEL */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-natural-border rounded-full hover:border-natural-accent hover:text-natural-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`h-9 w-9 rounded-full text-xs font-bold border transition-all ${
                        currentPage === pNum
                          ? 'bg-natural-accent border-natural-accent text-white font-bold'
                          : 'bg-white border-natural-border text-natural-text-main hover:border-natural-accent hover:text-natural-accent'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-natural-border rounded-full hover:border-natural-accent hover:text-natural-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* EMPTY FILTER RESULT STATE */
            <div className="bg-white border border-natural-border rounded-3xl py-20 text-center space-y-4 shadow-none flex flex-col items-center justify-center">
              <span className="p-4 bg-natural-input/40 text-natural-text-muted rounded-full inline-block">
                <Ban size={40} />
              </span>
              <h3 className="font-serif text-lg font-bold text-natural-text-dark">No Diagnostic Prescriptions Found</h3>
              <p className="text-xs text-natural-text-muted font-normal max-w-xs leading-relaxed">
                No items match your active keyword or specialty filter. Try resetting search fields or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="bg-natural-accent hover:bg-natural-accent-hover text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
