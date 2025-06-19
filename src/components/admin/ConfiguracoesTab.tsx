
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';

export const ConfiguracoesTab = () => {
  const { configuracoes, updateConfiguracao, loading } = useConfiguracoes();
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (chave: string, valor: string) => {
    setEditingConfig(chave);
    setEditValue(valor);
  };

  const handleSave = async (chave: string) => {
    try {
      await updateConfiguracao(chave, editValue);
      setEditingConfig(null);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setEditValue('');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Site</CardTitle>
        <p className="text-sm text-gray-600">
          Configure as informações exibidas no banner rotativo da página inicial
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {configuracoes.map((config) => (
            <div key={config.id} className="space-y-2">
              <Label htmlFor={config.chave}>
                {config.descricao || config.chave}
              </Label>
              <div className="flex gap-2">
                {editingConfig === config.chave ? (
                  <>
                    <Input
                      id={config.chave}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleSave(config.chave)}
                      size="sm"
                      className="gradient-purple"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      id={config.chave}
                      value={config.valor}
                      readOnly
                      className="flex-1 bg-gray-50"
                    />
                    <Button
                      onClick={() => handleEdit(config.chave, config.valor)}
                      size="sm"
                      variant="outline"
                    >
                      Editar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
