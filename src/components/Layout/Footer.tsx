import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, Home, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <Home className="h-8 w-8 text-estate-blue" />
              <span className="ml-2 text-xl font-bold text-white">Abilene Commercial</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Your trusted partner in finding the perfect home in Abilene and surrounding areas.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-white">Properties</Link>
              </li>
              <li>
                <Link to="/valuation" className="text-gray-400 hover:text-white">Home Valuation</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Areas We Serve</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Abilene</li>
              <li className="text-gray-400">Buffalo Gap</li>
              <li className="text-gray-400">Clyde</li>
              <li className="text-gray-400">Potosi</li>
              <li className="text-gray-400">Tye</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-estate-blue mr-2 mt-0.5" />
                <span className="text-gray-400">1234 Main Street, Suite 100<br />Abilene, TX 79601</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-estate-blue mr-2" />
                <span className="text-gray-400">(325) 555-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-estate-blue mr-2" />
                <span className="text-gray-400">info@abilenecommercial.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Abilene Commercial. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
