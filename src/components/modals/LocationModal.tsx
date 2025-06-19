
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';

export const LocationModal = () => {
  const { isLocationModalOpen, setLocationModalOpen, setUserLocation } = useStore();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.trim() && city.trim()) {
      setUserLocation({ state: state.trim(), city: city.trim() });
      setLocationModalOpen(false);
    }
  };

  return (
    <Dialog open={isLocationModalOpen} onOpenChange={setLocationModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-700">
            <MapPin className="h-5 w-5" />
            Onde você está?
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium text-gray-700">
              Estado
            </label>
            <Input
              id="state"
              placeholder="Ex: São Paulo"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              Cidade
            </label>
            <Input
              id="city"
              placeholder="Ex: Santos"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-purple text-white hover-lift"
          >
            <Search className="h-4 w-4 mr-2" />
            Encontrar lojas próximas
          </Button>
        </form>
        
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            📍 Encontramos uma loja a {Math.random() > 0.5 ? '1,5km' : '3,2km'} de você!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
