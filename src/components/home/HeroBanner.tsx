
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { RotatingBanner } from './RotatingBanner';

export const HeroBanner = () => {
  const { setLocationModalOpen, userLocation } = useStore();

  return (
    <div className="relative overflow-hidden gradient-purple-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          {/* Logo Central - Maior e Circular */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl hover-lift border-4 border-white">
              <img
                src="/lovable-uploads/1d9a76da-3e98-488b-a1ae-c01946763f10.png"
                alt="Açaí Kija"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Banner Rotativo Único */}
          <div className="max-w-lg mx-auto">
            <RotatingBanner />
          </div>

          {/* Location Info */}
          {userLocation && (
            <div className="bg-white rounded-lg p-4 shadow-md max-w-md mx-auto">
              <p className="text-sm text-gray-600">
                📍 Entregando em <strong>{userLocation.city}, {userLocation.state}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
