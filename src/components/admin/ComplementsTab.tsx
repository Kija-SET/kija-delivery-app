
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAdminComplements } from '@/hooks/useAdminComplements';
import { ComplementForm } from './ComplementForm';
import { Complement } from '@/types/complement';
import { useToast } from '@/hooks/use-toast';

export const ComplementsTab = () => {
  const { complements, loading, createComplement, updateComplement, deleteComplement } = useAdminComplements();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComplement, setEditingComplement] = useState<Complement | null>(null);
  const [deletingComplement, setDeletingComplement] = useState<Complement | null>(null);
  const { toast } = useToast();

  const handleCreateComplement = async (complementData: Omit<Complement, 'id'>) => {
    try {
      console.log('Criando complemento:', complementData);
      await createComplement(complementData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao criar complemento:', error);
    }
  };

  const handleUpdateComplement = async (complementData: Omit<Complement, 'id'>) => {
    if (!editingComplement) return;
    try {
      console.log('Atualizando complemento:', editingComplement.id, complementData);
      await updateComplement(editingComplement.id, complementData);
      setEditingComplement(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar complemento:', error);
    }
  };

  const handleDeleteComplement = async () => {
    if (!deletingComplement) return;
    try {
      console.log('Deletando complemento:', deletingComplement.id);
      await deleteComplement(deletingComplement.id);
      setDeletingComplement(null);
    } catch (error) {
      console.error('Erro ao deletar complemento:', error);
    }
  };

  const handleEdit = (complement: Complement) => {
    console.log('Editando complemento:', complement);
    setEditingComplement(complement);
    setIsFormOpen(true);
  };

  const handleDelete = (complement: Complement) => {
    console.log('Preparando para deletar complemento:', complement);
    setDeletingComplement(complement);
  };

  const handleAddNew = () => {
    console.log('Abrindo formulário para novo complemento');
    setEditingComplement(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    console.log('Cancelando formulário');
    setIsFormOpen(false);
    setEditingComplement(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciar Complementos ({complements.length})</CardTitle>
            <Button onClick={handleAddNew} className="gradient-purple">
              <Plus className="h-4 w-4 mr-2" />
              Novo Complemento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {complements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum complemento cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complements.map((complement) => (
                <Card key={complement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{complement.nome}</h3>
                      <Badge className={complement.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {complement.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    {complement.descricao && (
                      <p className="text-sm text-gray-600 mb-2">{complement.descricao}</p>
                    )}
                    <p className="text-lg font-bold text-purple-600 mb-3">
                      R$ {complement.preco.toFixed(2)}
                    </p>
                    {complement.categoria && (
                      <p className="text-xs text-purple-600 mb-3 uppercase tracking-wide">
                        {complement.categoria}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(complement)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(complement)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação/Edição */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCancelForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingComplement ? 'Editar Complemento' : 'Novo Complemento'}
            </DialogTitle>
          </DialogHeader>
          <ComplementForm
            complement={editingComplement}
            onSubmit={editingComplement ? handleUpdateComplement : handleCreateComplement}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingComplement} onOpenChange={() => setDeletingComplement(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o complemento "{deletingComplement?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingComplement(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComplement}
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
