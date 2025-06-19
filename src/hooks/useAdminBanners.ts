
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Banner {
  id: string;
  titulo: string;
  descricao?: string;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar banners:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os banners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([bannerData])
        .select()
        .single();

      if (error) throw error;

      setBanners(prev => [data, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Banner criado com sucesso',
      });
      return data;
    } catch (error: any) {
      console.error('Erro ao criar banner:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o banner',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateBanner = async (id: string, bannerData: Partial<Banner>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update({ ...bannerData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBanners(prev => prev.map(b => b.id === id ? data : b));
      toast({
        title: 'Sucesso',
        description: 'Banner atualizado com sucesso',
      });
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar banner:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o banner',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBanners(prev => prev.filter(b => b.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Banner deletado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao deletar banner:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o banner',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleBannerStatus = async (id: string, ativo: boolean) => {
    return updateBanner(id, { ativo });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    loading,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    refetch: fetchBanners,
  };
};
