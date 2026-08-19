import React, { useState } from 'react';
import { STARTER_TEMPLATES } from '../database/templates';
import { DesignTemplate, Product, Page } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { SparklesIcon, TemplateIcon, ChevronRightIcon } from '../components/icons';
import Button from '../components/Button';

interface TemplatesPageProps {
  onSelectTemplate: (template: DesignTemplate, targetProduct?: Product) => void;
  onNavigate?: (page: Page) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onSelectTemplate, onNavigate }) => {
  const { products, setActiveTemplateToLoad } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Real Estate', 'Technology', 'Food & Beverage', 'Fashion & Streetwear', 'Events & Promotions'];

  const filteredTemplates = STARTER_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCustomize = (template: DesignTemplate) => {
    const matchingProduct = products.find((p) => p.category === template.productType || p.id.includes(template.productType)) || products[0];
    setActiveTemplateToLoad(template);
    onSelectTemplate(template, matchingProduct);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80 mb-3">
            <SparklesIcon className="h-4 w-4 text-indigo-600" />
            100% Fully Customizable Designs
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designer Templates for Every Industry
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Choose from professionally crafted layouts for business cards, flyers, apparel, and merchandise. Swap logos, edit copy, or customize fonts in seconds.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search templates (e.g. tech, luxury)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Template Preview Image */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {template.category}
                </div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <Button
                    onClick={() => handleCustomize(template)}
                    className="shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                  >
                    Customize Design →
                  </Button>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {template.elements.front.length + (template.elements.back?.length || 0)} customizable layers
                  </span>
                  <button
                    onClick={() => handleCustomize(template)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    Use Template <ChevronRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start from Blank Banner */}
        <div className="mt-14 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-extrabold">Prefer to start with a blank canvas?</h2>
            <p className="text-indigo-200 text-sm mt-1 max-w-xl">
              Upload your own high-resolution vector logos, create custom typography, add QR codes, and configure custom paper finishes from scratch.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate && onNavigate('products')}
            className="whitespace-nowrap bg-white text-indigo-900 hover:bg-indigo-50 font-bold"
          >
            Browse All Blank Products →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
