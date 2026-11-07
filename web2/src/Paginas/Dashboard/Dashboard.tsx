import { type FC } from "react";

import { Container } from "./Styles";

// Modal
import { useModal } from "@/Autenticacao/ModalContext";
import { Escolha } from "@/Paginas/Procedimentos/Escolha";

import { Destaques } from "./Destaques";
import { GraficoEstagios } from "./GraficoEstagios";
import Grid from "@mui/material/Grid";
import { GraficoRequisicoesMes } from "./GraficoRequisicoesMes";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
export const Dashboard: FC = () => {
  const { openModal } = useModal();
  const handleClickEscolha = () => {
    const modalContent = <Escolha />;
    const TituloModal = "Novo Procedimento";
    const SubTituloModal = "Você pode escolher o modo de subir o procedimento";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  return (
    <Container container spacing={1} direction="row">
      <Grid
        size={{ sm: 0, xs: "auto" }}
        sx={{
          position: "absolute",
          top: "10px",
          right: "0",
          display: { xs: "flex", sm: "none" },
        }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickEscolha}
        >
          Adicionar Procedimento
        </Button>
      </Grid>

      <Grid
        container
        spacing={1}
        size={{ sm: 12, xs: 12 }}
        sx={{ padding: "5px 0px" }}
      >
        <Destaques />
        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ padding: "10px 0" }}>
              Requisições por Mês
            </Typography>
            <GraficoRequisicoesMes keys={["earnings"]} indexBy="quarter" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ padding: "10px 0" }}>
              Estágios
            </Typography>
            <GraficoEstagios keys={["earnings"]} indexBy="quarter" />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
