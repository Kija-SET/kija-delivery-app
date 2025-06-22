
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Complement, DatabaseComplement, transformDatabaseComplement } from '@/types/complement';
import { useToast } from '@/hooks/use-toast';

export const useComplements = () => {
  const [complements, setComplements] = useState<Complement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComplements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complementos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedComplements = (data || []).map(transformDatabaseComplement);
      setComplements(transformedComplements);
    } catch (error: any) {
      console.error('Erro ao buscar complementos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os complementos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplementsByProduct = async (productId: string): Promise<Complement[]> => {
    try {
      const { data, error } = await supabase
        .from('produto_complementos')
        .select(`
          complemento_id,
          complementos!inner(*)
        `)
        .eq('produto_id', productId);

      if (error) throw error;

      return (data || [])
        .map(item => item.complementos)
        .filter(Boolean)
        .map(transformDatabaseComplement);
    } catch (error: any) {
      console.error('Erro ao buscar complementos do produto:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchComplements();

    // Create a unique channel name to avoid conflicts
    const channelName = `complementos-changes-${Math.random().toString(36).substr(2, 9)}`;
    
    const complementsChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complementos'
        },
        (payload) => {
          console.log('Mudança nos complementos detectada:', payload);
          fetchComplements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(complementsChannel);
    };
  }, []);

  return {
    complements,
    loading,
    getComplementsByProduct,
    refetch: fetchComplements,
  };
};
