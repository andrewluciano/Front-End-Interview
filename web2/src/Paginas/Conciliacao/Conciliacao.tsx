/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type FC, useMemo, type ReactNode } from "react";

import { Container } from "./Styles";

import Api from "./API/Conciliacao";
import { useQuery } from "react-query";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import { dateSimple, currency } from "@/helpers/format";

import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
} from "@mui/material";
import { Titulos } from "@/Componentes/Titulos";
import { HandshakeIcon } from "@phosphor-icons/react";
import { Steps } from "./Componentes/Steps";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { useModal } from "@/Autenticacao/ModalContext";
import { ModalUploadArquivos } from "@/Componentes/ModalUploadArquivos";
import { ModalConfirmacao } from "./ModalConfirmacao";
import { CutText } from "@/Componentes/CutText";

export const Conciliacao: FC = () => {
  const { openModal } = useModal();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [snackbarIcon, setSnackbarIcon] = useState<ReactNode | undefined>(
    undefined,
  );

  const handleOpenUploadModal = (tipo: string) => {
    const modalContent = <ModalUploadArquivos tipo={tipo} />;
    const TituloModal = "Upload de Arquivos";
    const SubTituloModal = "Selecione os arquivos para upload";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenConfirmacaoModal = (tipo: string) => {
    const modalContent = <ModalConfirmacao />;
    const TituloModal = "Confirmação";
    const SubTituloModal = "Tem certeza que deseja confirmar?";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const fetchConciliations = async (stage: string) => {
    const apiInstance = await Api.create();
    return await apiInstance.GetConciliations(stage);
  };

  const { data: dataPendente, isLoading: loadingPendente } = useQuery(
    ["conciliacoes", "pendente"],
    () => fetchConciliations("conciliado_pendente"),
    { keepPreviousData: false },
  );

  const { data: dataConciliado, isLoading: loadingConciliado } = useQuery(
    ["conciliacoes", "conciliado"],
    () => fetchConciliations("conciliado"),
    { keepPreviousData: false },
  );

  const rowsExtrato = dataPendente?.content || [];
  const rowsPagamentos = dataConciliado?.content || [];

  const [rowSelectionModelExtrato, setRowSelectionModelExtrato] =
    useState<GridRowSelectionModel>([]);
  const [rowSelectionModelPagamentos, setRowSelectionModelPagamentos] =
    useState<GridRowSelectionModel>([]);

  const totalEntradas = useMemo(
    () =>
      rowsExtrato.reduce(
        (acc: number, row: any) => acc + (Number(row.valor_receber) || 0),
        0,
      ),
    [rowsExtrato],
  );
  const totalSaidas = useMemo(
    () =>
      rowsPagamentos.reduce(
        (acc: number, row: any) => acc + (Number(row.valor_recebido) || 0),
        0,
      ),
    [rowsPagamentos],
  );

  const totalSelectedEntradas = useMemo(() => {
    const selectedIds = new Set(
      (Array.isArray(rowSelectionModelExtrato)
        ? rowSelectionModelExtrato
        : []
      ).map((id) => String(id)),
    );
    return rowsExtrato
      .filter((row: any) => selectedIds.has(String(row.identifier)))
      .reduce(
        (acc: number, row: any) => acc + (Number(row.valor_receber) || 0),
        0,
      );
  }, [rowsExtrato, rowSelectionModelExtrato]);

  const totalSelectedSaidas = useMemo(() => {
    const selectedIds = new Set(
      (Array.isArray(rowSelectionModelPagamentos)
        ? rowSelectionModelPagamentos
        : []
      ).map((id) => String(id)),
    );
    return rowsPagamentos
      .filter((row: any) => selectedIds.has(String(row.identifier)))
      .reduce(
        (acc: number, row: any) => acc + (Number(row.valor_recebido) || 0),
        0,
      );
  }, [rowsPagamentos, rowSelectionModelPagamentos]);

  const saldo = totalEntradas;
  const saldoConciliado = totalSelectedEntradas;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const columnsExtrato: GridColDef[] = [
    {
      field: "data_consulta",
      headerName: "Data",
      width: 130,
      flex: 0.55,
      renderCell: (params) => dateSimple(params.value),
    },
    {
      field: "nome_paciente",
      headerName: "Nome e Guia",
      width: 200,
      flex: 1.5,
      renderCell: (params) => {
        const nomePaciente = params.row?.nome_paciente?.trim?.() || "-";
        const numeroGuiaConvenio =
          params.row?.numero_guia_convenio?.trim?.() || "Sem guia";

        return (
          <Box
            sx={{
              py: 0.5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.2,
            }}
          >
            <Typography variant="body2">
              <CutText
                value={nomePaciente}
                contagem={26}
                position={undefined}
                cont={0}
                props={[]}
              />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {numeroGuiaConvenio}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "valor_receber",
      headerName: "A Receber",
      width: 100,
      type: "number",
      flex: 1,
      renderCell: (params) => currency(params.value),
    },
  ];

  const columnsPagamentos: GridColDef[] = [
    {
      field: "data_consulta",
      headerName: "Data",
      width: 130,
      flex: 0.55,
      renderCell: (params) => dateSimple(params.value) || "-",
    },
    {
      field: "nome_paciente",
      headerName: "Nome e Guia",
      width: 200,
      flex: 1.5,
      renderCell: (params) => {
        const nomePaciente =
          params.row?.nome_paciente?.trim?.() || "Nome Nome Relacionado";
        const numeroGuiaConvenio =
          params.row?.numero_guia_convenio?.trim?.() || "Sem guia";

        return (
          <Box
            sx={{
              py: 0.5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.2,
            }}
          >
            <Typography variant="body2">
              <CutText
                value={nomePaciente}
                contagem={26}
                position={undefined}
                cont={0}
                props={[]}
              />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {numeroGuiaConvenio}
            </Typography>
          </Box>
        );
      },
    },
    // { field: "tipo_encontro", headerName: "Tipo Encontro", width: 100, flex: 0.5 },
    {
      field: "valor_recebido",
      headerName: "Valor Recebido",
      width: 100,
      type: "number",
      flex: 1,
      renderCell: (params) => currency(params.value) || "-",
    },
  ];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleConciliacao = async () => {
    const fromConciliation = Array.from(
      (rowSelectionModelExtrato as any)?.ids || rowSelectionModelExtrato || [],
    );
    const toConciliation = Array.from(
      (rowSelectionModelPagamentos as any)?.ids ||
        rowSelectionModelPagamentos ||
        [],
    );

    if (fromConciliation.length === 0 || toConciliation.length === 0) {
      setSnackbarMessage(
        "Selecione pelo menos um item em cada tabela para realizar a conciliação.",
      );
      setSnackbarSeverity("warning");
      setSnackbarIcon(<TouchAppIcon fontSize="inherit" />);
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage("Conciliação em andamento...");
    setSnackbarSeverity("info");
    setSnackbarIcon(undefined);
    setSnackbarOpen(true);

    const payload = {
      from_conciliation: fromConciliation,
      to_conciliation: toConciliation,
    };

    const apiInstance = await Api.create();
    const response = await apiInstance.PostConciliation(payload);

    if (!response?.is_error) {
      setSnackbarMessage(
        response?.message || "Conciliação realizada com sucesso",
      );
      setSnackbarSeverity("success");
      setSnackbarIcon(undefined);
    } else {
      setSnackbarMessage(response?.message || "Erro ao realizar conciliação");
      setSnackbarSeverity("error");
      setSnackbarIcon(undefined);
    }
  };

  return (
    <Container>
      <Grid container size={{ sm: 12, xs: 12 }}>
        <Grid container size={{ sm: 6, xs: 12 }}>
          <Titulos
            titulo="Conciliação"
            subTitulo="Combine procedimentos realizados com os pagamentos recebidos no período."
            icone={<HandshakeIcon />}
          />
        </Grid>
        <Grid
          container
          size={{ sm: 6, xs: 12 }}
          spacing={1}
          direction="row"
          sx={{
            p: { xs: 0, sm: 1 },
            display: "flex",
            // justifyContent: "flex-end",
            alignContent: "center",
            mt: { xs: "10px", sm: "0px" },
            justifyContent: { xs: "flex-start", sm: "flex-end" },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              letterSpacing: "0px",
              fontWeight: "500",
              width: "100%",
              textAlign: { xs: "left", sm: "right" },
            }}
          >
            Modos de Conciliação:
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenConfirmacaoModal()}
            sx={{ px: 3, height: "30px" }}
          >
            {/* <AutoFixHighIcon sx={{ mr: 1 }} /> */}
            Automática
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleConciliacao()}
            sx={{ px: 3, height: "30px" }}
          >
            {/* <CallMergeIcon sx={{ mr: 1 }} /> */}
            Individual
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ display: { xs: "none", sm: "none" } }}>
        <Steps />
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          backgroundColor: "background.paper",
          p: 2,
          pb: 8,
          borderRadius: "4px",
          boxShadow: "1",
        }}
        alignItems={"flex-start"}
      >
        {/* Coluna Esquerda: A ser conciliado (Movimento do Extrato) */}
        <Grid container size={{ xs: 12, sm: 6 }}>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              gap: "15px",
            }}
            size={{ sm: 12, xs: 12 }}
          >
            <Grid
              container
              size={{ sm: 7, xs: 12 }}
              sx={{ gap: "0px", mb: 2.5 }}
            >
              <Typography variant="h6" color="primary">
                Procedimentos Realizados
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", letterSpacing: "-0.5px", }}
              >
                Arquivos de consultas e procedimentos feitos no período
              </Typography>
            </Grid>
            <Grid
              container
              size={{ sm: 5, xs: 12 }}
              sx={{ justifyContent: "flex-end", display:'none'}}
            >
              <Button
                variant="outlined"
                startIcon={<FileUploadOutlinedIcon />}
                size="small"
                onClick={() => handleOpenUploadModal("UploadAgendamento")}
              >
                Importar Procedimento
              </Button>
            </Grid>
          </Grid>

          {/* <Grid size={{sm:12}} sx={{ mb: 2, p: 1, bgcolor: '#e3f2fd', borderRadius: 1, display: 'flex', justifyContent: 'space-between' }}>
               <Typography variant="body2" fontWeight="bold">Saldo inicial: 10.000,00</Typography>
            </Grid> */}

          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rowsExtrato}
              getRowId={(row) => row.identifier}
              getRowHeight={() => "auto"}
              loading={loadingPendente}
              columns={columnsExtrato}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                fontSize: "0.78rem",
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                },
                "& .MuiDataGrid-cellContent": {
                  width: "100%",
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  justifyContent: "flex-start",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                },

                "& .MuiDataGrid-cell[data-field='valor_receber']": {
                  justifyContent: "flex-end",
                },
                "& .MuiDataGrid-cell[data-field='valor_receber'] .MuiDataGrid-cellContent":
                  {
                    textAlign: "right",
                  },

                "& .MuiDataGrid-columnHeader[data-field='valor_receber'] .MuiDataGrid-columnHeaderTitle":
                  {
                    textAlign: "right",
                  },
              }}
              density="compact"
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModelExtrato(newRowSelectionModel);
              }}
            />
          </Box>
        </Grid>

        {/* Coluna Direita: Arquivos de pagamentos (Movimento do CIGAM) */}
        <Grid container size={{ sm: 6, xs: 12 }}>
          <Grid
            container
            size={{ sm: 12, xs: 12 }}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              gap: "15px",
            }}
          >
            <Grid container size={{ sm: 7, xs: 12 }} sx={{ gap: "0px" }}>
              <Typography variant="h6" color="primary">
                Pagamentos Recebidos
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", letterSpacing: "-0.5px" }}
              >
                Envie arquivos com extratos, comprovantes ou relatórios de
                valores pagos
              </Typography>
            </Grid>
            <Grid
              container
              size={{ sm: 5, xs: 12 }}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                startIcon={<FileUploadOutlinedIcon />}
                size="small"
                onClick={() => handleOpenUploadModal("UploadPagamento")}
              >
                Importar Pagamentos
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rowsPagamentos}
              getRowId={(row) => row.identifier}
              getRowHeight={() => "auto"}
              loading={loadingConciliado}
              columns={columnsPagamentos}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
              density="compact"
              sx={{
                fontSize: "0.78rem",
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                },
                "& .MuiDataGrid-cellContent": {
                  width: "100%",
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  justifyContent: "flex-start",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                },

                "& .MuiDataGrid-cell[data-field='valor_recebido']": {
                  justifyContent: "flex-end",
                },
                "& .MuiDataGrid-cell[data-field='valor_recebido'] .MuiDataGrid-cellContent":
                  {
                    textAlign: "right",
                  },

                "& .MuiDataGrid-columnHeader[data-field='valor_recebido'] .MuiDataGrid-columnHeaderTitle":
                  {
                    textAlign: "right",
                  },
              }}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModelPagamentos(newRowSelectionModel);
              }}
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#fff3e0",
              borderRadius: 1,
              display: "none",
            }}
          >
            <Grid container spacing={1}>
              <Grid container size={{ sm: 6 }}>
                <Typography variant="body2">
                  Entradas: {formatCurrency(totalEntradas)} (
                  {rowsExtrato.length})
                </Typography>
              </Grid>
              <Grid container size={{ sm: 6 }}>
                <Typography variant="body2" align="right">
                  Saídas: {formatCurrency(totalSaidas)} ({rowsPagamentos.length}
                  )
                </Typography>
              </Grid>
              <Grid container size={{ sm: 6 }}>
                <Typography variant="body2">
                  A conciliar entradas: {formatCurrency(totalSelectedEntradas)}{" "}
                  (
                  {Array.isArray(rowSelectionModelExtrato)
                    ? rowSelectionModelExtrato.length
                    : 0}
                  )
                </Typography>
              </Grid>
              <Grid container size={{ sm: 6 }}>
                <Typography variant="body2" align="right">
                  A conciliar saídas: {formatCurrency(totalSelectedSaidas)} (
                  {Array.isArray(rowSelectionModelPagamentos)
                    ? rowSelectionModelPagamentos.length
                    : 0}
                  )
                </Typography>
              </Grid>
              <Grid container size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid container size={{ sm: 6 }}>
                <Typography variant="body2" fontWeight="bold">
                  Saldo a ser conciliado: {formatCurrency(saldoConciliado)}
                </Typography>
              </Grid>
              <Grid container size={{ sm: 6 }}>
                <Typography variant="body2" fontWeight="bold" align="right">
                  Saldo: {formatCurrency(saldo)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          icon={snackbarIcon}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
