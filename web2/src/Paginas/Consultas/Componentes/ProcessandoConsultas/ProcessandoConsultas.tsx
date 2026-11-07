interface Procedure {
  nome_paciente: string;
  cpf_rg: string;
  r_nascido: string;
  numero_carteira: string;
  data_nascimento: Date;
  idade: string;
  contato: string;
  convenio: string;
  unidade: string;
  local: string;
  tipo_encontro: string;
  data_consulta: Date;
  medico: string;
  medico_encaminhador: string;
  valor_receber: number;
  valor_recebido: number;
}

export interface GroupedData {
  TipoEncontro: string;
  procedimentos: Procedure[];
}

export const ProcessandoConsultas = (
  procedures: Procedure[],
): GroupedData[] => {
  const groupedMap = procedures.reduce((acc, procedure) => {
    const tipoEncontroKey =
      procedure.tipo_encontro ||
      procedure.tipo_encontro ||
      "Tipo Encontro Desconhecido";

    if (!acc.has(tipoEncontroKey)) {
      acc.set(tipoEncontroKey, []);
    }

    acc.get(tipoEncontroKey)?.push(procedure);

    return acc;
  }, new Map<string, Procedure[]>());

  const groupedArray: GroupedData[] = [];
  groupedMap.forEach((procedimentos, tipoEncontro) => {
    groupedArray.push({
      TipoEncontro: tipoEncontro,
      procedimentos: procedimentos,
    });
  });

  return groupedArray;
};
