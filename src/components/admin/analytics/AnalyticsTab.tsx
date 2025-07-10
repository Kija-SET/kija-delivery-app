import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Eye, 
  Users, 
  MousePointer, 
  ShoppingCart, 
  Download,
  Filter,
  RefreshCw,
  Activity
} from 'lucide-react';

export const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    event_type: '',
    date_from: '',
    date_to: ''
  });
  const [summary, setSummary] = useState({
    total_events: 0,
    unique_users: 0,
    page_views: 0,
    product_views: 0,
    cart_adds: 0,
    purchases: 0
  });
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAnalytics(data || []);

      // Calculate summary
      const events = data || [];
      const uniqueUsers = new Set(events.map(e => e.user_id || e.session_id)).size;
      const pageViews = events.filter(e => e.event_type === 'page_view').length;
      const productViews = events.filter(e => e.event_type === 'product_view').length;
      const cartAdds = events.filter(e => e.event_type === 'cart_add').length;
      const purchases = events.filter(e => e.event_type === 'purchase').length;

      setSummary({
        total_events: events.length,
        unique_users: uniqueUsers,
        page_views: pageViews,
        product_views: productViews,
        cart_adds: cartAdds,
        purchases: purchases
      });

    } catch (error: any) {
      console.error('Erro ao buscar analytics:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados de analytics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const applyFilters = () => {
    fetchAnalytics();
  };

  const clearFilters = () => {
    setFilters({
      event_type: '',
      date_from: '',
      date_to: ''
    });
  };

  const exportData = () => {
    const csvData = analytics.map(item => ({
      'Tipo de Evento': item.event_type,
      'Página': item.page_path || '',
      'Usuário': item.user_id || 'Anônimo',
      'Sessão': item.session_id,
      'Dispositivo': item.device_type || '',
      'Navegador': item.browser || '',
      'Sistema': item.os || '',
      'Data/Hora': format(new Date(item.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Sucesso',
      description: 'Dados exportados com sucesso'
    });
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'page_view': return 'bg-blue-100 text-blue-800';
      case 'product_view': return 'bg-green-100 text-green-800';
      case 'cart_add': return 'bg-orange-100 text-orange-800';
      case 'purchase': return 'bg-purple-100 text-purple-800';
      case 'search': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'page_view': return <Eye className="h-4 w-4" />;
      case 'product_view': return <MousePointer className="h-4 w-4" />;
      case 'cart_add': return <ShoppingCart className="h-4 w-4" />;
      case 'purchase': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize e analise o comportamento dos usuários
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total de Eventos</p>
                <p className="text-2xl font-bold">{summary.total_events.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Usuários Únicos</p>
                <p className="text-2xl font-bold">{summary.unique_users.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Visualizações</p>
                <p className="text-2xl font-bold">{summary.page_views.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MousePointer className="h-5 w-5 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Produtos Vistos</p>
                <p className="text-2xl font-bold">{summary.product_views.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Carrinho</p>
                <p className="text-2xl font-bold">{summary.cart_adds.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Compras</p>
                <p className="text-2xl font-bold">{summary.purchases.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="event_type">Tipo de Evento</Label>
              <select
                id="event_type"
                className="w-full p-2 border border-input rounded-md"
                value={filters.event_type}
                onChange={(e) => setFilters(prev => ({ ...prev, event_type: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="page_view">Visualização de Página</option>
                <option value="product_view">Visualização de Produto</option>
                <option value="cart_add">Adição ao Carrinho</option>
                <option value="purchase">Compra</option>
                <option value="search">Busca</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_from">Data Inicial</Label>
              <Input
                id="date_from"
                type="datetime-local"
                value={filters.date_from}
                onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_to">Data Final</Label>
              <Input
                id="date_to"
                type="datetime-local"
                value={filters.date_to}
                onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex gap-2">
                <Button onClick={applyFilters}>Aplicar</Button>
                <Button onClick={clearFilters} variant="outline">Limpar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Página/Produto</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.map((event: any) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.event_type)}
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {event.page_path || 
                         (event.metadata && typeof event.metadata === 'object' && 'product_name' in event.metadata 
                           ? (event.metadata as any).product_name 
                           : 'N/A')}
                      </TableCell>
                      <TableCell>
                        {event.user_id ? (
                          <Badge variant="outline">Logado</Badge>
                        ) : (
                          <Badge variant="secondary">Anônimo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.device_type || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};