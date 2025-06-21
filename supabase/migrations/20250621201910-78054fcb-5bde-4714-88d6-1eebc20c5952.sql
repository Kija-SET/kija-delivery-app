
-- Criar tabela para complementos
CREATE TABLE public.complementos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC NOT NULL DEFAULT 0,
  categoria TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para associar produtos com complementos
CREATE TABLE public.produto_complementos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  complemento_id UUID NOT NULL REFERENCES public.complementos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(produto_id, complemento_id)
);

-- Habilitar Row Level Security
ALTER TABLE public.complementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_complementos ENABLE ROW LEVEL SECURITY;

-- Políticas para complementos (público para leitura, admin para escrita)
CREATE POLICY "Complementos são visíveis para todos" 
  ON public.complementos 
  FOR SELECT 
  USING (true);

CREATE POLICY "Apenas admins podem gerenciar complementos" 
  ON public.complementos 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para produto_complementos
CREATE POLICY "Associações são visíveis para todos" 
  ON public.produto_complementos 
  FOR SELECT 
  USING (true);

CREATE POLICY "Apenas admins podem gerenciar associações" 
  ON public.produto_complementos 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'));

-- Configurar Realtime para sincronização automática
ALTER TABLE public.produtos REPLICA IDENTITY FULL;
ALTER TABLE public.complementos REPLICA IDENTITY FULL;
ALTER TABLE public.produto_complementos REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação do Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.produtos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.complementos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.produto_complementos;
