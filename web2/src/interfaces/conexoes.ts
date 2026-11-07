/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IConexoes {
  id: number;
  nome: string;
  cnpj: number;
  online: boolean;
  match: boolean;
  length: number;
  data: any;
}

// interface Steps {
//   idConexao: 0;
//   conexao: number;
//   dataConexao: Date;
//   credito: number;
//   dataCredito: Date;
//   habilitacao: number;
//   dataHabilitacao: Date;
//   favorito: number;
//   match: boolean;
// }
export interface IConexoesSteps {
  length: number;
  // data: any;
  steps: {
    idConexao: 0;
    conexao: number;
    dataConexao: Date;
    credito: number;
    dataCredito: Date;
    habilitacao: number;
    dataHabilitacao: Date;
    favorito: number;
    match: boolean;
  };
}

export interface INovaConexao {
  length: number;
  message: string;
}

export interface IAceitarConvite {
  length: number;
  message: string;
}
export interface iRecusarConvite {
  length: number;
  message: string;
}
