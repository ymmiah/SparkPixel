import React, { useState } from 'react';
import { Page, Order } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import confetti from 'canvas-confetti';
import {
  TrashIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  LockClosedIcon,
  SparklesIcon,
  ChevronRightIcon,
  PrintIcon
} from '../components/icons';

interface CheckoutPageProps {
  onNavigate: (page: Page) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, currentUser, login } = useAppContext();
  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Express Rush'>('Standard');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Doe',
    email: 'alex.doe@example.com',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '849'
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingCost = cartSubtotal > 75 ? 0 : (shippingMethod === 'Express Rush' ? 14.99 : 5.99);
  const discountAmount = (cartSubtotal * appliedDiscount) / 100;
  const taxAmount = (cartSubtotal - discountAmount) * 0.08;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost + taxAmount);

  const handleApplyPromo = () => {
    setPromoError(null);
    if (promoCode.trim().toUpperCase() === 'PRINTPRO' || promoCode.trim().toUpperCase() === 'VISTA15') {
      setAppliedDiscount(15);
    } else {
      setPromoError('Invalid promo code. Try "PRINTPRO" for 15% off.');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      await login('user-1');
    }

    setIsProcessing(true);
    try {
      const order = await placeOrder(shippingMethod);
      if (order) {
        setCompletedOrder(order);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Order placement error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircleIcon className="h-10 w-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2 border border-emerald-200">
                Payment Confirmed • In Production
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Thank You for Your Order!</h1>
              <p className="text-xs text-slate-500 mt-1">
                Order confirmation and digital invoice sent to <span className="font-semibold text-slate-700">{formData.email}</span>
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Order Number:</span>
                  <span className="font-black text-slate-900 ml-2">#{completedOrder.id}</span>
                </div>
                <div>
                  <span className="text-slate-500">Tracking Code:</span>
                  <span className="font-bold text-indigo-600 ml-2">{completedOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.previewImageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} units {item.selectedFinishName ? `• ${item.selectedFinishName}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total Paid:</span>
                <span className="font-extrabold text-indigo-600 text-xl">${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
              <Button onClick={() => onNavigate('profile')}>
                View in Order History
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('products')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Cart & Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingCartIcon className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your shopping cart is empty</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Select a product from our catalog or customize a template to start printing.
            </p>
            <div className="mt-6">
              <Button onClick={() => onNavigate('products')}>
                Browse Products →
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items & Shipping Form (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Cart Items Container */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <h2 className="text-base font-extrabold text-slate-900">Your Custom Merchandise ({cart.length})</h2>

                <div className="divide-y divide-slate-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      {/* Preview Thumbnail */}
                      <img
                        src={item.previewImageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-slate-900 truncate">{item.product.name}</h3>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove Item"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Custom Options Chips */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.selectedFinishName && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              Finish: {item.selectedFinishName}
                            </span>
                          )}
                          {item.selectedCornerName && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {item.selectedCornerName}
                            </span>
                          )}
                          {item.selectedSizeName && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              Size: {item.selectedSizeName}
                            </span>
                          )}
                        </div>

                        {/* Quantity & Item Subtotal */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateCartQuantity(idx, item.quantity - 25)}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-slate-900 bg-slate-50">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(idx, item.quantity + 25)}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              (${item.unitPrice.toFixed(2)} / unit)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Delivery Option */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <h2 className="text-base font-extrabold text-slate-900">Shipping & Delivery Address</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Delivery Speeds */}
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-2">Shipping Speed</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('Standard')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shippingMethod === 'Standard'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">Standard Shipping</span>
                        <span className="text-xs font-semibold text-slate-600">{cartSubtotal > 75 ? 'FREE' : '$5.99'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">3 - 5 business days</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod('Express Rush')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shippingMethod === 'Express Rush'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">Express Rush ⚡</span>
                        <span className="text-xs font-semibold text-slate-600">$14.99</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">1 - 2 business days</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Payment (col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Promo Code Box */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <label className="text-xs font-extrabold text-slate-900 block mb-1.5">Have a Promo or Voucher Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter PRINTPRO"
                    className="flex-1 uppercase text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button size="sm" onClick={handleApplyPromo} className="text-xs font-bold">
                    Apply
                  </Button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-xs text-emerald-600 font-bold mt-2">✓ 15% Promo Discount Applied!</p>
                )}
                {promoError && (
                  <p className="text-xs text-red-500 font-medium mt-2">{promoError}</p>
                )}
              </div>

              {/* Order Calculations */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs">
                <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">Order Summary</h3>

                <div className="flex justify-between text-slate-600">
                  <span>Merchandise Subtotal:</span>
                  <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (15%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling:</span>
                  <span className="font-semibold text-slate-900">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Sales Tax (8%):</span>
                  <span className="font-semibold text-slate-900">${taxAmount.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Estimated Total:</span>
                  <span className="font-extrabold text-indigo-600 text-2xl">${grandTotal.toFixed(2)}</span>
                </div>

                {/* Secure Checkout Card Details */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <LockClosedIcon className="h-4 w-4 text-emerald-600" />
                    256-Bit Encrypted Payment
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Expiration</label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <Button
                    size="lg"
                    fullWidth
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="shadow-xl shadow-indigo-600/25 mt-2"
                  >
                    {isProcessing ? 'Processing Secure Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
