export interface IListaProcedimentos {
  content: {
    IdProcedimento: string;
    CodProcedimento: string;
    DataProcedimento: Date;
    StatusProcedimento: number;
    Estagio: number;
    Paciente: string;
    Medico: string;
    Procedimento: string;
    Convenio: string;
    Plano: string;
    ValorEstimado: number;
    ValorRecebido: number;
    ValorGlosado: number;
    PrazoProcedimentoEstagioLimite: Date;
    Progresso: number;
  };
}
export interface IAdicionaProcedimentos {
  CodProcedimento: string;
  DataProcedimento: Date;
  StatusProcedimento: number;
  Estagio: number;
  Paciente: string;
  Medico: string;
  Procedimento: string;
  Convenio: string;
  Plano: string;
  ValorEstimado: number;
  ValorRecebido: number;
  ValorGlosado: number;
  PrazoProcedimentoEstagioLimite: Date;
  Progresso: number;
}
