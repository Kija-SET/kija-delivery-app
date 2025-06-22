
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface ProductFormFieldsProps {
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
}

export const ProductFormFields = ({ formData, onFormDataChange }: ProductFormFieldsProps) => {
  const updateField = (field: keyof ProductFormData, value: string | number) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
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
            onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
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
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Descreva o produto..."
          rows={3}
        />
      </div>
    </>
  );
};
