
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, Edit, Trash2, Plus } from 'lucide-react';
import { useAdminBanners, Banner } from '@/hooks/useAdminBanners';
import { useImageUpload } from '@/hooks/useImageUpload';

interface BannersTabProps {
  banners: Banner[];
}

export const BannersTab = ({ banners }: BannersTabProps) => {
  const { createBanner, updateBanner, deleteBanner, toggleBannerStatus } = useAdminBanners();
  const { uploadImage, uploading } = useImageUpload();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem_url: '',
    ativo: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
      } else {
        await createBanner(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    const imageUrl = await uploadImage(file, 'banners');
    if (imageUrl) {
      setFormData(prev => ({ ...prev, imagem_url: imageUrl }));
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      imagem_url: '',
      ativo: true,
    });
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      titulo: banner.titulo,
      descricao: banner.descricao || '',
      imagem_url: banner.imagem_url || '',
      ativo: banner.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
    }
  };

  const handleToggleStatus = async (id: string, ativo: boolean) => {
    try {
      await toggleBannerStatus(id, !ativo);
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Banners Promocionais ({banners.length})</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </DialogTitle>
            </DialogHeader>
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
                <Label htmlFor="imagem">Imagem do Banner</Label>
                <Input
                  id="imagem"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploading}
                />
                {formData.imagem_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.imagem_url} 
                      alt="Preview" 
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                />
                <Label htmlFor="ativo">Banner ativo</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Enviando...' : editingBanner ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {banner.imagem_url && (
                  <img 
                    src={banner.imagem_url} 
                    alt={banner.titulo}
                    className="w-16 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{banner.titulo}</h3>
                  <p className="text-gray-600 text-sm">{banner.descricao}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={banner.ativo ? "gradient-purple" : "bg-gray-100 text-gray-600"}>
                  {banner.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(banner.id, banner.ativo)}
                >
                  {banner.ativo ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(banner)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o banner "{banner.titulo}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(banner.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nenhum banner cadastrado ainda.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
