
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Building, Search, BarChart2, Phone, Home } from 'lucide-react';
import UserMenu from './UserMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const isMobile = useIsMobile();
  
  // Function to close the menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 my-0">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Building className="h-8 w-8 text-estate-blue" />
              <span className="ml-2 text-xl font-bold text-foreground">Texas Commercial</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="px-3 py-2 text-sm font-medium text-foreground hover:text-estate-blue">Home</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/properties" className="px-3 py-2 text-sm font-medium text-foreground hover:text-estate-blue">Properties</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/valuation" className="px-3 py-2 text-sm font-medium text-foreground hover:text-estate-blue">Valuation</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className="px-3 py-2 text-sm font-medium text-foreground hover:text-estate-blue">Contact</Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="ml-4 flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
          
          {/* Mobile navigation trigger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-estate-blue hover:bg-background focus:outline-none" 
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="flex flex-col h-full">
            {/* Mobile menu header with close button */}
            <div className="px-4 py-4 flex items-center justify-between border-b">
              <Link to="/" className="flex-shrink-0 flex items-center" onClick={handleLinkClick}>
                <Building className="h-8 w-8 text-estate-blue" />
                <span className="ml-2 text-xl font-bold text-foreground">Texas Commercial</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-estate-blue"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {/* Mobile menu links */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center px-4 py-3 text-lg font-medium text-foreground hover:text-estate-blue hover:bg-secondary rounded-md"
                  onClick={handleLinkClick}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Home
                </Link>
                <Link 
                  to="/properties" 
                  className="flex items-center px-4 py-3 text-lg font-medium text-foreground hover:text-estate-blue hover:bg-secondary rounded-md"
                  onClick={handleLinkClick}
                >
                  <Search className="h-5 w-5 mr-3" />
                  Properties
                </Link>
                <Link 
                  to="/valuation" 
                  className="flex items-center px-4 py-3 text-lg font-medium text-foreground hover:text-estate-blue hover:bg-secondary rounded-md"
                  onClick={handleLinkClick}
                >
                  <BarChart2 className="h-5 w-5 mr-3" />
                  Valuation
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center px-4 py-3 text-lg font-medium text-foreground hover:text-estate-blue hover:bg-secondary rounded-md"
                  onClick={handleLinkClick}
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Contact
                </Link>
              </div>
            </div>
            
            {/* Mobile menu footer */}
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <UserMenu />
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
