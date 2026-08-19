import React from 'react';
import Button from '../components/Button';
import { UserIcon, LoaderIcon, CheckCircleIcon, PrintIcon } from '../components/icons';
import { useAppContext } from '../contexts/AppContext';
import { Page, Product } from '../types';

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { currentUser, orders, logout, isLoading, login } = useAppContext();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="text-xs text-slate-500">Access your saved custom designs, past print orders, and invoices.</p>
        <div className="pt-2">
          <Button onClick={() => login('user-1')}>Log In with Demo Account</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md shadow-indigo-500/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                Verified Pro
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email} • {currentUser.company || 'Spark Pixel Member'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('products')}>
            + New Custom Project
          </Button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Order History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Order History & Invoices</h2>
          <span className="text-xs font-semibold text-slate-500">{orders.length} orders total</span>
        </div>

        <div className="space-y-4">
          {isLoading && orders.length === 0 ? (
            <div className="flex justify-center items-center h-40 bg-white rounded-2xl border border-slate-200">
              <LoaderIcon className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-sm font-bold text-slate-700">No print orders placed yet.</p>
              <p className="text-xs text-slate-400 mt-1">Start customizing business cards or merchandise today.</p>
              <div className="mt-4">
                <Button size="sm" onClick={() => onNavigate('products')}>
                  Explore Products →
                </Button>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-400 font-medium">Order ID:</span>
                      <span className="font-extrabold text-slate-900 ml-1">#{order.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Date:</span>
                      <span className="font-semibold text-slate-700 ml-1">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.trackingNumber && (
                      <span className="text-[11px] font-medium text-slate-500">
                        Tracking: <span className="font-mono text-indigo-600">{order.trackingNumber}</span>
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : order.status === 'In Production'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.previewImageUrl}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.product.name}</p>
                          <p className="text-slate-500 text-[11px]">
                            {item.quantity} units {item.selectedFinishName ? `• ${item.selectedFinishName}` : ''} {item.selectedCornerName ? `• ${item.selectedCornerName}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-slate-900 text-sm">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          (${item.unitPrice.toFixed(2)} / ea)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Total & Reorder */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Shipping: <span className="font-semibold text-slate-800">{order.shippingMethod}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-semibold">Total Paid:</span>
                    <span className="text-lg font-black text-indigo-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
