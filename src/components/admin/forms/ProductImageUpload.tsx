
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export const ProductImageUpload = ({ imageUrl, onImageChange }: ProductImageUploadProps) => {
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Fazendo upload da imagem:', file.name);
    const uploadedImageUrl = await uploadImage(file, 'produtos');
    if (uploadedImageUrl) {
      console.log('Imagem carregada com sucesso:', uploadedImageUrl);
      onImageChange(uploadedImageUrl);
      toast({
        title: 'Sucesso!',
        description: 'Imagem carregada com sucesso',
      });
    }
  };

  return (
    <div>
      <Label>Imagem do Produto</Label>
      <div className="flex items-center space-x-4 mt-2">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="w-16 h-16 rounded-lg object-cover"
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
  );
};
