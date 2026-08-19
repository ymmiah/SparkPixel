import React, { useState, useRef, useEffect } from 'react';
import { Page, ProductCategory } from '../types';
import { LogoIcon, UserIcon, MenuIcon, XIcon, ChevronDownIcon, ShoppingCartIcon, SparklesIcon, TemplateIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import Button from './Button';

interface HeaderProps {
  onNavigate: (page: Page, payload?: { category?: string }) => void;
}

const productCategories = [
  { label: 'All Products', category: null },
  { label: 'Business Cards', category: 'business-cards' },
  { label: 'Marketing & Flyers', category: 'marketing' },
  { label: 'Apparel & Bags', category: 'apparel' },
  { label: 'Drinkware & Homeware', category: 'homeware' },
  { label: 'Signs & Banners', category: 'signs' },
  { label: 'Stickers & Labels', category: 'stickers' },
];

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const { currentUser, login, logout, cart } = useAppContext();
  const productMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productMenuRef.current && !productMenuRef.current.contains(event.target as Node)) {
        setIsProductMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    login('user-1');
  };
  
  const handleLogout = () => {
    logout();
    onNavigate('home');
  };
  
  const handleProductNav = (category: string | null) => {
    onNavigate('products', category ? { category } : undefined);
    setIsProductMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner Notice like Vistaprint */}
      <div className="bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide">
        🚀 <span className="text-amber-300 font-bold">LIMITED TIME:</span> Bulk Savings up to 70% Off + Free Shipping on Orders over $75 with code <span className="underline decoration-amber-400 font-bold">PRINTPRO</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2.5 text-left">
              <div className="p-1.5 bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-500/20">
                <LogoIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-slate-900 leading-none block font-heading">
                  Spark Pixel
                </span>
                <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase block">
                  Custom Print Studio
                </span>
              </div>
            </button>

            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => onNavigate('home')}
                className="text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Home
              </button>

              {/* Products Dropdown */}
              <div className="relative" ref={productMenuRef}>
                <button
                  onClick={() => setIsProductMenuOpen(prev => !prev)}
                  className="text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1"
                >
                  Products <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProductMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-xl bg-white border border-slate-200/80 p-2 z-50 animate-fadeIn">
                    {productCategories.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleProductNav(item.category)}
                        className="block w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Templates */}
              <button
                onClick={() => onNavigate('templates')}
                className="text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <TemplateIcon className="h-3.5 w-3.5 text-indigo-500" />
                Design Templates
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Design CTA */}
            <Button
              size="sm"
              onClick={() => onNavigate('products')}
              className="text-xs shadow-xs"
            >
              Start Designing →
            </Button>

            {/* Cart Button */}
            <button
              onClick={() => onNavigate('checkout')}
              className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="View Cart"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span>{currentUser.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={handleLogin}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu triggers */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onNavigate('checkout')}
              className="relative p-2 text-slate-600 hover:text-indigo-600"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
            className="w-full text-left py-2 text-xs font-bold text-slate-700 hover:text-indigo-600"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('products'); setIsMenuOpen(false); }}
            className="w-full text-left py-2 text-xs font-bold text-slate-700 hover:text-indigo-600"
          >
            All Products & Catalog
          </button>
          <button
            onClick={() => { onNavigate('templates'); setIsMenuOpen(false); }}
            className="w-full text-left py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-2"
          >
            <TemplateIcon className="h-4 w-4 text-indigo-500" />
            Designer Templates
          </button>
          <button
            onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}
            className="w-full text-left py-2 text-xs font-bold text-slate-700 hover:text-indigo-600"
          >
            My Account & Orders
          </button>
          <div className="pt-3 border-t border-slate-200">
            <Button
              fullWidth
              onClick={() => { onNavigate('products'); setIsMenuOpen(false); }}
            >
              Start Designing Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
