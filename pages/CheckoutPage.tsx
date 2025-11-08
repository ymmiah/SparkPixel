import React, { useState, useMemo } from 'react';
import { Page } from '../types';
import Button from '../components/Button';
import { CheckCircleIcon, LockClosedIcon, LoaderIcon } from '../components/icons';
import { useAppContext } from '../contexts/AppContext';

interface CheckoutPageProps {
  onNavigate: (page: Page) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const { cart, currentUser, placeOrder, isLoading } = useAppContext();

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const shipping = 5.00; // Mock shipping cost
  const tax = subtotal * 0.08; // Mock tax rate
  const total = subtotal + shipping + tax;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = await placeOrder();
    if (newOrder) {
      setIsOrderPlaced(true);
      window.scrollTo(0, 0);
    } else {
        alert("Could not place order. Please make sure you are logged in and your cart is not empty.");
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Thank You!</h1>
        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
        <p className="text-gray-600 mt-1">You can view your order details in your profile.</p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => onNavigate('profile')} variant="secondary">
            View My Orders
          </Button>
          <Button onClick={() => onNavigate('home')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
      return (
         <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
            <p className="text-gray-600 mt-2">Add some products to your cart before checking out.</p>
            <div className="mt-6">
                <Button onClick={() => onNavigate('products')}>
                    Browse Products
                </Button>
            </div>
         </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Shipping Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                <input type="text" id="first-name" defaultValue={currentUser?.name.split(' ')[0]} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                <input type="text" id="last-name" defaultValue={currentUser?.name.split(' ')[1]} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                <input type="text" id="state" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                <input type="text" id="zip" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>
          
          {/* Right Column: Payment & Summary */}
          <div className="mt-10 lg:mt-0 space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                <ul className="divide-y divide-gray-200 mt-4">
                    {cart.map((item, index) => (
                        <li key={index} className="flex py-4">
                            <img src={item.product.imageUrl} alt={item.product.name} className="h-16 w-16 rounded-md object-cover" />
                            <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.product.name}</h3>
                                        <p className="ml-4">${item.product.price.toFixed(2)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <p>Shipping</p>
                        <p>${shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <p>Tax</p>
                        <p>${tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900 mt-2 pt-2 border-t">
                        <p>Order total</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
                        <input type="text" id="card-number" placeholder="0000 0000 0000 0000" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration (MM/YY)</label>
                            <input type="text" id="expiration-date" placeholder="MM/YY" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                            <input type="text" id="cvc" placeholder="123" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>

             <div className="mt-6">
                <Button type="submit" size="lg" fullWidth disabled={!currentUser || isLoading}>
                     {isLoading ? <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> : <LockClosedIcon className="h-5 w-5 mr-2"/>}
                     {isLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </Button>
                {!currentUser && <p className="text-center text-sm text-red-600 mt-2">Please log in to place an order.</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
