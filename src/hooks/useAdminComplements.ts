
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Complement, DatabaseComplement, transformDatabaseComplement, transformComplementToDatabase } from '@/types/complement';

export const useAdminComplements = () => {
  const [complements, setComplements] = useState<Complement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComplements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complementos')
        .select('*')
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

  const createComplement = async (complementData: Omit<Complement, 'id'>) => {
    try {
      const dbData = transformComplementToDatabase(complementData);
      const { data, error } = await supabase
        .from('complementos')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      const newComplement = transformDatabaseComplement(data);
      setComplements(prev => [newComplement, ...prev]);
      
      toast({
        title: 'Sucesso',
        description: 'Complemento criado com sucesso',
      });
      return newComplement;
    } catch (error: any) {
      console.error('Erro ao criar complemento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o complemento',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateComplement = async (id: string, complementData: Partial<Complement>) => {
    try {
      const updateData = {
        ...transformComplementToDatabase(complementData as Omit<Complement, 'id'>),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('complementos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedComplement = transformDatabaseComplement(data);
      setComplements(prev => prev.map(c => c.id === id ? updatedComplement : c));
      
      toast({
        title: 'Sucesso',
        description: 'Complemento atualizado com sucesso',
      });
      return updatedComplement;
    } catch (error: any) {
      console.error('Erro ao atualizar complemento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o complemento',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteComplement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('complementos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComplements(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: 'Sucesso',
        description: 'Complemento deletado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao deletar complemento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o complemento',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const associateComplementToProduct = async (productId: string, complementIds: string[]) => {
    try {
      // Primeiro, remove associações existentes
      await supabase
        .from('produto_complementos')
        .delete()
        .eq('produto_id', productId);

      // Depois, adiciona as novas associações
      if (complementIds.length > 0) {
        const associations = complementIds.map(complementId => ({
          produto_id: productId,
          complemento_id: complementId
        }));

        const { error } = await supabase
          .from('produto_complementos')
          .insert(associations);

        if (error) throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Complementos associados ao produto com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao associar complementos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível associar complementos ao produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchComplements();
  }, []);

  return {
    complements,
    loading,
    createComplement,
    updateComplement,
    deleteComplement,
    associateComplementToProduct,
    refetch: fetchComplements,
  };
};
