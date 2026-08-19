import React from 'react';
import { Product } from '../types';
import Button from './Button';
import { StarIcon, SparklesIcon } from './icons';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const lowestUnitPrice = product.quantityTiers[product.quantityTiers.length - 1]?.unitPrice || product.basePrice;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Badges */}
      <div>
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Product Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
              {product.badge}
            </div>
          )}

          {/* Turnaround Tag */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
            ⚡ {product.turnaroundDays}
          </div>
        </div>

        {/* Info Body */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              <StarIcon className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[11px] text-slate-400 font-medium">({product.reviewsCount.toLocaleString()})</span>
          </div>

          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>

          {/* Key Option Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.finishes && product.finishes.length > 0 && (
              <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                {product.finishes.length} Finishes
              </span>
            )}
            {product.supportedSides.length > 1 && (
              <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                2-Sided Print
              </span>
            )}
            {product.corners && (
              <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                Custom Corners
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Starting at</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-900">${product.basePrice.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500">(${lowestUnitPrice.toFixed(2)} in bulk)</span>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => onSelect(product)}
          className="shadow-sm"
        >
          Customize →
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
