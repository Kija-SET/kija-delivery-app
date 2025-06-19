
import { useAdminBanners } from '@/hooks/useAdminBanners';

export const PromotionalBanners = () => {
  const { banners } = useAdminBanners();
  
  // Filtrar apenas banners ativos
  const activeBanners = banners.filter(banner => banner.ativo);

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🔥 Promoções Especiais
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-xl shadow-lg hover-lift cursor-pointer"
          >
            {banner.imagem_url ? (
              <img
                src={banner.imagem_url}
                alt={banner.titulo}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-r from-purple-600 to-purple-800"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-purple-800/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold">{banner.titulo}</h3>
                {banner.descricao && (
                  <p className="text-sm opacity-90">{banner.descricao}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
