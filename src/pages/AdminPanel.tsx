
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductsTab } from '@/components/admin/ProductsTab';
import { BannersTab } from '@/components/admin/BannersTab';
import { ComplementsTab } from '@/components/admin/ComplementsTab';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { ContentTab } from '@/components/admin/ContentTab';
import { DatabaseTab } from '@/components/admin/DatabaseTab';
import { ConfiguracoesTab } from '@/components/admin/ConfiguracoesTab';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { useAdminBanners } from '@/hooks/useAdminBanners';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart3 } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const { banners } = useAdminBanners();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      fetchPedidos();
    }
  }, [user, isAdmin, loading]);

  const fetchPedidos = async () => {
    try {
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      setPedidos(pedidosData || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      <SEOHead 
        title="Painel Administrativo"
        description="Painel de controle administrativo"
        noIndex
      />
      
      <div className="min-h-screen bg-muted/30">
        <AdminHeader 
          userEmail={user?.email || ''} 
          onLogout={handleLogout}
          onGoHome={handleGoHome}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 h-12">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="complements">Complementos</TabsTrigger>
              <TabsTrigger value="banners">Banners</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <ExecutiveDashboard />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="complements">
              <ComplementsTab />
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

            <TabsContent value="config">
              <ConfiguracoesTab />
            </TabsContent>

            <TabsContent value="database">
              <DatabaseTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
