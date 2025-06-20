
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface AdminHeaderProps {
  userEmail: string;
  onLogout: () => void;
  onGoHome: () => void;
}

export const AdminHeader = ({ userEmail, onLogout, onGoHome }: AdminHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-purple bg-clip-text text-transparent">
            Painel Administrativo - Açaí Kija
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bem-vindo, {userEmail}
            </span>
            <Button variant="outline" onClick={onGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
