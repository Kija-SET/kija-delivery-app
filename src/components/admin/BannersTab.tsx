
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

interface Banner {
  id: string;
  titulo: string;
  descricao?: string;
  ativo: boolean;
}

interface BannersTabProps {
  banners: Banner[];
}

export const BannersTab = ({ banners }: BannersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Banners Promocionais ({banners.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{banner.titulo}</h3>
                <p className="text-gray-600">{banner.descricao}</p>
              </div>
              <Badge className={banner.ativo ? "gradient-purple" : "bg-gray-100 text-gray-600"}>
                {banner.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nenhum banner cadastrado ainda.
            </p>
          )}
          <Button className="w-full" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Novo Banner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
