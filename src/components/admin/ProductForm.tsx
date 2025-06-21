
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'featured'>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    image: product?.image || '',
  });
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Fazendo upload da imagem:', file.name);
    const imageUrl = await uploadImage(file, 'produtos');
    if (imageUrl) {
      console.log('Imagem carregada com sucesso:', imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast({
        title: 'Sucesso!',
        description: 'Imagem carregada com sucesso',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do produto é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: 'Erro',
        description: 'Preço deve ser maior que zero',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Salvando produto:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancelando formulário de produto');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Açaí 500ml"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="acai">Açaí</SelectItem>
            <SelectItem value="complementos">Complementos</SelectItem>
            <SelectItem value="bebidas">Bebidas</SelectItem>
            <SelectItem value="sobremesas">Sobremesas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva o produto..."
          rows={3}
        />
      </div>

      <div>
        <Label>Imagem do Produto</Label>
        <div className="flex items-center space-x-4 mt-2">
          {formData.image && (
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button type="button" variant="outline" disabled={uploading} asChild>
                <span>
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploading ? 'Enviando...' : 'Selecionar Imagem'}
                </span>
              </Button>
            </Label>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button 
          type="submit" 
          disabled={loading || uploading} 
          className="flex-1 gradient-purple"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {product ? 'Atualizar' : 'Criar'} Produto
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel} 
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
