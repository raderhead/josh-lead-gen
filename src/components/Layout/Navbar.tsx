
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, BarChart2, Phone } from 'lucide-react';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-estate-blue" />
              <span className="ml-2 text-xl font-bold text-estate-dark-blue">Abilene Commercial</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-estate-blue">Home</Link>
              <Link to="/properties" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-estate-blue">Properties</Link>
              <Link to="/valuation" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-estate-blue">Valuation</Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-estate-blue">Contact</Link>
            </div>
            <div className="ml-4 flex items-center">
              <UserMenu />
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <UserMenu />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-estate-blue hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-3" />
                Home
              </div>
            </Link>
            <Link 
              to="/properties"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-estate-blue hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-3" />
                Properties
              </div>
            </Link>
            <Link 
              to="/valuation"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-estate-blue hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3" />
                Valuation
              </div>
            </Link>
            <Link 
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-estate-blue hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                Contact
              </div>
            </Link>
            <div className="px-3 py-2">
              <Button className="w-full bg-estate-blue hover:bg-estate-dark-blue">
                (325) 555-1234
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
