
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthProvider';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { signIn } = useAuth();

  // Credenciais de acesso administrativo
  const adminEmail = 'dw12021996@gmail.com';
  const adminPassword = '44991512466+';

  const handleQuickAccess = () => {
    setEmail(adminEmail);
    setPassword(adminPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verificar se são as credenciais de admin especiais
    if (email === adminEmail && password === adminPassword) {
      // Acesso direto para o admin
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Verificar se o usuário já existe
        const { data: existingUser } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', adminEmail)
          .single();

        if (!existingUser) {
          // Criar usuário admin se não existir
          const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true
          });

          if (authError) {
            setError('Erro ao criar conta admin: ' + authError.message);
            setLoading(false);
            return;
          }

          // Criar perfil do usuário admin
          if (authUser.user) {
            const { error: profileError } = await supabase
              .from('usuarios')
              .insert({
                id: authUser.user.id,
                email: authUser.user.email!,
                role: 'admin'
              });

            if (profileError) {
              console.error('Erro ao criar perfil admin:', profileError);
            }
          }
        }

        // Fazer login
        const { error: loginError } = await signIn(email, password);
        if (loginError) {
          setError('Erro no login: ' + loginError.message);
        } else {
          onSuccess?.();
        }
      } catch (err) {
        setError('Erro ao processar acesso administrativo');
      }
      setLoading(false);
      return;
    }

    if (isSignUp) {
      // Para cadastro, usar a API de admin do Supabase
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        });

        if (error) {
          setError('Erro ao criar conta: ' + error.message);
          setLoading(false);
          return;
        }

        // Criar perfil do usuário
        if (data.user) {
          const { error: profileError } = await supabase
            .from('usuarios')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              role: 'admin'
            });

          if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
          }
        }

        setError(null);
        alert('Conta criada com sucesso! Agora você pode fazer login.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      } catch (err) {
        setError('Erro ao criar conta');
      }
    } else {
      // Login normal
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos');
        } else {
          setError('Erro ao fazer login. Tente novamente.');
        }
      } else {
        onSuccess?.();
      }
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/1d9a76da-3e98-488b-a1ae-c01946763f10.png" 
            alt="Açaí Kija Logo" 
            className="h-16 w-auto"
          />
        </div>
        <CardTitle className="gradient-purple bg-clip-text text-transparent">
          {isSignUp ? 'Criar Conta Admin' : 'Login Administrativo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleQuickAccess}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              🚀 Acesso Administrativo Rápido
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Clique para preencher automaticamente as credenciais de admin
            </p>
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder={isSignUp ? "Senha (mínimo 6 caracteres)" : "Senha"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignUp ? 6 : undefined}
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-purple"
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Criando...' : 'Entrando...') : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setEmail('');
                setPassword('');
              }}
              disabled={loading}
              className="text-purple-600 hover:text-purple-800"
            >
              {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar conta'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
