
// Interface padrão para produtos (frontend)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

// Interface do banco de dados
export interface DatabaseProduct {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Função para transformar produto do banco para frontend
export const transformDatabaseProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.nome,
  description: dbProduct.descricao || '',
  price: Number(dbProduct.preco),
  image: dbProduct.imagem_url || '/placeholder.svg',
  category: dbProduct.categoria || '',
  featured: false
});

// Função para transformar produto do frontend para banco
export const transformProductToDatabase = (product: Omit<Product, 'id' | 'featured'>): Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'> => ({
  nome: product.name,
  descricao: product.description,
  preco: product.price,
  categoria: product.category,
  imagem_url: product.image,
  ativo: true
});
