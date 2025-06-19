
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem_url?: string;
  ativo: boolean;
}

interface ProductsTabProps {
  produtos: Product[];
}

export const ProductsTab = ({ produtos }: ProductsTabProps) => {
  return (
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
          {produtos.map((produto) => (
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
  );
};
