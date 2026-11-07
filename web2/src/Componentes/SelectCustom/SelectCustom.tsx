/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, type FC } from "react";

import { MenuItem, Select } from "@mui/material";
import { useQuery } from "react-query";

import Api from "@/APIS/Ceps";

export const SelectCustom: FC = (props: any) => {
  const Estagio = "";
  function handleChangeEstagios(event: any, child: ReactNode): void {
    throw new Error("Function not implemented.");
  }

  const dadosListaProcedimentosDashboard = useQuery(
    ["ListaProcedimentosDashboard"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetCEP("09682-100");
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaProcedimentosDashboard?.isLoading;

  const hasContent = dadosListaProcedimentosDashboard?.data ?? [];

  console.log("hasContent", hasContent);

  return (
    <Select
      labelId="EstagioLabel"
      id="demo-simple-select"
      value={Estagio}
      label="Estágios"
      onChange={handleChangeEstagios}
      variant="outlined"
      name="Estagio"
    >
      <MenuItem value="Aguardando Autorização Convênio">
        Aguardando Autorização Convênio
      </MenuItem>
      <MenuItem value="Aguardando Agendamento">Aguardando Agendamento</MenuItem>
      <MenuItem value="Aguardando Execução">Aguardando Execução</MenuItem>
      <MenuItem value="Aguardando Faturamento">Aguardando Faturamento</MenuItem>
      <MenuItem value="Negado">Negado</MenuItem>
      <MenuItem value="Glosado">Glosado</MenuItem>
      <MenuItem value="Pago">Pago</MenuItem>
    </Select>
  );
};
