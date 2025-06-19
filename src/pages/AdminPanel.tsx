
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Upload } from 'lucide-react';

export const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center gradient-purple bg-clip-text text-transparent">
              Painel Administrativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Usuário"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <Button onClick={handleLogin} className="w-full gradient-purple">
              Entrar
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
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
            >
              Sair
            </Button>
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
                  <CardTitle>Gerenciar Produtos</CardTitle>
                  <Button className="gradient-purple">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Açaí Tradicional', 'Sorvete de Chocolate', 'Guaraná Natural'].map((product) => (
                    <div key={product} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold">{product}</h3>
                          <p className="text-gray-600">R$ 12,90</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Banners Promocionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Promoção Açaí</h3>
                      <p className="text-gray-600">Pague 1, Leve 2</p>
                    </div>
                    <Badge className="gradient-purple">Ativo</Badge>
                  </div>
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
                <CardTitle>Pedidos em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['#001', '#002', '#003'].map((order) => (
                    <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Pedido {order}</h3>
                        <p className="text-gray-600">João Silva - R$ 25,80</p>
                      </div>
                      <Badge>Em preparo</Badge>
                    </div>
                  ))}
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
                <CardTitle>Operações de Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Digite comandos SQL (SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, TRUNCATE, ALTER)"
                  className="min-h-32"
                />
                <div className="flex space-x-2">
                  <Button className="gradient-purple">Executar</Button>
                  <Button variant="outline">Limpar</Button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Resultado das consultas aparecerá aqui...
                  </p>
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
