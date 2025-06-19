
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductsTab } from '@/components/admin/ProductsTab';
import { BannersTab } from '@/components/admin/BannersTab';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { ContentTab } from '@/components/admin/ContentTab';
import { DatabaseTab } from '@/components/admin/DatabaseTab';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, loading]);

  const fetchData = async () => {
    try {
      // Buscar produtos
      const { data: produtosData } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Buscar banners
      const { data: bannersData } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Buscar pedidos
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      setProdutos(produtosData || []);
      setBanners(bannersData || []);
      setPedidos(pedidosData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm onSuccess={() => window.location.reload()} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Você não tem permissão para acessar o painel administrativo.</p>
            <Button onClick={handleLogout} variant="outline">
              Voltar ao Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userEmail={user.email || ''} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab produtos={produtos} />
          </TabsContent>

          <TabsContent value="banners">
            <BannersTab banners={banners} />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab pedidos={pedidos} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
