
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, Loader2 } from 'lucide-react';
import { Banner } from '@/hooks/useAdminBanners';
import { useImageUpload } from '@/hooks/useImageUpload';

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, 'banners');
    if (imageUrl) {
      setFormData(prev => ({ ...prev, imagem_url: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          required
        />
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
        <Button type="submit" disabled={loading || uploading} className="flex-1">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {banner ? 'Atualizar' : 'Criar'} Banner
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};
