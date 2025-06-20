
import { useState } from 'react';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

// Categorias disponíveis
const categories = ['Açaí', 'Vitaminas', 'Sobremesas', 'Bebidas'];

export const Navbar = () => {
  const { isMobileMenuOpen, setMobileMenuOpen, toggleCart, getCartItemsCount } = useStore();
  const cartItemsCount = getCartItemsCount();

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 gradient-purple shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo com imagem real */}
            <div className="flex items-center space-x-3">
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

            {/* Desktop Menu com navegação funcional */}
            <div className="hidden md:flex items-center space-x-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="text-white hover:bg-white/20 transition-colors"
                  onClick={() => scrollToCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleCart}
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/20"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

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

      {/* Mobile Menu com navegação funcional */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg animate-slide-up">
            <div className="px-4 py-6 space-y-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-purple-50"
                  onClick={() => scrollToCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
