import React from 'react';
import { Product, Page, DesignTemplate } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { STARTER_TEMPLATES } from '../database/templates';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import {
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  TemplateIcon,
  ChevronRightIcon,
  PrintIcon,
  DesignIcon
} from '../components/icons';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: Page, payload?: { category?: string }) => void;
  onSelectTemplate: (template: DesignTemplate, product?: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onNavigate,
  onSelectTemplate
}) => {
  const { products, setActiveTemplateToLoad } = useAppContext();

  const featuredProducts = products.slice(0, 4);

  const categories = [
    { id: 'business-cards', name: 'Business Cards', icon: '📇', desc: 'Matte, Glossy & Foil' },
    { id: 'marketing', name: 'Flyers & Postcards', icon: '📄', desc: 'Edge-to-edge full color' },
    { id: 'apparel', name: 'T-Shirts & Hoodies', icon: '👕', desc: 'Direct-to-garment print' },
    { id: 'homeware', name: 'Mugs & Drinkware', icon: '☕', desc: 'Dishwasher safe ceramic' },
    { id: 'signs', name: 'Banners & Signs', icon: '🪧', desc: 'Trade show & yard signs' },
    { id: 'stickers', name: 'Custom Stickers', icon: '🏷️', desc: 'Die-cut waterproof vinyl' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Subtle background mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/80 text-indigo-300 text-xs font-bold border border-indigo-700/60 shadow-inner">
                <SparklesIcon className="h-4 w-4 text-amber-400" />
                Professional Custom Print & Merch Studio
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-heading">
                Make your brand <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-indigo-200 to-white">
                  impossible to ignore.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
                Design and print premium business cards, marketing flyers, custom apparel, and event signage with our interactive studio, AI copywriting, and bulk savings.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => onNavigate('products')}
                  className="w-full sm:w-auto shadow-xl shadow-indigo-600/30 text-sm font-extrabold"
                >
                  Explore All Products →
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('templates')}
                  className="w-full sm:w-auto bg-slate-800 text-white hover:bg-slate-700 border-slate-700 text-sm font-bold"
                >
                  Browse 100+ Templates
                </Button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  <span>100% Reprint Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  <span>2-3 Day Fast Turnaround</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  <span>Free High-Res 3D Proofs</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Preview Card */}
                <div className="mockup-perspective-card bg-white rounded-3xl p-6 shadow-2xl text-slate-900 border border-slate-100">
                  <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-inner p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Apex Venture</span>
                        <h4 className="text-xl font-black font-heading mt-0.5">ELEVATE</h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                        ✦
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">Sarah Jenkins</p>
                      <p className="text-[10px] text-slate-400">Chief Investment Officer • NYC</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Standard Business Cards (16pt)</p>
                      <p className="text-[11px] text-slate-500">Velvet Matte Finish with Gold Foil</p>
                    </div>
                    <button
                      onClick={() => onSelectProduct(products[0])}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                    >
                      Design Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Showcase */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Popular Print Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Select a category to start customizing with your logo</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('products', { category: cat.id })}
                className="p-5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-300 rounded-2xl text-center transition-all group hover:-translate-y-1"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bestsellers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <StarIcon className="h-3.5 w-3.5 fill-current" />
                Customer Favorites
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Rated Products</h2>
              <p className="text-sm text-slate-500 mt-1">
                Engineered for maximum print fidelity, sharp vector precision, and everyday durability.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('products')}
              className="text-xs font-bold"
            >
              View Full Catalog ({products.length}) →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Starter Templates Highlight Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2">
                <TemplateIcon className="h-3.5 w-3.5" />
                1-Click Customization
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Industry Design Templates</h2>
              <p className="text-sm text-slate-500 mt-1">
                Skip the blank page. Start with professionally crafted designs made for real-world impact.
              </p>
            </div>
            <button
              onClick={() => onNavigate('templates')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Browse All Templates <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STARTER_TEMPLATES.slice(0, 3).map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  const matchingProd = products.find(p => p.category === tmpl.productType) || products[0];
                  setActiveTemplateToLoad(tmpl);
                  onSelectTemplate(tmpl, matchingProd);
                }}
                className="group bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img
                    src={tmpl.previewUrl}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {tmpl.category}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{tmpl.tags.join(' • ')}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">Customize →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Spark Pixel (Vistaprint Standard) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">The Professional Print Standard</h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need to showcase your brand, from single prototypes to 10,000-unit commercial runs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                🎨
              </div>
              <h3 className="text-lg font-bold text-slate-900">Interactive Design Studio</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full-featured vector canvas with Google Fonts typography, drag-and-drop layers, QR code generator, and instant 3D proof rendering.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                ✨
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini AI Marketing Co-Pilot</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate high-converting taglines, business bios, and promo copy directly onto your products with built-in AI intelligence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-slate-900">100% Print-Perfect Guarantee</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If the color balance, alignment, or finish isn't completely true to your approved digital proof, we reprint it free or refund your order.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
