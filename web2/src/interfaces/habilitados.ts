// interface HabilitadosData {
//   idConvenio: number;
//   nome: string;
//   cnpj: string;
//   online: boolean;
// }
export interface IHabilitados {
  totalRecords: number;
  totalPages: number;
  data: {
    idConvenio: number;
    nome: string;
    cnpj: string;
    online: boolean;
  };
}

export interface IFavoritarHabilitados {
  message: string;
}
export interface IDesfavoritarHabilitados {
  message: string;
}
