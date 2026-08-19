import React, { useState } from 'react';
import { Product, DesignElement, ProductSide } from '../types';
import Button from './Button';
import { XIcon, DownloadIcon, CheckCircleIcon, SparklesIcon, RefreshCwIcon, EyeIcon } from './icons';

interface MockupPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  frontElements: DesignElement[];
  backElements?: DesignElement[];
  frontPreviewUrl: string;
  backPreviewUrl?: string;
  onConfirmAddToCart: () => void;
  selectedFinish?: string;
  selectedCorner?: string;
  selectedSize?: string;
  selectedQuantity: number;
  totalPrice: number;
}

export const MockupPreviewModal: React.FC<MockupPreviewModalProps> = ({
  isOpen,
  onClose,
  product,
  frontPreviewUrl,
  backPreviewUrl,
  onConfirmAddToCart,
  selectedFinish,
  selectedCorner,
  selectedSize,
  selectedQuantity,
  totalPrice
}) => {
  const [activeSide, setActiveSide] = useState<ProductSide>('front');
  const [mockupScene, setMockupScene] = useState<'studio' | 'lifestyle' | '3d'>('studio');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const currentPreview = activeSide === 'front' ? frontPreviewUrl : (backPreviewUrl || frontPreviewUrl);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${activeSide}-design.png`;
      link.href = currentPreview;
      link.click();
    } catch (e) {
      console.warn("Download issue:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <EyeIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Realistic 3D & Print Proof Preview</h2>
              <p className="text-xs text-slate-500">Inspect how your custom merchandise looks in real-life settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Preview Stage */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setMockupScene('studio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mockupScene === 'studio' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flat Proof
              </button>
              <button
                onClick={() => setMockupScene('lifestyle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mockupScene === 'lifestyle' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Studio Mockup
              </button>
              <button
                onClick={() => setMockupScene('3d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mockupScene === '3d' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Perspective
              </button>
            </div>

            {/* Mockup Frame */}
            <div className="relative w-full aspect-square max-w-[380px] bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-slate-200/80 shadow-inner">
              {mockupScene === 'lifestyle' && (
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              )}

              {/* Realistic rendered container */}
              <div
                className={`relative transition-all duration-500 ${
                  mockupScene === '3d' ? 'mockup-perspective-card' : ''
                } ${mockupScene === 'lifestyle' ? 'mockup-shadow-lg scale-95' : 'shadow-md'}`}
                style={{
                  borderRadius: selectedCorner === 'rounded' ? '18px' : '6px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={currentPreview}
                  alt="Custom Product Preview"
                  className="max-h-[300px] w-auto object-contain rounded-md shadow-sm"
                />

                {/* Subtle light sheen for glossy finish */}
                {selectedFinish === 'glossy' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none" />
                )}
                {/* Textured linen simulation */}
                {selectedFinish === 'linen' && (
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none" />
                )}
              </div>

              {/* Multi-side Switcher Badge */}
              {product.supportedSides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                  <button
                    onClick={() => setActiveSide('front')}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                      activeSide === 'front' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Front Side
                  </button>
                  <button
                    onClick={() => setActiveSide('back')}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                      activeSide === 'back' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Back Side
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:shadow-sm transition-all"
            >
              <DownloadIcon className="h-4 w-4" />
              Download High-Res Proof (PNG)
            </button>
          </div>

          {/* Right Configuration & Approval Details */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                Print-Ready Vector Proof
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{product.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{product.tagline}</p>
            </div>

            {/* Selected Options Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Quantity:</span>
                <span className="font-bold text-slate-900">{selectedQuantity} units</span>
              </div>
              {selectedFinish && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Paper Finish:</span>
                  <span className="font-semibold text-slate-900 capitalize">{selectedFinish.replace('-', ' ')}</span>
                </div>
              )}
              {selectedCorner && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Corner Style:</span>
                  <span className="font-semibold text-slate-900 capitalize">{selectedCorner} Corners</span>
                </div>
              )}
              {selectedSize && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Size Spec:</span>
                  <span className="font-semibold text-slate-900 uppercase">{selectedSize}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Estimated Production:</span>
                <span className="font-semibold text-slate-900">{product.turnaroundDays}</span>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Order Subtotal:</span>
                <span className="font-extrabold text-indigo-600 text-lg">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Quality Guarantee Box */}
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
              <SparklesIcon className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">100% Satisfaction & Print Guarantee</p>
                <p className="text-indigo-700/80 text-[11px] mt-0.5">
                  If colors or alignment don't match your approved proof, we will reprint or refund your order completely free.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <Button
                size="lg"
                fullWidth
                onClick={() => {
                  onConfirmAddToCart();
                  onClose();
                }}
                className="shadow-lg shadow-indigo-500/25"
              >
                Approve Proof & Add to Cart
              </Button>
              <button
                onClick={onClose}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 transition-colors"
              >
                ← Back to Design Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
