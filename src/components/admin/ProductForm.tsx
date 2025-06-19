
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, Loader2 } from 'lucide-react';
import { Product } from '@/hooks/useAdminProducts';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    nome: product?.nome || '',
    descricao: product?.descricao || '',
    preco: product?.preco || 0,
    categoria: product?.categoria || '',
    imagem_url: product?.imagem_url || '',
    ativo: product?.ativo ?? true,
  });
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploading } = useImageUpload();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, 'produtos');
    if (imageUrl) {
      setFormData(prev => ({ ...prev, imagem_url: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || formData.preco <= 0) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Produto *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="preco">Preço (R$) *</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            min="0"
            value={formData.preco}
            onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
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
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label>Imagem do Produto</Label>
        <div className="flex items-center space-x-4 mt-2">
          {formData.imagem_url && (
            <img 
              src={formData.imagem_url} 
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

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Produto Ativo</Label>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading || uploading} className="flex-1">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {product ? 'Atualizar' : 'Criar'} Produto
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};
