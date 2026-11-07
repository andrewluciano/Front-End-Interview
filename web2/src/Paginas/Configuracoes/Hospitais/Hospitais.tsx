import { type FC } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

import Api from "../API/Hospitais";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

// 1. Definição do Tipo para o Objeto Hospital
interface Hospital {
  id: number;
  nome: string;
  ativo: boolean;
  uf: string;
  cidade: string;
  regiao: "Norte" | "Sul" | "Leste" | "Oeste";
}

// 2. Dados de Exemplo (Rows)
// const initialRows: GridRowsProp<Hospital> = [
//   {
//     identifier: 1,
//     nome: "Hospital Central",
//     ativo: true,
//     uf: "SP",
//     cidade: "São Paulo",
//     regiao: "Leste",
//   },
//   {
//     identifier: 2,
//     nome: "Clínica Saúde",
//     ativo: false,
//     uf: "RJ",
//     cidade: "Rio de Janeiro",
//     regiao: "Sul",
//   },
//   {
//     identifier: 3,
//     nome: "Maternidade Sol",
//     ativo: true,
//     uf: "MG",
//     cidade: "Belo Horizonte",
//     regiao: "Norte",
//   },
//   {
//     identifier: 4,
//     nome: "Pronto Socorro Oeste",
//     ativo: true,
//     uf: "PR",
//     cidade: "Curitiba",
//     regiao: "Oeste",
//   },
//   {
//     identifier: 5,
//     nome: "Hospital Universitário",
//     ativo: true,
//     uf: "BA",
//     cidade: "Salvador",
//     regiao: "Norte",
//   },
// ];

// 3. Definição das Colunas (Columns)
const columns: GridColDef<Hospital>[] = [
  { field: "identifier", headerName: "ID", width: 90 },
  { field: "tipo", headerName: "Tipo", width: 150 },
  {
    field: "razao_social",
    headerName: "razao_social",
    width: 130,
    flex: 1,
    type: "singleSelect", // Permite seleção única para filtros e edição
    valueOptions: ["Norte", "Sul", "Leste", "Oeste"],
  },
  {
    field: "convenios",
    headerName: "convenios",
    width: 170,
    flex: 1,
    sortable: true,
    filterable: true,
  },
  {
    field: "endereco_cep",
    headerName: "CEP",
    width: 150,
  },

  {
    field: "active",
    headerName: "Ativo",
    type: "boolean", // Tipo booleano
    width: 90,
    editable: true,
  },
];

export const Hospitais: FC = () => {
  const dadosListaHospitais = useQuery(
    ["listaHospitais"],

    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetHospitais();
      return response;
    },
    { keepPreviousData: true },
  );
  const isFetching = dadosListaHospitais?.isLoading;

  const hasContent = dadosListaHospitais?.data?.content ?? [];

  const PaymentSkeleton = () => (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </>
  );

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      sx={{ flexDirection: "column" }}
    >
      <Grid
        container
        size={{ sm: 12 }}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid size={{ sm: 12 }}>
          <Typography variant="h6">Lista Hospitais</Typography>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ display: "none" }}
          >
            Adicionar Hospital
          </Button>
        </Grid>
      </Grid>
      {isFetching && <PaymentSkeleton />}
      {!isFetching && (
        <Grid container size={{ sm: 12 }}>
          <Box sx={{ height: 400, width: "100%", maxWidth: "95vw" }}>
            <DataGrid
              rows={hasContent}
              columns={columns}
              showToolbar
              getRowId={(row) => row.identifier}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};
