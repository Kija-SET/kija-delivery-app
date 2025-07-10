import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardStats {
  totalViews: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  avgOrderValue: number;
  topProducts: any[];
  recentActivity: any[];
  analyticsData: any[];
  revenueData: any[];
}

export const ExecutiveDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    topProducts: [],
    recentActivity: [],
    analyticsData: [],
    revenueData: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7); // últimos 7 dias
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange);

      // Analytics data
      const { data: analytics } = await supabase
        .from('analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Orders data
      const { data: orders } = await supabase
        .from('pedidos')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Products data
      const { data: products } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true);

      // Process analytics data
      const pageViews = analytics?.filter(a => a.event_type === 'page_view') || [];
      const productViews = analytics?.filter(a => a.event_type === 'product_view') || [];
      const uniqueUsers = new Set(analytics?.map(a => a.user_id || a.session_id)).size;

      // Process revenue data
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0;
      const conversionRate = pageViews.length ? (orders?.length || 0) / pageViews.length * 100 : 0;

      // Group data by day for charts
      const analyticsGrouped = groupByDay(pageViews, dateRange);
      const revenueGrouped = groupOrdersByDay(orders || [], dateRange);

      // Top products by views
      const productViewCounts: any = {};
      productViews.forEach(view => {
        const productId = view.metadata && typeof view.metadata === 'object' && 'product_id' in view.metadata 
          ? (view.metadata as any).product_id : null;
        if (productId) {
          productViewCounts[productId] = (productViewCounts[productId] || 0) + 1;
        }
      });

      const topProducts = Object.entries(productViewCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([productId, views]) => {
          const product = products?.find(p => p.id === productId);
          return {
            id: productId,
            name: product?.nome || 'Produto não encontrado',
            views,
            revenue: orders?.filter(o => o.id === productId).reduce((sum, o) => sum + Number(o.total), 0) || 0
          };
        });

      // Recent activity
      const recentActivity = analytics?.slice(-10).reverse().map(item => ({
        id: item.id,
        type: item.event_type,
        description: getActivityDescription(item),
        timestamp: item.created_at,
        user: item.user_id ? 'Usuário logado' : 'Visitante'
      })) || [];

      setStats({
        totalViews: pageViews.length,
        totalUsers: uniqueUsers,
        totalOrders: orders?.length || 0,
        totalRevenue,
        conversionRate,
        avgOrderValue,
        topProducts,
        recentActivity,
        analyticsData: analyticsGrouped,
        revenueData: revenueGrouped
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do dashboard',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const groupByDay = (data: any[], days: number) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayData = data.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= dayStart && itemDate <= dayEnd;
      });

      result.push({
        date: format(date, 'dd/MM', { locale: ptBR }),
        views: dayData.length,
        users: new Set(dayData.map(d => d.user_id || d.session_id)).size
      });
    }
    return result;
  };

  const groupOrdersByDay = (orders: any[], days: number) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const revenue = dayOrders.reduce((sum, order) => sum + Number(order.total), 0);

      result.push({
        date: format(date, 'dd/MM', { locale: ptBR }),
        orders: dayOrders.length,
        revenue
      });
    }
    return result;
  };

  const getActivityDescription = (item: any) => {
    switch (item.event_type) {
      case 'page_view':
        return `Visualizou ${item.page_path}`;
      case 'product_view':
        return `Visualizou produto: ${item.metadata && typeof item.metadata === 'object' && 'product_name' in item.metadata ? (item.metadata as any).product_name : 'N/A'}`;
      case 'cart_add':
        return `Adicionou produto ao carrinho`;
      case 'purchase':
        return `Realizou compra de R$ ${item.metadata && typeof item.metadata === 'object' && 'value' in item.metadata ? (item.metadata as any).value : 0}`;
      default:
        return item.event_type;
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "default" }: any) => (
    <Card className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${
          color === 'green' ? 'text-green-600' :
          color === 'blue' ? 'text-blue-600' :
          color === 'purple' ? 'text-purple-600' :
          color === 'orange' ? 'text-orange-600' :
          'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {trendValue} desde o último período
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
          <p className="text-muted-foreground">
            Visão geral dos últimos {dateRange} dias
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange(7)}
            className={dateRange === 7 ? 'bg-primary text-primary-foreground' : ''}
          >
            7 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange(30)}
            className={dateRange === 30 ? 'bg-primary text-primary-foreground' : ''}
          >
            30 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange(90)}
            className={dateRange === 90 ? 'bg-primary text-primary-foreground' : ''}
          >
            90 dias
          </Button>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Visualizações"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="Usuários Únicos"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Pedidos"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.conversionRate.toFixed(2)}%
            </div>
            <p className="text-muted-foreground text-sm">
              Visitantes que realizaram compras
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              R$ {stats.avgOrderValue.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-sm">
              Valor médio por pedido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Tráfego</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="products">Top Produtos</TabsTrigger>
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações e Usuários</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita e Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="orders" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Produtos Mais Visualizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.views} visualizações
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">receita</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};