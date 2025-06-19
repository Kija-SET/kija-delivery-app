
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export const ContentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Conteúdo do Site</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nome da Loja</label>
          <Input defaultValue="Açaí Kija" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Horário de Funcionamento</label>
          <Input defaultValue="ABERTO até 02:00" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Logo da Loja</label>
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/1d9a76da-3e98-488b-a1ae-c01946763f10.png" 
              alt="Logo atual" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Alterar Logo
            </Button>
          </div>
        </div>
        <Button className="gradient-purple">Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
};
