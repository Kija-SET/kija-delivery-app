
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, transformDatabaseProduct } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedProducts = (data || []).map(transformDatabaseProduct);
      setProducts(transformedProducts);
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    refetch: fetchProducts,
  };
};
