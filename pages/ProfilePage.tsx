import React from 'react';
import Button from '../components/Button';
import { UserIcon, LoaderIcon } from '../components/icons';
import { useAppContext } from '../contexts/AppContext';
import { Page } from '../types';

interface ProfilePageProps {
    onNavigate: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, orders, logout, isLoading, login } = useAppContext();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };
  
  if (!currentUser) {
      return (
          <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Please log in</h2>
              <p className="mt-2 text-gray-500">Log in to view your profile and order history.</p>
              <div className="mt-6">
                  <Button onClick={() => login('user-1')}>Log In</Button>
              </div>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
            <p className="text-gray-500">{currentUser.email}</p>
        </div>
      </div>

      {/* Order History */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
        <div className="bg-white rounded-lg shadow-md">
            {isLoading && orders.length === 0 ? (
                 <div className="flex justify-center items-center h-40">
                    <LoaderIcon className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : orders.length === 0 ? (
                <p className="text-center text-gray-500 p-8">You haven't placed any orders yet.</p>
            ) : (
                <ul role="list" className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <li key={order.id} className="p-4 sm:p-6 hover:bg-gray-50">
                            <div className="flex items-center sm:justify-between sm:gap-4 flex-wrap">
                                <div className="flex-1 min-w-[150px]">
                                    <p className="font-bold text-indigo-600">{order.id}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto text-left sm:text-right mt-2 sm:mt-0">
                                    <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </section>
      
      <div className="text-center">
        <Button variant="secondary" onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
