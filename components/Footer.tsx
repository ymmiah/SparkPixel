
import React from 'react';
import { LogoIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-1 space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-600">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-600">Blog</a>
            <a href="#" className="text-gray-500 hover:text-gray-600">Jobs</a>
            <a href="#" className="text-gray-500 hover:text-gray-600">Press</a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 flex items-center justify-center">
             <LogoIcon className="h-8 w-auto text-indigo-600 mr-2" />
            <p className="text-center text-base text-gray-500">
              &copy; {new Date().getFullYear()} Spark Pixel, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
