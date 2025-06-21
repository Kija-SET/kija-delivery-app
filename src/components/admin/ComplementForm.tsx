
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { Complement } from '@/types/complement';
import { useToast } from '@/hooks/use-toast';

interface ComplementFormProps {
  complement?: Complement;
  onSubmit: (data: Omit<Complement, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export const ComplementForm = ({ complement, onSubmit, onCancel }: ComplementFormProps) => {
  const [formData, setFormData] = useState({
    nome: complement?.nome || '',
    descricao: complement?.descricao || '',
    preco: complement?.preco || 0,
    categoria: complement?.categoria || '',
    ativo: complement?.ativo ?? true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do complemento é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (formData.preco < 0) {
      toast({
        title: 'Erro',
        description: 'Preço não pode ser negativo',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Salvando complemento:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar complemento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Complemento *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: Granola, Leite em Pó"
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
            placeholder="0.00"
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
            <SelectItem value="frutas">Frutas</SelectItem>
            <SelectItem value="cereais">Cereais</SelectItem>
            <SelectItem value="doces">Doces</SelectItem>
            <SelectItem value="extras">Extras</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva o complemento..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Complemento ativo</Label>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 gradient-purple"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {complement ? 'Atualizar' : 'Criar'} Complemento
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
