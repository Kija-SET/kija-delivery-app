
-- Criar tabela para produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  categoria TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para banners promocionais
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para pedidos
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id),
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'recebido',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (apenas admins podem gerenciar, todos podem visualizar)
CREATE POLICY "Todos podem visualizar produtos ativos" 
  ON public.produtos 
  FOR SELECT 
  USING (ativo = true);

CREATE POLICY "Admins podem gerenciar produtos" 
  ON public.produtos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para banners (apenas admins podem gerenciar, todos podem visualizar)
CREATE POLICY "Todos podem visualizar banners ativos" 
  ON public.banners 
  FOR SELECT 
  USING (ativo = true);

CREATE POLICY "Admins podem gerenciar banners" 
  ON public.banners 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para pedidos (admins podem ver todos, usuários apenas os seus)
CREATE POLICY "Usuarios podem ver seus pedidos" 
  ON public.pedidos 
  FOR SELECT 
  USING (usuario_id = auth.uid());

CREATE POLICY "Admins podem ver todos os pedidos" 
  ON public.pedidos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins podem gerenciar pedidos" 
  ON public.pedidos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.usuarios 
    WHERE id = user_id AND role = 'admin'
  );
$$;
