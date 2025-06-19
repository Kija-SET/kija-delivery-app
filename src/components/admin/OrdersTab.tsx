
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

interface OrdersTabProps {
  pedidos: Order[];
}

export const OrdersTab = ({ pedidos }: OrdersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos em Tempo Real ({pedidos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pedidos.map((pedido) => (
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
  );
};
