
import { Clock, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { storeInfo } from '@/data/products';

export const HeroBanner = () => {
  const { setLocationModalOpen, userLocation } = useStore();

  return (
    <div className="relative overflow-hidden gradient-purple-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center space-y-4">
          {/* Logo Central */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg hover-lift">
              <img
                src="/lovable-uploads/1d9a76da-3e98-488b-a1ae-c01946763f10.png"
                alt="Açaí Kija"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Store Info Cards - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-3 shadow-md hover-lift">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Clock className="h-4 w-4" />
                <span className="font-semibold text-sm">{storeInfo.estimatedDelivery}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Tempo de entrega</p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-md hover-lift">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-sm">{storeInfo.rating}</span>
                <span className="text-xs text-gray-600">({storeInfo.reviewCount})</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Avaliação</p>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-md hover-lift">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Truck className="h-4 w-4" />
                <span className="font-semibold text-sm">
                  {storeInfo.deliveryFee === 0 ? 'Grátis' : `R$ ${storeInfo.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Entrega</p>
            </div>
          </div>

          {/* Location Info */}
          {userLocation ? (
            <div className="bg-white rounded-lg p-3 shadow-md max-w-md mx-auto">
              <p className="text-sm text-gray-600">
                📍 Entregando em <strong>{userLocation.city}, {userLocation.state}</strong>
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Loja mais próxima: {storeInfo.distance}
              </p>
            </div>
          ) : (
            <Button
              onClick={() => setLocationModalOpen(true)}
              className="gradient-purple text-white hover-lift"
              size="lg"
            >
              📍 Informar minha localização
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
