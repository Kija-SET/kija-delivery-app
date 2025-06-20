
import { useState, useEffect } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

export const Navbar = () => {
  const { isMobileMenuOpen, setMobileMenuOpen } = useStore();
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Extrair categorias únicas dos produtos
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const scrollToCategory = (category: string) => {
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(`category-${category.toLowerCase()}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(`category-${category.toLowerCase()}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 gradient-purple shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleHomeClick}>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src="/lovable-uploads/1d9a76da-3e98-488b-a1ae-c01946763f10.png"
                  alt="Açaí Kija"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white">
                <h1 className="font-bold text-lg">Açaí Kija</h1>
                <p className="text-xs text-purple-100">ABERTO até 22:00</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 transition-colors"
                  onClick={handleHomeClick}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              )}
              {isHomePage && categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="text-white hover:bg-white/20 transition-colors"
                  onClick={() => scrollToCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <Button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/20"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg animate-slide-up">
            <div className="px-4 py-6 space-y-4">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-purple-50"
                  onClick={handleHomeClick}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              )}
              {isHomePage && categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-purple-50"
                  onClick={() => scrollToCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
