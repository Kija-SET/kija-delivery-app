-- Tabela para analytics e métricas do site
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'purchase', 'cart_add', etc
  page_path TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  metadata JSONB, -- dados específicos do evento
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para logs de auditoria administrativa
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  table_name TEXT, -- tabela afetada
  record_id UUID, -- ID do registro afetado
  old_values JSONB, -- valores anteriores
  new_values JSONB, -- novos valores
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para configurações avançadas do sistema
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'seo', 'analytics', 'payment', 'notifications', etc
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- se pode ser acessado publicamente
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category, key)
);

-- Tabela para notificações do sistema
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'info', 'warning', 'error', 'success'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para categorias hierárquicas de produtos
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  parent_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para variações de produtos (tamanhos, cores, etc)
CREATE TABLE public.produto_variacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL, -- 'Tamanho P', 'Cor Azul', etc
  tipo TEXT NOT NULL, -- 'size', 'color', 'flavor', etc
  valor TEXT NOT NULL, -- 'P', 'Azul', 'Chocolate', etc
  preco_adicional NUMERIC DEFAULT 0,
  estoque INTEGER DEFAULT 0,
  sku TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para reviews/avaliações de produtos
CREATE TABLE public.produto_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_categorias_parent_id ON public.categorias(parent_id);
CREATE INDEX idx_categorias_slug ON public.categorias(slug);
CREATE INDEX idx_produto_variacoes_produto_id ON public.produto_variacoes(produto_id);
CREATE INDEX idx_produto_reviews_produto_id ON public.produto_reviews(produto_id);

-- RLS Policies

-- Analytics: apenas admins podem ver dados, qualquer um pode inserir (para tracking)
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins podem ver analytics" ON public.analytics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));
CREATE POLICY "Qualquer um pode inserir analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

-- Audit Logs: apenas admins podem ver
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admins podem ver audit logs" ON public.audit_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));
CREATE POLICY "Sistema pode inserir audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- System Settings: admins podem tudo, usuários podem ver públicas
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins podem gerenciar configurações" ON public.system_settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));
CREATE POLICY "Usuários podem ver configurações públicas" ON public.system_settings
  FOR SELECT USING (is_public = true);

-- Notifications: usuários podem ver suas próprias
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver suas notificações" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins podem gerenciar notificações" ON public.notifications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));

-- Categorias: todos podem ver ativas, admins podem gerenciar
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ver categorias ativas" ON public.categorias
  FOR SELECT USING (ativo = true);
CREATE POLICY "Admins podem gerenciar categorias" ON public.categorias
  FOR ALL USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));

-- Variações de produtos: todos podem ver ativas, admins podem gerenciar
ALTER TABLE public.produto_variacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ver variações ativas" ON public.produto_variacoes
  FOR SELECT USING (ativo = true);
CREATE POLICY "Admins podem gerenciar variações" ON public.produto_variacoes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));

-- Reviews: todos podem ver aprovadas, usuários podem criar suas próprias
ALTER TABLE public.produto_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ver reviews aprovadas" ON public.produto_reviews
  FOR SELECT USING (approved = true);
CREATE POLICY "Usuários podem criar reviews" ON public.produto_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas reviews" ON public.produto_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins podem gerenciar reviews" ON public.produto_reviews
  FOR ALL USING (EXISTS (
    SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'
  ));

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produto_variacoes_updated_at BEFORE UPDATE ON public.produto_variacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produto_reviews_updated_at BEFORE UPDATE ON public.produto_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir algumas configurações padrão
INSERT INTO public.system_settings (category, key, value, description, is_public) VALUES
('seo', 'site_title', '"E-commerce Moderno"', 'Título padrão do site', true),
('seo', 'site_description', '"Loja online com os melhores produtos"', 'Descrição padrão do site', true),
('seo', 'site_keywords', '"ecommerce, loja, produtos, online"', 'Palavras-chave padrão', true),
('analytics', 'google_analytics_id', '""', 'ID do Google Analytics', false),
('analytics', 'facebook_pixel_id', '""', 'ID do Facebook Pixel', false),
('notifications', 'email_notifications', 'true', 'Ativar notificações por email', false),
('site', 'maintenance_mode', 'false', 'Modo manutenção ativo', false),
('site', 'allow_registrations', 'true', 'Permitir novos registros', true);

-- Categorias padrão
INSERT INTO public.categorias (nome, slug, descricao, ordem) VALUES
('Bebidas', 'bebidas', 'Todas as bebidas disponíveis', 1),
('Comidas', 'comidas', 'Pratos e lanches', 2),
('Sobremesas', 'sobremesas', 'Doces e sobremesas', 3);