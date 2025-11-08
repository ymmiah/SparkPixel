import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductSelectionPage from './pages/ProductSelectionPage';
import DesignStudioPage from './pages/DesignStudioPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import { Page, Product, Design, DesignElement } from './types';
import { useAppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const { addToCart } = useAppContext();

  const navigate = useCallback((page: Page, payload?: { category?: string }) => {
    if (page === 'products') {
      setProductCategory(payload?.category || null);
    }

    if (page !== 'design-studio') {
      setSelectedProduct(null);
    }
    
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    navigate('design-studio');
  }, [navigate]);
  
  const handleAddToCart = (designElements: DesignElement[]) => {
    if (!selectedProduct) return;
    
    const design: Design = {
        productId: selectedProduct.id,
        elements: designElements
    };
    
    addToCart({
        product: selectedProduct,
        design: design,
        quantity: 1 // Default quantity to 1
    });
    
    navigate('checkout');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'products':
        return <ProductSelectionPage onProductSelect={handleProductSelect} category={productCategory} />;
      case 'design-studio':
        if (!selectedProduct) {
          // If no product is selected, go back to product page, preserving category
          return <ProductSelectionPage onProductSelect={handleProductSelect} category={productCategory} />;
        }
        return <DesignStudioPage product={selectedProduct} onNavigate={navigate} onAddToCart={handleAddToCart} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header onNavigate={navigate} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;