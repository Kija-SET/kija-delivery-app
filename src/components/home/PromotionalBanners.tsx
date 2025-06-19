
import { promotionalBanners } from '@/data/products';

export const PromotionalBanners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🔥 Promoções Especiais
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotionalBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-xl shadow-lg hover-lift animate-pulse cursor-pointer"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-purple-800/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold">{banner.title}</h3>
                <p className="text-sm opacity-90">{banner.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
