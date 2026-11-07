import { type FC } from "react";
import Api from "@/APIS/ListaCBOS";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/material";

interface TussOption {
  id: string;
  tuss: string;
  descricao: string;
}
interface AdicionaListaTussProps {
  // A prop 'change' é uma função que recebe um array de TussOption
  // e não retorna nada (void).
  change: (value: TussOption[]) => void;
}
export const AdicionaListaTuss: FC<AdicionaListaTussProps> = ({ change }) => {
  const dadosListaCobs = useQuery(
    ["dadosListaCobs"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetListaCBOS();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaCobs.isLoading;
  const hasContent = dadosListaCobs.data?.content;
  const PaymentSkeleton = () => (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </>
  );

  return (
    <>
      {isFetching && <PaymentSkeleton />}
      {!isFetching && (
        <Autocomplete
          id="tags-standard"
          options={hasContent as TussOption[]} // Garante a tipagem correta
          multiple={false}
          getOptionLabel={(option) => option?.descricao || option?.tuss || ""}
          // Adiciona o manipulador onChange
          onChange={(_, newValue) => {
            change(newValue ? [newValue as TussOption] : []);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Especialidades"
              placeholder="Pesquisar e selecionar"
            />
          )}
        />
      )}
    </>
  );
};
