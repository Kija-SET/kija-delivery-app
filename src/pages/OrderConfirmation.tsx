
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusSteps = [
  { status: 'received', label: 'Pedido Recebido', icon: CheckCircle, time: 0 },
  { status: 'preparing', label: 'Em Preparo', icon: Package, time: 10 },
  { status: 'out-for-delivery', label: 'Saiu para Entrega', icon: Truck, time: 25 },
  { status: 'delivered', label: 'Entregue', icon: CheckCircle, time: 35 }
];

export const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { currentOrder } = useStore();
  const [currentStatus, setCurrentStatus] = useState('received');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        // Atualizar status baseado no tempo
        if (newTime >= 35) {
          setCurrentStatus('delivered');
        } else if (newTime >= 25) {
          setCurrentStatus('out-for-delivery');
        } else if (newTime >= 10) {
          setCurrentStatus('preparing');
        }
        
        return newTime;
      });
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [currentOrder, navigate]);

  if (!currentOrder) {
    return null;
  }

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600">
            Pedido #{currentOrder.id} • Entrega estimada: 35 minutos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const IconComponent = step.icon;
                  
                  return (
                    <div
                      key={step.status}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCompleted ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {step.time === 0 ? 'Agora' : `${step.time} min`}
                        </p>
                      </div>
                      {isCurrent && (
                        <Badge className="gradient-purple">
                          Em andamento
                        </Badge>
                      )}
                      {isCompleted && index < currentStatusIndex && (
                        <Badge variant="secondary">
                          Concluído
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  ⏱️ Tempo decorrido: {elapsedTime} minutos
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Estimativa de entrega: {35 - elapsedTime} minutos restantes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentOrder.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                      {item.selectedVariation && (
                        <p className="text-xs text-purple-600">{item.selectedVariation.name}</p>
                      )}
                    </div>
                    <span className="font-semibold">R$ {item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">R$ {currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Cliente:</strong> {currentOrder.customerInfo.name}</p>
                  <p><strong>Telefone:</strong> {currentOrder.customerInfo.phone}</p>
                  <p><strong>Endereço:</strong> {currentOrder.customerInfo.address}</p>
                  <p><strong>Cidade:</strong> {currentOrder.customerInfo.city}, {currentOrder.customerInfo.state}</p>
                  <p><strong>Pagamento:</strong> {currentOrder.customerInfo.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => navigate('/')}
              className="w-full gradient-purple"
              size="lg"
            >
              Fazer Novo Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
