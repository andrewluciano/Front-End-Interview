import {
  Alert,
  Box,
  Button,
  Grid,
  useMediaQuery,
  Tabs,
  Tab,
} from "@mui/material";
import { useState, type FC } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

import Api from "@/APIS/ProcedimentosUploads";
import { useMutation, useQuery, useQueryClient } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

// import MergeIcon from "@mui/icons-material/Merge";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { styled, useTheme } from "@mui/material/styles";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import toast from "react-hot-toast";

import { IAdicionaUploads } from "@/interfaces/Uploads";
// import { CheckIcon } from "@phosphor-icons/react";
import FileOpenIcon from "@mui/icons-material/FileOpen";

interface EscolhaProps {
  Close: () => void;
  OpenManual: () => void;
  OpenVivIA: () => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const ProcedimentosVivIA: FC<EscolhaProps> = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const ColunaLargura = isMobile ? 120 : (window.innerWidth - 200) / 2.4;
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (_e, nv) => setTabValue(nv);

  const columns: GridColDef[] = [
    { field: "identifier", headerName: "ID", width: ColunaLargura },
    {
      field: "file_name",
      headerName: "Arquivo ",
      width: ColunaLargura,
      editable: false,
    },
    {
      field: "created_at",
      headerName: "Dt Upload",
      type: "number",
      width: ColunaLargura,
      editable: true,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "user_id",
      headerName: "Id Usuario",
      width: ColunaLargura,
      editable: false,
    },
    {
      field: "file_path",
      headerName: "Ver Imagem",
      width: 100,
      renderCell: (params) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
            onClick={() => handleDownload(params.row.identifier)}
          >
            <FileOpenIcon sx={{ color: "#50893E" }} />
          </div>
        );
      },
    },
  ];

  const dadosListaUploads = useQuery(
    ["ListaUploadsAll"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetUploads();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaUploads?.isLoading;
  const hasContent = dadosListaUploads?.data?.content ?? [];

  const dadosListaUploadsConsultas = useQuery(
    ["ListaUploadsConsultasAll"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetUploadsConsultas();
      return response;
    },
    { keepPreviousData: true },
  );
  const isFetchingConsultas = dadosListaUploadsConsultas?.isLoading;
  const hasContentConsultas = dadosListaUploadsConsultas?.data?.content ?? [];

  const PaymentSkeleton = () => (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </>
  );

  const queryClient = useQueryClient();
  // const { closeModal } = useModal();

  // const EnvioProcedimentoUpload = async (dados: IAdicionaUploads) => {

  //   const formData = new FormData();
  //   const files = dados[0];

  //   console.log('filesfilesfiles 1',dados[0])

  //   for (let i = 0; i < files.length; i++) {
  //     formData.append('arquivos[]', files[i]);
  //   }
  //   console.log('filesfilesfiles 2',formData)

  //   const toastId = toast.loading("Adicionando Upload");
  //   console.log('dadosdadosdadosdados',dados)
  //   try {
  //     await Api.PostUploads(formData);

  //     toast.dismiss(toastId);
  //     toast.success("UPload feito com sucesso!");

  //     setTimeout(() => {
  //       // closeModal()
  //       queryClient.invalidateQueries();
  //       queryClient.refetchQueries();
  //     }, 500);
  //   } catch (error) {
  //     console.error("Erro na requisição:", error);
  //     toast.dismiss(toastId);
  //     toast.error("Ocorreu um erro ao adicionar o Arquivo");
  //     queryClient.invalidateQueries();
  //   } finally {
  //     toast.dismiss(toastId);
  //   }
  // };

  // const [isFetching,setisFetching] = useState(false)

  const { mutate: EnvioProcedimentoUpload } = useMutation(
    async (dados: IAdicionaUploads) => {
      toast.loading("Carregando Dados de Procedimento");
      const apiInstance = await Api.create();

      const response = await apiInstance.PostUploads(dados[0]);

      if (!response?.is_error) {
        toast.success("UPload feito com sucesso");

        setTimeout(() => {
          toast.dismiss();
          // closeModal();
          // Atualiza listas de uploads globais
          queryClient.invalidateQueries({ queryKey: ["ListaUploadsAll"] });
          // Atualiza listas de uploads por procedimento que possam estar abertas
          queryClient.invalidateQueries({
            queryKey: ["ListaUploadsByProcedure"],
          });
        }, 500);
      } else {
        setTimeout(() => {}, 500);
        toast.dismiss();
      }

      return response;
    },
  );

  const { mutate: EnvioConsultasUpload } = useMutation(
    async (dados: IAdicionaUploads) => {
      toast.loading("Carregando Dados de Consulta");
      const apiInstance = await Api.create();

      const response = await apiInstance.PostUploadsConsultas(dados[0]);

      if (!response?.is_error) {
        toast.success("Upload feito com sucesso");

        setTimeout(() => {
          toast.dismiss();
          // Atualiza listas de uploads globais
          queryClient.invalidateQueries({
            queryKey: ["ListaUploadsConsultasAll"],
          });
        }, 500);
      } else {
        setTimeout(() => {}, 500);
        toast.dismiss();
      }

      return response;
    },
  );

  const handleDownload = async (identifier: string) => {
    const toastId = toast.loading("Abrindo documento...");
    try {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetUploadsDownloads(identifier);

      if (response) {
        const url = window.URL.createObjectURL(response as unknown as Blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Erro ao abrir documento:", error);
      toast.error("Erro ao abrir documento");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Grid container size={{ md: 12 }}>
      <Grid container size={{ md: 12 }}>
        <Grid
          size={{ md: 3, xs: 12 }}
          sx={{
            display: "none",
            flexDirection: "column",
            backgroundColor: "#F7F7F7",
          }}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        >
          <List>
            <ListItem>Processando (17)</ListItem>
            {/* <ListItem>
              <strong>Processando (7)</strong>
            </ListItem> */}
            <ListItem>
              <strong>Concluídos (26)</strong>
            </ListItem>
            <ListItem>Erros (2)</ListItem>
          </List>
        </Grid>

        <Grid
          size={{ md: 12, xs: 12 }}
          sx={{ display: "flex", flexDirection: "column" }}
          alignItems={"flex-start"}
          justifyContent={"center"}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
              mb: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Uploads Tabs"
              variant="scrollable"
            >
              <Tab label="Uploads de Procedimentos" />
              <Tab label="Uploads de Consultas" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <>
              <Grid
                container
                spacing={2}
                sx={{ pb: 2 }}
                justifyContent={"flex-end"}
                size={{ md: 12 }}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<FileUploadOutlinedIcon />}
                >
                  Novo Procedimento
                  <VisuallyHiddenInput
                    type="file"
                    name="file"
                    onChange={(event) =>
                      EnvioProcedimentoUpload(event.target.files)
                    }
                  />
                </Button>
                <Alert
                  severity="info"
                  sx={{ fontSize: "0.75rem", alignItems: "center" }}
                >
                  Upload de 1 arquivo por vez
                </Alert>
              </Grid>
              {!isFetching && (
                <DataGrid
                  sx={{ width: "100%" }}
                  rows={hasContent}
                  columns={columns}
                  getRowId={(row) => row.identifier}
                  columnVisibilityModel={{ identifier: false, user_id: false }}
                  localeText={
                    ptBR.components.MuiDataGrid.defaultProps.localeText
                  }
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                />
              )}
              {isFetching && <PaymentSkeleton />}
            </>
          )}

          {tabValue === 1 && (
            <>
              <Grid
                container
                spacing={2}
                sx={{ pb: 2 }}
                justifyContent={"flex-end"}
                size={{ md: 12 }}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<FileUploadOutlinedIcon />}
                >
                  Novo Arquivo de Consultas
                  <VisuallyHiddenInput
                    type="file"
                    name="file"
                    onChange={(event) =>
                      EnvioConsultasUpload(event.target.files)
                    }
                  />
                </Button>
                <Alert
                  severity="info"
                  sx={{ fontSize: "0.75rem", alignItems: "center" }}
                >
                  Upload de 1 arquivo por vez
                </Alert>
              </Grid>
              {!isFetchingConsultas && (
                <DataGrid
                  sx={{ width: "100%" }}
                  rows={hasContentConsultas}
                  columns={columns}
                  getRowId={(row) => row.identifier}
                  columnVisibilityModel={{ identifier: false, user_id: false }}
                  localeText={
                    ptBR.components.MuiDataGrid.defaultProps.localeText
                  }
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                />
              )}
              {isFetchingConsultas && <PaymentSkeleton />}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
