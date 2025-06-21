
// Interface para complementos
export interface Complement {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  ativo: boolean;
}

// Interface do banco de dados para complementos
export interface DatabaseComplement {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para associação produto-complemento
export interface ProductComplement {
  id: string;
  produto_id: string;
  complemento_id: string;
  created_at: string;
}

// Função para transformar complemento do banco para frontend
export const transformDatabaseComplement = (dbComplement: DatabaseComplement): Complement => ({
  id: dbComplement.id,
  nome: dbComplement.nome,
  descricao: dbComplement.descricao,
  preco: Number(dbComplement.preco),
  categoria: dbComplement.categoria,
  ativo: dbComplement.ativo
});

// Função para transformar complemento do frontend para banco
export const transformComplementToDatabase = (complement: Omit<Complement, 'id'>): Omit<DatabaseComplement, 'id' | 'created_at' | 'updated_at'> => ({
  nome: complement.nome,
  descricao: complement.descricao,
  preco: complement.preco,
  categoria: complement.categoria,
  ativo: complement.ativo
});
