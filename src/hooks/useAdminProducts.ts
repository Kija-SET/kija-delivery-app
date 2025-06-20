
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, DatabaseProduct, transformDatabaseProduct, transformProductToDatabase } from '@/types/product';

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const dbProducts = data || [];
      setDatabaseProducts(dbProducts);
      setProducts(dbProducts.map(transformDatabaseProduct));
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'featured'>) => {
    try {
      const dbData = transformProductToDatabase(productData);
      const { data, error } = await supabase
        .from('produtos')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      const newProduct = transformDatabaseProduct(data);
      setProducts(prev => [newProduct, ...prev]);
      setDatabaseProducts(prev => [data, ...prev]);
      
      toast({
        title: 'Sucesso',
        description: 'Produto criado com sucesso',
      });
      return newProduct;
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updateData = {
        ...transformProductToDatabase(productData as Omit<Product, 'id' | 'featured'>),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('produtos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct = transformDatabaseProduct(data);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      setDatabaseProducts(prev => prev.map(p => p.id === id ? data : p));
      
      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso',
      });
      return updatedProduct;
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      setDatabaseProducts(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: 'Sucesso',
        description: 'Produto deletado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao deletar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleProductStatus = async (id: string, ativo: boolean) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update({ ativo, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct = transformDatabaseProduct(data);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      setDatabaseProducts(prev => prev.map(p => p.id === id ? data : p));
      
      toast({
        title: 'Sucesso',
        description: `Produto ${ativo ? 'ativado' : 'desativado'} com sucesso`,
      });
      return updatedProduct;
    } catch (error: any) {
      console.error('Erro ao alterar status do produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getActiveProductIds = () => {
    return databaseProducts.filter(p => p.ativo).map(p => p.id);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    databaseProducts,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getActiveProductIds,
    refetch: fetchProducts,
  };
};
