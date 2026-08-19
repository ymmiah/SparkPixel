import React from 'react';
import { Page } from '../types';
import { LogoIcon, CheckCircleIcon, SparklesIcon } from './icons';

interface FooterProps {
  onNavigate: (page: Page, payload?: { category?: string }) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-indigo-900/60 text-indigo-400">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">100% Print Guarantee</p>
              <p className="text-[11px] text-slate-400">Free reprint if not satisfied</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-amber-900/60 text-amber-400">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">AI-Powered Studio</p>
              <p className="text-[11px] text-slate-400">Smart copy & starter templates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-emerald-900/60 text-emerald-400">
              ⚡
            </div>
            <div>
              <p className="font-bold text-white text-xs">Express Turnaround</p>
              <p className="text-[11px] text-slate-400">Fast 2-3 business days delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-purple-900/60 text-purple-400">
              🏷️
            </div>
            <div>
              <p className="font-bold text-white text-xs">Volume Bulk Discounts</p>
              <p className="text-[11px] text-slate-400">Save up to 70% in quantity tiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 text-white rounded-xl">
                <LogoIcon className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight font-heading">
                Spark Pixel Studio
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The modern standard for custom print design, business stationery, brand merchandise, and commercial signage.
            </p>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} Spark Pixel Inc. All rights reserved.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Products</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('products', { category: 'business-cards' })} className="hover:text-white transition-colors">
                  Business Cards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'marketing' })} className="hover:text-white transition-colors">
                  Flyers & Postcards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'apparel' })} className="hover:text-white transition-colors">
                  T-Shirts & Hoodies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'homeware' })} className="hover:text-white transition-colors">
                  Ceramic Mugs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'stickers' })} className="hover:text-white transition-colors">
                  Custom Stickers
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Tools */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Studio & Design</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors">
                  Designer Templates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Custom QR Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  AI Marketing Copywriter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  3D Proof Mockups
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Account & Help</p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('checkout')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <span className="text-slate-500">24/7 Print Assistance</span>
              </li>
              <li>
                <span className="text-slate-500">support@sparkpixel.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
