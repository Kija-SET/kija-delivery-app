
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, transformDatabaseProduct } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Buscando produtos...');
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedProducts = (data || []).map(transformDatabaseProduct);
      console.log('Produtos carregados:', transformedProducts);
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

    // Create a unique channel name to avoid conflicts
    const channelName = `produtos-changes-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Configurando listener de produtos em tempo real...', channelName);
    
    const productsChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'produtos'
        },
        (payload) => {
          console.log('Mudança nos produtos detectada:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProduct = transformDatabaseProduct(payload.new as any);
            console.log('Novo produto inserido:', newProduct);
            setProducts(prev => [newProduct, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedProduct = transformDatabaseProduct(payload.new as any);
            console.log('Produto atualizado:', updatedProduct);
            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          } else if (payload.eventType === 'DELETE') {
            console.log('Produto deletado:', payload.old);
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Removendo listener de produtos...', channelName);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  return {
    products,
    loading,
    refetch: fetchProducts,
  };
};
