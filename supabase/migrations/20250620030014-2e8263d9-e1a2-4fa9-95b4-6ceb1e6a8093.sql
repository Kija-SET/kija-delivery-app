
-- Criar bucket para produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true);

-- Criar bucket para banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true);

-- Políticas para bucket produtos
CREATE POLICY "Produtos são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem fazer upload de produtos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'produtos' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar produtos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'produtos' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar produtos"
ON storage.objects FOR DELETE
USING (bucket_id = 'produtos' AND auth.role() = 'authenticated');

-- Políticas para bucket banners
CREATE POLICY "Banners são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Usuários autenticados podem fazer upload de banners"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar banners"
ON storage.objects FOR UPDATE
USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar banners"
ON storage.objects FOR DELETE
USING (bucket_id = 'banners' AND auth.role() = 'authenticated');
