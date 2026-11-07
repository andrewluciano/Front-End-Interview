interface Favoritos {
  id: number;
  nome: string;
  cnpj: string;
  online: boolean;
}

export interface IFavoritos {
  total: number;
  pendentes: number;
  favoritos: Favoritos[];
}
