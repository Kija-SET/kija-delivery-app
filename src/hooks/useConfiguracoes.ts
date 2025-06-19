
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export const useConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfiguracoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave');

      if (error) throw error;
      setConfiguracoes(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguracao = async (chave: string, valor: string) => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .update({ valor, updated_at: new Date().toISOString() })
        .eq('chave', chave)
        .select()
        .single();

      if (error) throw error;

      setConfiguracoes(prev => 
        prev.map(config => config.chave === chave ? data : config)
      );

      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada com sucesso',
      });
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a configuração',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getConfiguracao = (chave: string) => {
    return configuracoes.find(config => config.chave === chave)?.valor || '';
  };

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  return {
    configuracoes,
    loading,
    updateConfiguracao,
    getConfiguracao,
    refetch: fetchConfiguracoes,
  };
};
