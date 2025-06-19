
import { useState, useEffect } from 'react';
import { Clock, Star, Truck, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useStore } from '@/store/useStore';

export const RotatingBanner = () => {
  const { getConfiguracao, loading } = useConfiguracoes();
  const { setLocationModalOpen, userLocation } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Clock,
      title: 'Tempo de Entrega',
      value: getConfiguracao('tempo_entrega') || '30-50 min',
      color: 'text-purple-600'
    },
    {
      icon: Star,
      title: 'Avaliação',
      value: `${getConfiguracao('avaliacao') || '4.9'} (${getConfiguracao('total_avaliacoes') || '693'})`,
      color: 'text-yellow-500'
    },
    {
      icon: Truck,
      title: 'Taxa de Entrega',
      value: getConfiguracao('taxa_entrega') || 'Grátis',
      color: 'text-green-600'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: `${getConfiguracao('cidade_entrega') || 'Maringá, PR'} - ${getConfiguracao('distancia_loja') || '2,3 km'}`,
      color: 'text-blue-600'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden hover-lift">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-2 z-10 hover:bg-purple-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 text-center space-y-2">
          <div className={`flex items-center justify-center gap-2 ${currentSlideData.color}`}>
            <Icon className="h-6 w-6" />
            <span className="font-bold text-lg">{currentSlideData.value}</span>
          </div>
          <p className="text-sm text-gray-600">{currentSlideData.title}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-2 z-10 hover:bg-purple-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Location Action */}
      {!userLocation && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => setLocationModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            📍 Informar minha localização
          </Button>
        </div>
      )}
    </div>
  );
};
