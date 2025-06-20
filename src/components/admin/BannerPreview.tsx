
import { useAdminBanners } from '@/hooks/useAdminBanners';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface BannerPreviewProps {
  onEdit?: (banner: any) => void;
  onDelete?: (banner: any) => void;
  onToggleStatus?: (banner: any) => void;
  showControls?: boolean;
}

export const BannerPreview = ({ 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showControls = false 
}: BannerPreviewProps) => {
  const { banners } = useAdminBanners();
  
  // Filtrar apenas banners ativos para preview
  const activeBanners = showControls ? banners : banners.filter(banner => banner.ativo);

  if (activeBanners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {showControls ? 'Nenhum banner cadastrado ainda.' : 'Nenhum banner ativo para exibir.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {showControls ? 'Preview dos Banners' : 'Banners Promocionais'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-xl shadow-lg hover-lift"
          >
            {banner.imagem_url ? (
              <img
                src={banner.imagem_url}
                alt={banner.titulo}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-r from-purple-600 to-purple-800"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-purple-800/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="text-xl font-bold">{banner.titulo}</h4>
                {banner.descricao && (
                  <p className="text-sm opacity-90">{banner.descricao}</p>
                )}
              </div>
            </div>
            
            {showControls && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={() => onToggleStatus?.(banner)}
                  title={banner.ativo ? 'Desativar' : 'Ativar'}
                >
                  {banner.ativo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={() => onEdit?.(banner)}
                  title="Editar"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700"
                  onClick={() => onDelete?.(banner)}
                  title="Excluir"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {showControls && !banner.ativo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">INATIVO</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
