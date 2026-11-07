import { type FC } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

// 1. Definição do Tipo para o Item TUSS
interface TussItem {
  id: number;
  codigoTuss: string;
  descricao: string;
  grupo: string;
  porte: number; // Exemplo de Porte (número)
}

// 2. Dados de Exemplo (Rows)
const initialTussRows: GridRowsProp<TussItem> = [
  {
    id: 1,
    codigoTuss: "10101012",
    descricao: "Consulta médica em consultório",
    grupo: "Consultas e Visitas",
    porte: 4,
  },
  {
    id: 2,
    codigoTuss: "20101017",
    descricao: "Radiografia do tórax - 1 incidência",
    grupo: "Diagnóstico por Imagem",
    porte: 2,
  },
  {
    id: 3,
    codigoTuss: "30101027",
    descricao: "Hemograma completo",
    grupo: "Laboratório",
    porte: 1,
  },
  {
    id: 4,
    codigoTuss: "40301013",
    descricao: "Diálise Peritoneal Crônica (por sessão)",
    grupo: "Procedimentos Terapêuticos",
    porte: 5,
  },
  {
    id: 5,
    codigoTuss: "10102019",
    descricao: "Visita hospitalar diária (por paciente)",
    grupo: "Consultas e Visitas",
    porte: 3,
  },
];

// 3. Definição das Colunas (Columns)
const columns: GridColDef<TussItem>[] = [
  {
    field: "codigoTuss",
    headerName: "Cód",
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    field: "descricao",
    headerName: "Descrição do Procedimento",
    flex: 1, // Ocupa o espaço restante
    minWidth: 350,
  },
  {
    field: "grupo",
    headerName: "Grupo",
    width: 200,
    type: "singleSelect",
    valueOptions: [
      "Consultas e Visitas",
      "Diagnóstico por Imagem",
      "Laboratório",
      "Procedimentos Terapêuticos",
    ],
  },
  {
    field: "porte",
    headerName: "Porte",
    type: "number",
    width: 90,
  },
];

// 4. Componente Tuss
export const Tuss: FC = () => {
  return (
    <Grid container spacing={1} direction="row">
      <Grid
        container
        size={{ sm: 12 }}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid>
          <Typography variant="h6">Procedimentos</Typography>
        </Grid>
        <Grid>
          <Typography variant="caption">Lista carregada pelo ANS</Typography>
        </Grid>
      </Grid>

      <Grid container size={{ sm: 12 }}>
        <Box sx={{ height: 400, width: "100%", maxWidth: "95vw" }}>
          <DataGrid
            rows={initialTussRows}
            columns={columns}
            showToolbar
            getRowId={(row) => row.codigoTuss}
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
    </Grid>
  );
};
