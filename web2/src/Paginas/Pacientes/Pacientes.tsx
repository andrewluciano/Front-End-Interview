import { useEffect, type FC } from "react";

import { useSearchParams } from "react-router-dom";

import Api from "./API/Pacientes";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

import { DataGrid, GridColDef, GridInitialState } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useMediaQuery, useTheme } from "@mui/material";

import { Box, Button, Grid, Tooltip } from "@mui/material";

import { DetalhePaciente } from "./DetalhePaciente";
import { AdicionarPaciente } from "./AdicionarPaciente";

import { dateSimple } from "@/helpers/format";

// Icones
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { ExcluirPaciente } from "./ExcluirPaciente";
import { Titulos } from "@/Componentes/Titulos";
import { useModal } from "@/Autenticacao/ModalContext";

export const Pacientes: FC = () => {
  const [searchParams] = useSearchParams();
  const { openModal } = useModal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const initialState: GridInitialState = {
    pagination: {
      paginationModel: { page: 0, pageSize: 5 },
    },
    columns: {
      columnVisibilityModel: {
        identifier: !isMobile,
        email: !isMobile,
        birth_date: !isMobile,
      },
    },
  };

  const AbreModalExcluirPaciente = (e, dados) => {
    e.preventDefault();

    setTimeout(() => {
      const modalContent = <ExcluirPaciente DadosSelecionados={dados} />;
      const TituloModal = "Excluir Paciente";
      const SubTituloModal = "Excluir dados do paciente";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 1000);
  };

  const AbreModalEditarPaciente = (e, dados) => {
    e.preventDefault();

    setTimeout(() => {
      const modalContent = <DetalhePaciente DadosSelecionados={dados} />;
      const TituloModal = "Editar Paciente";
      const SubTituloModal = "Editar dados do paciente";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 100);
  };

  const AbreModalAdicionarPaciente = () => {
    const modalContent = <AdicionarPaciente />;
    const TituloModal = "Novo Paciente";
    const SubTituloModal = "Adicione um novo paciente";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const formataData = (valor: Date) => {
    const returnData = dateSimple(valor);
    return returnData;
  };

  const ColunaLargura = isMobile ? 120 : (window.innerWidth - 200) / 4;

  const columns: GridColDef[] = [
    {
      field: "identifier",
      headerName: "id",
      width: ColunaLargura,
      hideable: true,
    },
    { field: "full_name", headerName: "Nome", width: ColunaLargura },
    { field: "email", headerName: "Email", width: ColunaLargura },
    { field: "phone", headerName: "Telefone", width: ColunaLargura },
    {
      field: "birth_date",
      headerName: "Data Nascimento",
      width: ColunaLargura,
      renderCell: (params) => formataData(params.value),
    },

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
          <Tooltip title="Editar Paciente" placement="bottom">
            <a onClick={(e) => AbreModalEditarPaciente(e, params.row)}>
              <EditIcon />
            </a>
          </Tooltip>
          <Tooltip title="Excluir Paciente" placement="bottom">
            <a onClick={(e) => AbreModalExcluirPaciente(e, params.row)}>
              <ClearIcon />
            </a>
          </Tooltip>
        </Grid>
      ),
    },
  ];
  const dadosListaPacientes = useQuery(
    ["listaPacientes"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetPacientes();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaPacientes?.isLoading;

  const hasContent = dadosListaPacientes?.data?.content ?? [];

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
    if (searchParams.has("NovoPaciente")) {
      AbreModalAdicionarPaciente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <Titulos titulo="Pacientes" icone={undefined} />

      <Grid container direction="row" spacing={2} sx={{ padding: "10px 0" }}>
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            AbreModalAdicionarPaciente(e)
          }
          variant="contained"
          startIcon={<AddIcon />}
        >
          Adicionar Paciente
        </Button>
      </Grid>
      {isFetching && <PaymentSkeleton />}
      {!isFetching && hasContent && (
        <Box
          sx={{
            width: "100%",
            maxHeight: "calc(100% - 180px)",
            maxWidth: "90vw",
          }}
        >
          <DataGrid
            rows={hasContent}
            columns={columns}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            showToolbar
            getRowId={(row) => row.identifier}
            initialState={initialState}
            pageSizeOptions={[5, 10]}
            columnVisibilityModel={{ identifier: false }}
            // checkboxSelection
          />
        </Box>
      )}
    </>
  );
};
