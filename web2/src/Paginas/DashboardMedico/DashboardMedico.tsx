import { useCallback, useEffect, useRef, type FC } from "react";

// import { useModal } from "@/Autenticacao/ModalContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useModal } from "@/Autenticacao/ModalContext";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PostAddIcon from "@mui/icons-material/PostAdd";

// Modal
import { Destaques } from "./Destaques";
import Grid from "@mui/material/Grid";

import { DestaqueAgenda } from "./DestaqueAgenda";
import { Conciliacao } from "./Conciliacao";
import { Container } from "./Styles";
import { Consulta } from "../Consultas/Consulta";
import { Box, CardContent, Card, LinearProgress, Typography } from "@mui/material";
import { theme } from "@/stitches.config";
export const DashboardMedico: FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [searchParams] = useSearchParams();
  const lastOpenedAtendimentoRef = useRef<string | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const aftertomorrow = new Date();
  aftertomorrow.setDate(aftertomorrow.getDate() + 2);

  const topConvenios = [
    { nome: "Bradesco Saude", valor: 42 },
    { nome: "Unimed", valor: 31 },
    { nome: "Amil", valor: 28 },
    { nome: "SulAmerica", valor: 22 },
    { nome: "Outros", valor: 19 },
  ];

  const totalEscalaConvenios =
    Math.max(...topConvenios.map((item) => item.valor)) + 4;

  const actions = [
    {
      icon: <PostAddIcon />,
      name: "Procedimento Manual",
      link: () => navigate("?AdicionarAtendimentoManual", { replace: true }),
    },
    {
      icon: <UploadFileIcon />,
      name: "Upload Procedimento",
      link: () => navigate("?AdicionarAtendimentoUpload", { replace: true }),
    },
  ];

  const Dial = () => {
    return (
      <SpeedDial
        ariaLabel="Ações de Consulta"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "none", md: "flex" },
        }}
        className="TooltipSpeed"
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.link}
            slotProps={{
              tooltip: {
                open: true,
                className: "TooltipSpeed",
                title: action.name,
              },
            }}
          />
        ))}
      </SpeedDial>
    );
  };

  const handleOpenProductModalEditar = useCallback(() => {
    const modalContent = (
      <Consulta
        Close={() => {
          navigate({ search: "" }, { replace: true });
        }}
      />
    );
    const TituloModal = "Editar Procedimento";
    const SubTituloModal = "Editar Procedimento Manual";
    openModal(modalContent, TituloModal, SubTituloModal);
  }, [navigate, openModal]);

  useEffect(() => {
    const atendimento = searchParams.get("Atendimento");

    if (atendimento && lastOpenedAtendimentoRef.current !== atendimento) {
      lastOpenedAtendimentoRef.current = atendimento;
      handleOpenProductModalEditar();
    }

    if (!atendimento) {
      lastOpenedAtendimentoRef.current = null;
    }
  }, [handleOpenProductModalEditar, searchParams]);

  return (
    <Container container spacing={1} direction="row">
      <Dial />
      <Grid
        container
        spacing={1}
        size={{ sm: 12, xs: 12 }}
        sx={{ padding: "5px 0px" }}
      >
        <Destaques />
        <Conciliacao />

        <Grid container size={{ sm: 9, xs:12 }}>
          <DestaqueAgenda />
        </Grid>
        <Grid container size={{ sm: 3, xs:12 }} sx={{display:{sm:'flex', xs:'none'}}}>
          <Card
            sx={{
              height:'225px',
              width: "100%",
              borderRadius: 1,
              boxShadow: 1,
              backgroundColor: theme.colors.PaperColor.value,
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography
                variant="caption"
                component={'div'}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#8d9486",
                  py:1,
                  
                }}
              >
                Top convênios · Abril
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr auto 100px",
                  columnGap: 2,
                  alignItems: "center",                  
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.35,  }}>
                  {topConvenios.map((item) => (
                    <Typography key={item.nome} variant="caption" color="#31402d" sx={{letterSpacing:'-0.3px', }}>
                      {item.nome}
                    </Typography>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.95,
                    alignItems: "flex-end",
                    minWidth: 24,
                  }}
                >
                  {topConvenios.map((item) => (
                    <Typography
                      key={`${item.nome}-valor`}
                      variant="body2"
                      color="#5d6755"
                      sx={{fontSize:'0.7rem'}}
                    >
                      {item.valor}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3.35 }}>
                  {topConvenios.map((item) => (
                    <LinearProgress
                      key={`${item.nome}-progress`}
                      variant="determinate"
                      value={(item.valor / totalEscalaConvenios) * 100}
                      sx={{
                         
                        width: 86,
                        height: 5,
                        borderRadius: 999,
                        backgroundColor: "#DCE6D6",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          backgroundColor: "#6FA34A",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
