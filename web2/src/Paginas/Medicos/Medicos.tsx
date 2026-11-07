import { useEffect, type FC } from "react";

import { useSearchParams } from "react-router-dom";

import Api from "./API/Medicos";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

import { DataGrid, GridColDef, GridInitialState } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useMediaQuery, useTheme } from "@mui/material";

import { Box, Button, Grid, Tooltip } from "@mui/material";

import { AdicionarMedicos } from "./AdicionarMedicos";
import { EditarMedicos } from "./EditarMedicos";
import { ExcluirMedicos } from "./ExcluirMedicos";

// Icones
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { Titulos } from "@/Componentes/Titulos";
import { useModal } from "@/Autenticacao/ModalContext";

export const Medicos: FC = () => {
  const { openModal } = useModal();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const AbreModalAdicionarMedico = () => {
    setTimeout(() => {
      const modalContent = <AdicionarMedicos />;
      const TituloModal = "Novo Médico";
      const SubTituloModal = "Novo um novo médico";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 1000);
  };

  const AbreModalExcluirMedico = (e, dados) => {
    e.preventDefault();
    // setDadosSelecionados(dados);

    setTimeout(() => {
      const modalContent = <ExcluirMedicos DadosSelecionados={dados} />;
      const TituloModal = "Excluir Médico";
      const SubTituloModal = "Excluir dados do Médico";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 1000);
  };

  const AbreModalEditarMedico = (e, dados) => {
    e.preventDefault();
    // setDadosSelecionados(dados);

    setTimeout(() => {
      const modalContent = <EditarMedicos DadosSelecionados={dados} />;
      const TituloModal = "Editar Médico";
      const SubTituloModal = "Editar dados do Médico";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 1000);
  };

  const ColunaLargura = isMobile ? 120 : (window.innerWidth - 200) / 5;

  const initialState: GridInitialState = {
    pagination: {
      paginationModel: { page: 0, pageSize: 5 },
    },
    columns: {
      columnVisibilityModel: {
        identifier: !isMobile,
        phone: !isMobile,
        email: !isMobile,
      },
    },
  };

  const columns: GridColDef[] = [
    { field: "identifier", headerName: "ID", width: ColunaLargura },
    { field: "crm", headerName: "CRM", width: ColunaLargura },
    { field: "full_name", headerName: "Nome", width: ColunaLargura },
    { field: "email", headerName: "Email", width: ColunaLargura },
    { field: "speciality", headerName: "Especialidade", width: ColunaLargura },
    { field: "phone", headerName: "Telefone", width: ColunaLargura },
    {
      field: "actions",
      headerName: "",
      width: 90,
      renderCell: (params) => (
        <Grid
          spacing={2}
          container
          justifyContent={"center"}
          sx={{ padding: "5px 0" }}
        >
          <Tooltip title="Editar Médico" placement="bottom">
            <a onClick={(e) => AbreModalEditarMedico(e, params?.row)}>
              <EditIcon />
            </a>
          </Tooltip>
          <Tooltip title="Excluir Médico" placement="bottom">
            <a onClick={(e) => AbreModalExcluirMedico(e, params?.row)}>
              <ClearIcon />
            </a>
          </Tooltip>
        </Grid>
      ),
    },
  ];
  const dadosListaMedicos2 = useQuery(
    ["listaMedicos"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetMedicos();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaMedicos2.isLoading;
  const hasContent = dadosListaMedicos2.data?.content;

  const PaymentSkeleton = () => (
    <>
      <Box
        sx={{
          position: "fixed",
          zIndex: "999",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "center",
          width: "200px",
          p: "10px",
          backgroundColor: "rgba(255,255,255,0.4)",
        }}
      >
        <LinearProgress sx={{ maxWidth: "200px" }} />
      </Box>
    </>
  );

  useEffect(() => {
    if (searchParams.has("NovoMedico")) {
      AbreModalAdicionarMedico();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <Titulos titulo="Médicos" icone={undefined} />
      <Grid container direction="row" spacing={2} sx={{ padding: "10px 0" }}>
        <Button
          variant="contained"
          onClick={() => AbreModalAdicionarMedico()}
          startIcon={<AddIcon />}
        >
          Adicionar Médico
        </Button>
      </Grid>
      {isFetching && <PaymentSkeleton />}
      {!isFetching && (
        <Box
          sx={{
            width: "100%",
            maxHeight: "calc(100% - 180px)",
            maxWidth: "95vw",
          }}
        >
          <DataGrid
            rows={hasContent}
            columns={columns}
            showToolbar
            sx={{ width: "auto" }}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) => row.identifier}
            initialState={initialState}
            pageSizeOptions={[5, 10]}
            columnVisibilityModel={{ identifier: false }}
            // checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </>
  );
};
