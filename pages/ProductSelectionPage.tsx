import React, { useMemo } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../contexts/AppContext';
import { LoaderIcon } from '../components/icons';

interface ProductSelectionPageProps {
  onProductSelect: (product: Product) => void;
  category: string | null;
}

const ProductSelectionPage: React.FC<ProductSelectionPageProps> = ({ onProductSelect, category }) => {
  const { products, isLoading } = useAppContext();

  const filteredProducts = useMemo(() => {
    if (!category) return products;
    return products.filter(p => p.category === category);
  }, [products, category]);

  const categoryTitle = useMemo(() => {
    if (!category) return 'All Products';
    switch(category) {
        case 'apparel': return 'Apparel & Totes';
        case 'homeware': return 'Mugs & Homeware';
        case 'print': return 'Paper & Printing';
        default: return 'Products';
    }
  }, [category]);

  if (isLoading && products.length === 0) {
      return (
          <div className="flex justify-center items-center h-64">
              <LoaderIcon className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
      )
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{categoryTitle}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Select an item to start customizing with your design.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
        ))}
      </div>
    </div>
  );
};

export default ProductSelectionPage;