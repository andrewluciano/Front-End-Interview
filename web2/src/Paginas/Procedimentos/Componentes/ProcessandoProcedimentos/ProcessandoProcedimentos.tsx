interface Procedure {
  ValorEstimado: number;
  deleted_at: string | null;
  Paciente: string;
  created_at: string;
  ValorRecebido: number;
  assistant_message: string;
  ValorGlosado: number;
  StatusProcedimento: string;
  Procedimento: string;
  Progresso: string;
  Medico: string;
  DataProcedimento: string;
  Plano: string;
  Estagio: string;
  Convenio: string;
  updated_at: string;
  Descricao: string;
  CodProcedimento: string;
  PrazoProcedimentoEstagioLimite: string;
  Documentos: unknown[];
  Pendencias: unknown[];
  estagio?: string;
}

export interface GroupedData {
  Estagio: string;
  procedimentos: Procedure[];
}

export const ProcessandoProcedimentos = (
  procedures: Procedure[],
): GroupedData[] => {
  const groupedMap = procedures.reduce((acc, procedure) => {
    const estagioKey =
      procedure.Estagio || procedure.estagio || "Estágio Desconhecido";

    if (!acc.has(estagioKey)) {
      acc.set(estagioKey, []);
    }

    acc.get(estagioKey)?.push(procedure);

    return acc;
  }, new Map<string, Procedure[]>());

  const groupedArray: GroupedData[] = [];
  groupedMap.forEach((procedimentos, estagio) => {
    groupedArray.push({
      Estagio: estagio,
      procedimentos: procedimentos,
    });
  });

  return groupedArray;
};
