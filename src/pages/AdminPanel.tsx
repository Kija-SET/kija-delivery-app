
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Upload } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState('');
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

  const executeSql = async () => {
    if (!sqlQuery.trim()) return;
    
    try {
      setSqlResult('Executando consulta...');
      
      // Para consultas SELECT simples
      if (sqlQuery.trim().toLowerCase().startsWith('select')) {
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: sqlQuery 
        });
        
        if (error) {
          setSqlResult(`Erro: ${error.message}`);
        } else {
          setSqlResult(JSON.stringify(data, null, 2));
        }
      } else {
        setSqlResult('Apenas consultas SELECT são permitidas via interface.');
      }
    } catch (error) {
      setSqlResult(`Erro: ${error.message}`);
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-purple bg-clip-text text-transparent">
              Painel Administrativo - Açaí Kija
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bem-vindo, {user.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gerenciar Produtos ({produtos.length})</CardTitle>
                  <Button className="gradient-purple">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {produtos.map((produto: any) => (
                    <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                          {produto.imagem_url ? (
                            <img 
                              src={produto.imagem_url} 
                              alt={produto.nome}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-purple-600 text-xs">Sem foto</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{produto.nome}</h3>
                          <p className="text-gray-600">R$ {produto.preco}</p>
                          <p className="text-sm text-gray-500">{produto.categoria}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={produto.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {produtos.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum produto cadastrado ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Banners Promocionais ({banners.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.map((banner: any) => (
                    <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{banner.titulo}</h3>
                        <p className="text-gray-600">{banner.descricao}</p>
                      </div>
                      <Badge className={banner.ativo ? "gradient-purple" : "bg-gray-100 text-gray-600"}>
                        {banner.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  ))}
                  {banners.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum banner cadastrado ainda.
                    </p>
                  )}
                  <Button className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Novo Banner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos em Tempo Real ({pedidos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pedidos.map((pedido: any) => (
                    <div key={pedido.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Pedido #{pedido.id.slice(0, 8)}</h3>
                        <p className="text-gray-600">Total: R$ {pedido.total}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(pedido.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge>{pedido.status}</Badge>
                    </div>
                  ))}
                  {pedidos.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum pedido registrado ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Editar Conteúdo do Site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Loja</label>
                  <Input defaultValue="Açaí Kija" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Horário de Funcionamento</label>
                  <Input defaultValue="ABERTO até 02:00" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo da Loja</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src="/lovable-uploads/1d9a76da-3e98-488b-a1ae-c01946763f10.png" 
                      alt="Logo atual" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Logo
                    </Button>
                  </div>
                </div>
                <Button className="gradient-purple">Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Consultas de Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Digite consultas SQL SELECT para visualizar dados"
                  className="min-h-32"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button className="gradient-purple" onClick={executeSql}>
                    Executar Consulta
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSqlQuery('');
                    setSqlResult('');
                  }}>
                    Limpar
                  </Button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {sqlResult || 'Resultado das consultas aparecerá aqui...'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
