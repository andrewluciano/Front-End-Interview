export interface IDetalheOperacao {
  CodOperacao: number;
  DataOperacao: Date;
  StatusOperacao: string;
  Financiador: string;
  ValorBruto: number;
  NumeroTitulos: number;
  Comprador: string;
  Fornecedor: string;
  Bordero: number;
  Sacados: {
    CodBordero: number;
    NumeroNota: number;
    Sacado: string;
    CNPJ: string;
    Contato: string;
    ContatoEmail: string;
    ValorBruto: number;
    Data: Date;
    Confirmado: true;
    Operado: false;
  };
}
