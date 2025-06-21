
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useAdminBanners, Banner } from '@/hooks/useAdminBanners';
import { BannerPreview } from './BannerPreview';
import { BannerForm } from './BannerForm';
import { useToast } from '@/hooks/use-toast';

interface BannersTabProps {
  banners: Banner[];
}

export const BannersTab = ({ banners }: BannersTabProps) => {
  const { createBanner, updateBanner, deleteBanner, toggleBannerStatus } = useAdminBanners();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Salvando banner:', bannerData);
      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
        toast({
          title: 'Sucesso!',
          description: 'Banner atualizado com sucesso',
        });
      } else {
        await createBanner(bannerData);
        toast({
          title: 'Sucesso!',
          description: 'Banner criado com sucesso',
        });
      }
      
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar banner',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    console.log('Resetando formulário de banner');
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    console.log('Editando banner:', banner);
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;
    try {
      console.log('Deletando banner:', deletingBanner.id);
      await deleteBanner(deletingBanner.id);
      setDeletingBanner(null);
      toast({
        title: 'Sucesso!',
        description: 'Banner excluído com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir banner',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      console.log('Alterando status do banner:', banner.id, 'para:', !banner.ativo);
      await toggleBannerStatus(banner.id, !banner.ativo);
      toast({
        title: 'Sucesso!',
        description: `Banner ${!banner.ativo ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao alterar status do banner',
        variant: 'destructive',
      });
    }
  };

  const handleAddNew = () => {
    console.log('Abrindo formulário para novo banner');
    resetForm();
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    console.log('Cancelando formulário de banner');
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciar Banners Promocionais ({banners.length})</CardTitle>
            <Button onClick={handleAddNew} className="gradient-purple">
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BannerPreview
            showControls={true}
            onEdit={handleEdit}
            onDelete={setDeletingBanner}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      {/* Modal de Criação/Edição */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCancelForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Editar Banner' : 'Novo Banner'}
            </DialogTitle>
          </DialogHeader>
          <BannerForm
            banner={editingBanner}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingBanner} onOpenChange={() => setDeletingBanner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o banner "{deletingBanner?.titulo}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingBanner(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
