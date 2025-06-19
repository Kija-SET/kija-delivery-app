
import { Clock, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { storeInfo } from '@/data/products';

export const HeroBanner = () => {
  const { setLocationModalOpen, userLocation } = useStore();

  return (
    <div className="relative overflow-hidden gradient-purple-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Bem-vindo ao Açaí Kija! 🍇
            </h1>
            <p className="text-lg text-gray-700">
              Os melhores açaís e sorvetes artesanais da região
            </p>
          </div>

          {/* Store Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-md hover-lift">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">{storeInfo.estimatedDelivery}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Tempo de entrega</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md hover-lift">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">{storeInfo.rating}</span>
                <span className="text-sm text-gray-600">({storeInfo.reviewCount})</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Avaliação</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md hover-lift">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Truck className="h-5 w-5" />
                <span className="font-semibold">
                  {storeInfo.deliveryFee === 0 ? 'Grátis' : `R$ ${storeInfo.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Entrega</p>
            </div>
          </div>

          {/* Location Info */}
          {userLocation ? (
            <div className="bg-white rounded-lg p-4 shadow-md max-w-md mx-auto">
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
