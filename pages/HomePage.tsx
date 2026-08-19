import React from 'react';
import { Page } from '../types';
import Button from '../components/Button';
import { UploadIcon, DesignIcon, PrintIcon, CheckCircleIcon } from '../components/icons';

interface HomePageProps {
  onNavigate: (page: Page, payload?: { category?: string }) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      name: '1. Upload Your Art',
      description: 'Start with your own masterpiece. Upload any design or photo in seconds.',
      icon: UploadIcon,
    },
    {
      name: '2. Customize Your Product',
      description: 'Use our intuitive design studio to place, resize, and add text to your product.',
      icon: DesignIcon,
    },
    {
      name: '3. Order & Receive',
      description: 'We print with premium quality and ship directly to your door. Satisfaction guaranteed.',
      icon: PrintIcon,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Bring Your <span className="text-indigo-600">Ideas</span> to Life.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          High-quality custom printing for t-shirts, mugs, posters, and more. Create your unique products today with our easy-to-use design tools.
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={() => onNavigate('products')}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* How it Works Section */}
      <section>
        <div className="py-12 bg-white rounded-xl shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Create in three simple steps
              </p>
            </div>
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

       {/* Why Choose Us Section */}
      <section className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Why Spark Pixel?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium">Premium Quality</h3>
            <p className="mt-2 text-sm text-gray-500">Vibrant, durable prints on high-quality materials.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium">Fast Turnaround</h3>
            <p className="mt-2 text-sm text-gray-500">Quick processing and shipping to get your order fast.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium">No Minimums</h3>
            <p className="mt-2 text-sm text-gray-500">Order just one or one thousand. The choice is yours.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium">Eco-Friendly</h3>
            <p className="mt-2 text-sm text-gray-500">We use sustainable inks and practices whenever possible.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;