import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductSelectionPage from './pages/ProductSelectionPage';
import DesignStudioPage from './pages/DesignStudioPage';
import TemplatesPage from './pages/TemplatesPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import { Page, Product, Design, DesignElement, DesignTemplate } from './types';
import { useAppContext } from './contexts/AppContext';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productCategory, setProductCategory] = useState<string | undefined>(undefined);
  const { addToCart, products, setActiveTemplateToLoad } = useAppContext();

  const navigate = useCallback((page: Page, payload?: { category?: string }) => {
    if (page === 'products') {
      setProductCategory(payload?.category || undefined);
    }

    if (page !== 'design-studio') {
      // Keep selected product if navigating temporarily or clearing
    }
    
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('design-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTemplateSelect = useCallback((template: DesignTemplate, product?: Product) => {
    const targetProduct = product || products.find(p => p.category === template.productType) || products[0];
    setSelectedProduct(targetProduct);
    setActiveTemplateToLoad(template);
    setCurrentPage('design-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [products, setActiveTemplateToLoad]);
  
  const handleAddToCart = (
    designElements: DesignElement[],
    previewImageUrl: string,
    quantity: number = 100,
    options?: {
      finishName?: string;
      cornerName?: string;
      sizeName?: string;
      unitPrice?: number;
    }
  ) => {
    if (!selectedProduct) return;
    
    const design: Design = {
      productId: selectedProduct.id,
      frontElements: designElements,
      elements: designElements
    };
    
    const unitPrice = options?.unitPrice || selectedProduct.basePrice;

    addToCart({
      product: selectedProduct,
      design: design,
      quantity: quantity,
      previewImageUrl: previewImageUrl,
      selectedFinishName: options?.finishName,
      selectedCornerName: options?.cornerName,
      selectedSizeName: options?.sizeName,
      unitPrice: unitPrice
    });
    
    navigate('checkout');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onSelectProduct={handleProductSelect}
            onNavigate={navigate}
            onSelectTemplate={handleTemplateSelect}
          />
        );
      case 'products':
        return (
          <ProductSelectionPage
            onSelectProduct={handleProductSelect}
            initialCategory={productCategory}
          />
        );
      case 'templates':
        return (
          <TemplatesPage
            onSelectTemplate={handleTemplateSelect}
            onNavigate={navigate}
          />
        );
      case 'design-studio':
        if (!selectedProduct) {
          const fallbackProduct = products[0] || null;
          if (!fallbackProduct) {
            return <ProductSelectionPage onSelectProduct={handleProductSelect} initialCategory={productCategory} />;
          }
          return (
            <DesignStudioPage
              product={fallbackProduct}
              onNavigate={navigate}
              onAddToCart={handleAddToCart}
            />
          );
        }
        return (
          <DesignStudioPage
            product={selectedProduct}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
          />
        );
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} onSelectProduct={handleProductSelect} />;
      default:
        return (
          <HomePage
            onSelectProduct={handleProductSelect}
            onNavigate={navigate}
            onSelectTemplate={handleTemplateSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Header onNavigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;
