
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

// Configurações padrão hardcoded por enquanto
const defaultConfiguracoes: Configuracao[] = [
  {
    id: '1',
    chave: 'tempo_entrega',
    valor: '30-50 min',
    descricao: 'Tempo estimado de entrega',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    chave: 'avaliacao',
    valor: '4.9',
    descricao: 'Avaliação da loja',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    chave: 'total_avaliacoes',
    valor: '693',
    descricao: 'Total de avaliações recebidas',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    chave: 'taxa_entrega',
    valor: 'Grátis',
    descricao: 'Taxa de entrega',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    chave: 'cidade_entrega',
    valor: 'Maringá, PR',
    descricao: 'Cidade de entrega atual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    chave: 'distancia_loja',
    valor: '2,3 km',
    descricao: 'Distância da loja mais próxima',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>(defaultConfiguracoes);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateConfiguracao = async (chave: string, valor: string) => {
    try {
      setConfiguracoes(prev => 
        prev.map(config => 
          config.chave === chave 
            ? { ...config, valor, updated_at: new Date().toISOString() }
            : config
        )
      );

      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada com sucesso',
      });
      
      return configuracoes.find(c => c.chave === chave);
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

  return {
    configuracoes,
    loading,
    updateConfiguracao,
    getConfiguracao,
    refetch: () => {},
  };
};
