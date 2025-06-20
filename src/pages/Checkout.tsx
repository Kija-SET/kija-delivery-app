
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { ArrowLeft, CreditCard, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, customerInfo, setCustomerInfo, createOrder } = useStore();
  const [formData, setFormData] = useState({
    name: customerInfo?.name || '',
    phone: customerInfo?.phone || '',
    address: customerInfo?.address || '',
    city: customerInfo?.city || '',
    state: customerInfo?.state || '',
    paymentMethod: customerInfo?.paymentMethod || 'pix'
  });

  const total = getCartTotal();
  const discountedTotal = formData.paymentMethod === 'pix' ? total * 0.95 : total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setCustomerInfo({
      ...formData,
      paymentMethod: formData.paymentMethod as 'pix' | 'card'
    });
    createOrder();
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Carrinho Vazio</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Adicione alguns itens ao carrinho antes de finalizar o pedido.</p>
            <Button onClick={() => navigate('/')} className="w-full gradient-purple">
              <Home className="h-4 w-4 mr-2" />
              Voltar para Home
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Finalizar Pedido</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Dados de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Nome completo *"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.slice(0, 100)})}
                    required
                    maxLength={100}
                  />
                  <Input
                    placeholder="Telefone *"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.slice(0, 15)})}
                    required
                    maxLength={15}
                  />
                  <Input
                    placeholder="Endereço completo *"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value.slice(0, 200)})}
                    required
                    maxLength={200}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Cidade"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value.slice(0, 50)})}
                      maxLength={50}
                    />
                    <Input
                      placeholder="Estado"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value.slice(0, 2)})}
                      maxLength={2}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Método de Pagamento</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="text-green-600 font-medium">
                          PIX (Desconto de 5% - R$ {discountedTotal.toFixed(2)})
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Cartão de Crédito/Débito</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-purple text-white"
                    size="lg"
                    disabled={!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Finalizar Pedido - R$ {discountedTotal.toFixed(2)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariation?.id || 'default'}`} className="flex justify-between items-center">
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
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  {formData.paymentMethod === 'pix' && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>-R$ {(total * 0.05).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-purple-600">R$ {discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
