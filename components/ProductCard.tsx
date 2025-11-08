import React from 'react';
import { Product } from '../types';
import { FileTextIcon } from './icons';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const isPrintProduct = product.category === 'print';

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 lg:aspect-none group-hover:bg-gray-200/50 transition-colors duration-300">
        {isPrintProduct ? (
          <div className="flex items-center justify-center h-full w-full p-4">
            <FileTextIcon className="h-24 w-24 text-gray-300 group-hover:text-gray-400 transition-colors" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain object-center p-4 lg:h-full lg:w-full group-hover:opacity-80 transition-opacity"
          />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-md font-semibold text-gray-800">
            <button onClick={() => onSelect(product)} className="focus:outline-none text-left">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </button>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isPrintProduct ? 'Select this size' : 'Customize this product'}
          </p>
        </div>
        <p className="text-lg font-medium text-gray-900 mt-2">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;