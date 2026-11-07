/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC, useRef, useState } from "react";
import { Container } from "./Styles";
import { Titulos } from "@/Componentes/Titulos";
import { dateTime, date } from "@/helpers/format";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  Paper,
  Chip,
  InputAdornment,
  Stack,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import IosShareIcon from "@mui/icons-material/IosShare";
import Api from "./API/Relatorios";
import { useQuery } from "react-query";
import { CutText } from "@/Componentes/CutText";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

// Mock Data
const summaryData = {
  cobrado: 0,
  recebido: 0,
  glosa: 0,
  percentual_glosa: 0,
  percentual_glosa_level: "default",
  percentual_glosa_msg:
    "Nenhum valor foi recebido até agora, adicione arquivos ou troque os status para Finalizado.",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getStatusColor = (
  status: string,
): "success" | "error" | "warning" | "default" => {
  switch (status) {
    case "Pago":
      return "success";
    case "Conciliado":
      return "success";
    case "Glosa":
      return "error";
    case "Pendente":
      return "warning";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Conciliado":
      return <CheckCircleIcon fontSize="small" />;
    case "Glosa":
      return <ErrorIcon fontSize="small" />;
    case "Pendente":
      return <AccessTimeIcon fontSize="small" />;
    default:
      return undefined;
  }
};

export const Relatorios: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter1, setFilter1] = useState("Todos");
  const [filter2, setFilter2] = useState("Todos");
  const selectedIdentifiersRef = useRef<string[]>([]);
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>([]);

  const LoadSummary = useQuery(
    ["ListaSummary"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetSummary();
      return response;
    },
    { keepPreviousData: false },
  );

  const isFetchingSummary = LoadSummary?.isLoading;
  const hasContentSummary = LoadSummary?.data?.content[0] ?? summaryData;

  const LoadReport = useQuery(
    ["ListaReport"],
    async () => {
      const apiInstance = await Api.create();

      const filtros = {
        filtros: {
          busca_paciente: "",
          convenio_id: "",
          status: "Todos",
          periodo: {
            inicio: "",
            fim: "",
          },
        },
        paginacao: {
          pagina_atual: 1,
          itens_por_pagina: 10,
        },
      };

      const response = await apiInstance.GetRelatorios(filtros);
      return response;
    },
    { keepPreviousData: false },
  );

  const isFetching = LoadReport?.isLoading;
  const hasContent = LoadReport?.data?.content ?? [];

  const rows = hasContent.map((row, index) => ({
    ...row,
    id: row.id ?? index,
  }));

  const remover = () => {
    console.log("selectedIdentifiers", selectedIdentifiersRef.current);
  };

  const columns: GridColDef[] = [
    {
      field: "paciente",
      headerName: "Paciente",
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
        <strong>
          <CutText
            value={params.value || "N/A"}
            contagem={25}
            props={[]}
            position={undefined}
            cont={0}
          />
        </strong>
      ),
    },
    {
      field: "procedimento",
      headerName: "Procedimento",
      flex: 1.2,
      minWidth: 132,
      valueGetter: (value) => value || "N/A",
    },
    {
      field: "convenio",
      headerName: "Convênio",
      flex: 0.5,
      minWidth: 105,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{ borderRadius: 1 }}
        />
      ),
      sortable: false,
    },
    {
      field: "dataProc",
      headerName: "Dt Procedimento",
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (params.value ? dateTime(params.value) : "N/A"),
      sortable: false,
    },
    {
      field: "dataConc",
      headerName: "Pagamento",
      flex: 0.55,
      minWidth: 115,
      renderCell: (params) => (params.value ? date(params.value) : "N/A"),
      sortable: false,
    },
    {
      field: "cobrado",
      headerName: "Cobrado",
      type: "number",
      flex: 0.55,
      minWidth: 115,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatCurrency(Number(value ?? 0)),
    },
    {
      field: "recebido",
      headerName: "Recebido",
      type: "number",
      flex: 0.55,
      minWidth: 115,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => formatCurrency(Number(params.value ?? 0)),
    },
    {
      field: "glosa",
      headerName: "Glosa",
      type: "number",
      flex: 0.55,
      minWidth: 115,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const value = Number(params.value ?? 0);
        return value > 0 ? formatCurrency(value) : "—";
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ fontWeight: "bold", px: 0.5 }}
        />
      ),
      sortable: false,
    },
  ];

  const PaymentSkeleton = () => (
    <Grid
      container
      sx={{
        overflowX: "auto",
        flexWrap: "nowrap",
        flexDirection: "row",
        flexGrow: 1,
        gap: "5px",
        pb: 1,
        width: "100%",
        height: "87.5px",
      }}
    >
      <Grid
        container
        size={{ xs: 12, md: 2 }}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "background.paper",
          p: 2,
          boxShadow: 1,
        }}
      >
        <LinearProgress sx={{ width: "200px" }} />
      </Grid>
      <Grid
        container
        size={{ xs: 12, md: 2 }}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "background.paper",
          p: 2,
          boxShadow: 1,
        }}
      >
        <LinearProgress sx={{ width: "200px" }} />
      </Grid>
      <Grid
        container
        size={{ xs: 12, md: 2 }}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "background.paper",
          p: 2,
          boxShadow: 1,
        }}
      >
        <LinearProgress sx={{ width: "200px" }} />
      </Grid>
    </Grid>
  );


  function CustomToolbar() {
  return (
    <GridToolbarContainer>
      {/* Seu botão personalizado */}
      <Button
        color="primary"
        startIcon={<DeleteForeverIcon />}
        onClick={remover}
        disabled={selectedIdentifiers.length === 0}
      >
        Excluir
      </Button>
      
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

  return (
    <Container container spacing={0.2}>
      <Titulos titulo="Histórico" icone={undefined} />

      <Grid
        size={{ xs: 12, sm: 12 }}
        sx={{ overflowX: "auto", maxWidth: "95vw", height: "85px" }}
      >
        {isFetchingSummary && <PaymentSkeleton />}

        {hasContentSummary && !isFetchingSummary && (
          <Grid
            container
            sx={{
              overflowX: "auto",
              flexWrap: "nowrap",
              flexDirection: "row",
              flexGrow: 1,
              gap: "5px",
              pb: 0.5,
              width: "100%",
            }}
          >
            <Grid
              container
              size={{ xs: 12, md: 2 }}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "background.paper",
                p: 2,
                boxShadow: 1,
                borderRadius:1
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  COBRADO
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(hasContentSummary.cobrado)}
                </Typography>
              </Box>
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 2 }}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "background.paper",
                p: 2,
                boxShadow: 1,
                borderRadius:1
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  RECEBIDO
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(hasContentSummary.recebido)}
                </Typography>
              </Box>
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 2 }}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "background.paper",
                p: 2,
                boxShadow: 1,
                borderRadius:1
              }}
            >
              <Tooltip
                title={
                  hasContentSummary.glosa !== 0
                    ? ""
                    : hasContentSummary.percentual_glosa_msg
                }
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    GLOSA{" "}
                    <Chip
                      label={hasContentSummary.percentual_glosa + "%"}
                      size="small"
                      sx={{ fontSize: "0.65rem", p: 0, height: "15px" }}
                      color={
                        hasContentSummary.percentual_glosa_level === "error"
                          ? "error"
                          : "success"
                      }
                    ></Chip>
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(hasContentSummary.glosa)}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid
        container
        size={{ xs: 12, sm: 12 }}
        spacing={0}
        sx={{ p: 0, display: "none" }}
      >
        <Typography variant="body2" color="text.secondary">
          {hasContent.length} resultados
        </Typography>
      </Grid>
      {/* Table */}
      <Grid container size={{ xs: 12, sm: 12 }}>
        <Grid
          container
          sx={{
            overflowX: "auto",
            flexWrap: "nowrap",
            flexDirection: "row",
            flexGrow: 1,
            gap: "10px",
            pb: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              p: 0,
              m: 0,
              width: "100%",
              height: "calc(100vh - 350px)",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              loading={Boolean(isFetching)}
              disableRowSelectionOnClick
              showToolbar
              checkboxSelection
              slots={{
                toolbar: CustomToolbar,
              }}              
              onRowSelectionModelChange={(
                newRowSelectionModel: GridRowSelectionModel,
              ) => {
                const selectedRowIds =
                  "ids" in newRowSelectionModel
                    ? Array.from(newRowSelectionModel.ids)
                    : Array.isArray(newRowSelectionModel)
                      ? newRowSelectionModel
                      : [];

                selectedIdentifiersRef.current = rows.flatMap((row) =>
                  selectedRowIds.includes(row.id) &&
                  (row.identifier != null || row.id != null)
                    ? [String(row.identifier ?? row.id)]
                    : [],
                );
                setSelectedIdentifiers(selectedIdentifiersRef.current);
              }}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              sx={{
                m: 0,
                p: 0,
                "& .MuiDataGrid-cell, & .MuiDataGrid-cellContent": {
                  fontSize: "0.72rem",
                },
                '& .MuiDataGrid-toolbarContainer': {
                  '& .MuiButton-root': {
                    fontSize: '0.75rem',
                    color: '#333',
                    ':last-child': {
                      mr:1
                    }
                  }
                }                
              }}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
           />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
