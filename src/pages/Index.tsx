
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroBanner } from '@/components/home/HeroBanner';
import { PromotionalBanners } from '@/components/home/PromotionalBanners';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ProductCatalog } from '@/components/menu/ProductCatalog';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { LocationModal } from '@/components/modals/LocationModal';
import { ProductModal } from '@/components/modals/ProductModal';
import { BackToTop } from '@/components/ui/BackToTop';
import { useStore } from '@/store/useStore';

const Index = () => {
  const { userLocation, setLocationModalOpen } = useStore();

  useEffect(() => {
    // Show location modal on first visit if no location is set
    if (!userLocation) {
      setTimeout(() => {
        setLocationModalOpen(true);
      }, 1000);
    }
  }, [userLocation, setLocationModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-16">
        <HeroBanner />
        <PromotionalBanners />
        <FeaturedProducts />
        <ProductCatalog />
      </main>

      {/* Modals and Drawers */}
      <LocationModal />
      <ProductModal />
      <CartDrawer />
      
      {/* Floating Elements */}
      <FloatingCart />
      <BackToTop />
    </div>
  );
};

export default Index;
