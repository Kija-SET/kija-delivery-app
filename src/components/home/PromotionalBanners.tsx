
import { BannerPreview } from '@/components/admin/BannerPreview';

export const PromotionalBanners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🔥 Promoções Especiais
      </h2>
      
      <BannerPreview showControls={false} />
    </section>
  );
};
