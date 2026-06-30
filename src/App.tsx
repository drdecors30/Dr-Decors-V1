import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, RotateCw } from 'lucide-react';
import { IProduct, ICategory, ICompanyDetails, IFAQ } from './types';

// Import modular subviews
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import CategoriesView from './components/CategoriesView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import ProductDetailsView from './components/ProductDetailsView';
import AdminLoginView from './components/AdminLoginView';
import AdminDashboardView from './components/AdminDashboardView';

export default function App() {
  // Page Navigation State
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Global Datasets State
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [contactDetails, setContactDetails] = useState<ICompanyDetails | null>(null);
  const [faqsList, setFaqsList] = useState<IFAQ[] | null>(null);

  // Dynamic Filtering / Pagination States
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Loading indicator states
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // 1. Check local session tokens on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAdminLoggedIn(true);
    }
  }, []);

  // 2. Fetch global categories, settings, FAQs (only once)
  const fetchGlobalMetadata = async () => {
    try {
      // Categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
      }

      // Settings (contact details, FAQs)
      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setContactDetails(settingsData.settings.contact_details || null);
        setFaqsList(settingsData.settings.faqs || null);
      }
    } catch (err) {
      console.error('Error fetching layout metadata:', err);
    }
  };

  useEffect(() => {
    fetchGlobalMetadata();
  }, []);

  // 3. Fetch products dynamically based on search, category, sort, and pagination
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const url = `/api/products?category=${selectedCategory}&search=${searchQuery}&sort=${sortOption}&page=${currentPage}&limit=9`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, [selectedCategory, searchQuery, sortOption, currentPage]);

  // Auth event handlers
  const handleLoginSuccess = (userToken: string, adminInfo: any) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdminLoggedIn(false);
    setActivePage('home');
  };

  // Helper selectors
  const handleSelectProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setActivePage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterCategory = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation page changer
  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render proper subpage inside main view stage
  const renderPageContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomeView
            products={products}
            categories={categories}
            heroSlides={null}
            onSelectProduct={handleSelectProduct}
            onFilterCategory={handleFilterCategory}
            setActivePage={handlePageChange}
          />
        );

      case 'products':
        return (
          <ProductsView
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            onSelectProduct={handleSelectProduct}
          />
        );

      case 'categories':
        return (
          <CategoriesView
            categories={categories}
            onFilterCategory={handleFilterCategory}
          />
        );

      case 'about':
        return <AboutView setActivePage={handlePageChange} />;

      case 'contact':
        return <ContactView contactDetails={contactDetails} faqsList={faqsList} />;

      case 'product-details':
        if (!selectedProduct) {
          setActivePage('products');
          return null;
        }
        return (
          <ProductDetailsView
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            setActivePage={handlePageChange}
          />
        );

      case 'admin-login':
        if (isAdminLoggedIn) {
          setActivePage('admin-dashboard');
          return null;
        }
        return (
          <AdminLoginView
            onLoginSuccess={handleLoginSuccess}
            setActivePage={handlePageChange}
          />
        );

      case 'admin-dashboard':
        if (!isAdminLoggedIn) {
          setActivePage('admin-login');
          return null;
        }
        return (
          <AdminDashboardView
            products={products}
            categories={categories}
            onRefreshData={async () => {
              await fetchGlobalMetadata();
              await fetchProductsList();
            }}
            onLogout={handleLogout}
            token={token}
          />
        );

      default:
        return (
          <div className="py-20 text-center text-stone-500">
            Page under construction.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-800 flex flex-col font-sans">
      
      {/* Header element */}
      <Header
        activePage={activePage}
        setActivePage={handlePageChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main content viewport */}
      <main className="flex-grow">
        {loading && activePage === 'products' ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <RotateCw className="animate-spin text-amber-500" size={36} />
            <span className="text-xs text-stone-400 font-mono tracking-widest uppercase">
              Diagnosing Room Spaces...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              {renderPageContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer element */}
      <Footer
        contactDetails={contactDetails}
        setActivePage={handlePageChange}
      />

    </div>
  );
}
