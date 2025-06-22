
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAdminComplements } from '@/hooks/useAdminComplements';
import { supabase } from '@/integrations/supabase/client';

interface ProductComplementsSectionProps {
  productId?: string;
  selectedComplements: string[];
  onComplementsChange: (complementIds: string[]) => void;
}

export const ProductComplementsSection = ({ 
  productId, 
  selectedComplements, 
  onComplementsChange 
}: ProductComplementsSectionProps) => {
  const { complements } = useAdminComplements();

  // Carregar complementos associados ao produto se estiver editando
  useEffect(() => {
    if (productId) {
      const loadProductComplements = async () => {
        try {
          const { data } = await supabase
            .from('produto_complementos')
            .select('complemento_id')
            .eq('produto_id', productId);
          
          if (data) {
            onComplementsChange(data.map(item => item.complemento_id));
          }
        } catch (error) {
          console.error('Erro ao carregar complementos do produto:', error);
        }
      };
      
      loadProductComplements();
    }
  }, [productId, onComplementsChange]);

  const handleComplementToggle = (complementId: string, checked: boolean) => {
    if (checked) {
      onComplementsChange([...selectedComplements, complementId]);
    } else {
      onComplementsChange(selectedComplements.filter(id => id !== complementId));
    }
  };

  return (
    <div>
      <Label>Complementos Disponíveis</Label>
      <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-4 space-y-2">
        {complements.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum complemento disponível</p>
        ) : (
          complements.map((complement) => (
            <div key={complement.id} className="flex items-center space-x-2">
              <Checkbox
                id={`complement-${complement.id}`}
                checked={selectedComplements.includes(complement.id)}
                onCheckedChange={(checked) => handleComplementToggle(complement.id, checked as boolean)}
              />
              <Label htmlFor={`complement-${complement.id}`} className="flex-1 cursor-pointer">
                {complement.nome} - R$ {complement.preco.toFixed(2)}
                {complement.categoria && (
                  <span className="text-xs text-gray-500 ml-2">({complement.categoria})</span>
                )}
              </Label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
