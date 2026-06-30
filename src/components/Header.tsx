import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Search, Lock, Compass } from 'lucide-react';
import logo from "../assets/logo.jpeg";

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminLoggedIn: boolean;
}

export default function Header({
  activePage,
  setActivePage,
  searchQuery,
  setSearchQuery,
  isAdminLoggedIn,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'Products', id: 'products' },
    { label: 'Categories', id: 'categories' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('products');
    }
  };

  const navigateToPage = (pageId: string) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-natural-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer gap-2" onClick={() => navigateToPage('home')}>
            <div className="w-8 h-8 bg-natural-accent rounded-full"></div>
            <span className="font-serif text-2xl font-bold tracking-tight text-natural-text-dark">
              Dr. Decors
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const isActive = activePage === item.id || (item.id === 'products' && activePage === 'product-details');
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToPage(item.id)}
                  className={`relative text-xs uppercase font-medium tracking-widest transition-opacity py-2 ${
                    isActive ? 'text-natural-accent font-bold opacity-100' : 'text-natural-text-main opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-natural-accent"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities (Search, Admin) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search premium decors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-natural-input border-0 rounded-full px-4 py-1.5 text-xs text-natural-text-main focus:ring-1 focus:ring-natural-accent outline-none mr-2 placeholder-natural-text-muted/60"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => {
                  if (isSearchExpanded && searchQuery.trim()) {
                    navigateToPage('products');
                  } else {
                    setIsSearchExpanded(!isSearchExpanded);
                  }
                }}
                className="p-2 text-natural-text-muted hover:text-natural-accent rounded-full hover:bg-natural-input/50 transition-colors"
                title="Search Products"
              >
                <Search size={19} />
              </button>
            </form>

            {/* Admin Dashboard / Login Access */}
            <button
              onClick={() => navigateToPage(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all border-0 ${
                activePage.startsWith('admin')
                  ? 'bg-natural-accent-hover text-white'
                  : 'bg-natural-accent text-white hover:bg-natural-accent-hover'
              }`}
            >
              {isAdminLoggedIn ? <Compass size={13} /> : <Lock size={13} />}
              {isAdminLoggedIn ? 'Dashboard' : 'Admin Panel'}
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded);
                if (!isSearchExpanded) navigateToPage('products');
              }}
              className="p-2 text-natural-text-main"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-natural-text-main hover:text-natural-accent"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-natural-border bg-white overflow-hidden shadow-lg"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {/* Search in mobile menu */}
              <form onSubmit={handleSearchSubmit} className="px-3 py-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Search decors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-natural-input rounded-full px-4 py-1.5 text-xs text-natural-text-main focus:outline-none focus:ring-1 focus:ring-natural-accent"
                />
                <button type="submit" className="bg-natural-accent text-white p-2 rounded-full">
                  <Search size={16} />
                </button>
              </form>

              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToPage(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${
                    activePage === item.id
                      ? 'bg-natural-input text-natural-accent font-semibold'
                      : 'text-natural-text-main hover:bg-natural-input/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-natural-border pt-4 mt-2 px-3">
                <button
                  onClick={() => navigateToPage(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                  className="flex items-center justify-center gap-1.5 w-full bg-natural-accent hover:bg-natural-accent-hover text-white text-center px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  {isAdminLoggedIn ? <Compass size={15} /> : <Lock size={15} />}
                  {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Area'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
