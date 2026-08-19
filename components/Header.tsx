import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { LogoIcon, UserIcon, MenuIcon, XIcon, ChevronDownIcon, ShoppingCartIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import Button from './Button';

interface HeaderProps {
  onNavigate: (page: Page, payload?: { category?: string }) => void;
}

const productCategories = [
    { label: 'All Products', category: null },
    { label: 'Apparel & Totes', category: 'apparel' },
    { label: 'Mugs & Homeware', category: 'homeware' },
    { label: 'Paper & Printing', category: 'print' },
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

  const ProductDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {productCategories.map(item => (
                 <button
                    key={item.label}
                    onClick={() => handleProductNav(item.category)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    {item.label}
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2">
              <LogoIcon className="h-8 w-auto text-indigo-600" />
              <span className="font-bold text-xl text-gray-800">Spark Pixel</span>
            </button>
            <nav className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
               <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
               </button>
               <div className="relative" ref={productMenuRef}>
                    <button onClick={() => setIsProductMenuOpen(prev => !prev)} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                        Products <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProductMenuOpen && <ProductDropdown />}
               </div>
            </nav>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-3">
              {/* Cart Button */}
              <button
                onClick={() => onNavigate('checkout')}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-100"
                title="View Cart"
                aria-label={`Cart with ${cartItemCount} items`}
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {currentUser ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {currentUser.name.split(' ')[0]}</span>
                  <button onClick={() => onNavigate('profile')} className="p-1 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" title="Profile">
                    <UserIcon className="h-6 w-6" />
                  </button>
                   <Button variant="secondary" size="sm" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin}>
                  Login
                </Button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center gap-2 md:hidden">
            {/* Mobile Cart Button */}
            <button
              onClick={() => onNavigate('checkout')}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="w-full text-left text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Home</button>
             <div>
                <button onClick={() => setIsProductMenuOpen(!isProductMenuOpen)} className="w-full text-left text-gray-600 hover:text-indigo-600 flex justify-between items-center px-3 py-2 rounded-md text-base font-medium">
                    Products
                    <ChevronDownIcon className={`h-5 w-5 transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProductMenuOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                        {productCategories.map(item => (
                            <button key={item.label} onClick={() => handleProductNav(item.category)} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-50">
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
             </div>
             <button onClick={() => { onNavigate('checkout'); setIsMenuOpen(false); }} className="w-full text-left text-gray-600 hover:text-indigo-600 flex items-center justify-between px-3 py-2 rounded-md text-base font-medium">
               <span>Cart & Checkout</span>
               {cartItemCount > 0 && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-semibold">{cartItemCount} items</span>}
             </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser ? (
               <div className="flex items-center px-5 justify-between">
                <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="flex items-center gap-3">
                  <div className="p-1 rounded-full text-gray-400">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-base font-medium leading-none text-gray-800">{currentUser.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-500">{currentUser.email}</div>
                  </div>
                </button>
                <Button variant="secondary" size="sm" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Log Out</Button>
              </div>
            ) : (
              <div className="px-5">
                 <Button fullWidth onClick={() => { handleLogin(); setIsMenuOpen(false); }}>Login</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
