
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, Loader2 } from 'lucide-react';
import { Banner } from '@/hooks/useAdminBanners';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

interface BannerFormProps {
  banner?: Banner | null;
  onSubmit: (data: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export const BannerForm = ({ banner, onSubmit, onCancel }: BannerFormProps) => {
  const [formData, setFormData] = useState({
    titulo: banner?.titulo || '',
    descricao: banner?.descricao || '',
    imagem_url: banner?.imagem_url || '',
    ativo: banner?.ativo ?? true,
  });
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Fazendo upload da imagem do banner:', file.name);
    const imageUrl = await uploadImage(file, 'banners');
    if (imageUrl) {
      console.log('Imagem do banner carregada com sucesso:', imageUrl);
      setFormData(prev => ({ ...prev, imagem_url: imageUrl }));
      toast({
        title: 'Sucesso!',
        description: 'Imagem carregada com sucesso',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      toast({
        title: 'Erro',
        description: 'Título do banner é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Salvando banner:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar banner',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancelando formulário de banner');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Ex: Super Promoção de Açaí"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva a promoção ou informação do banner..."
          rows={3}
        />
      </div>
      
      <div>
        <Label>Imagem do Banner</Label>
        <div className="flex items-center space-x-4 mt-2">
          {formData.imagem_url && (
            <img 
              src={formData.imagem_url} 
              alt="Preview" 
              className="w-32 h-20 object-cover rounded"
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
        <Label htmlFor="ativo">Banner ativo</Label>
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
          {banner ? 'Atualizar' : 'Criar'} Banner
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
