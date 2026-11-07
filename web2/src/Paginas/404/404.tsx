import { type FC } from "react";

import { Container, AreaTexto } from "./Styles";

import { Grid, Typography } from "@mui/material";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";

export const NaoExiste: FC = () => {
  return (
    <Container>
      <Grid container spacing={{ xs: 1, md: 3 }} className={"AreaMensagem"}>
        <Grid size={12}>
          <Typography variant="h1" component={"h1"}>
            404
          </Typography>

          <AreaTexto>
            <Typography variant="h5" component={"h5"}>
              Ops!
            </Typography>
            <Typography gutterBottom variant="body2" component={"p"}>
              A página que você procura não foi encontrada ou ela não existe{" "}
              <br />
            </Typography>
            <BotaoPadrao
              variant="contained"
              size="medium"
              link="/Dashboard"
              titulo="Voltar para o Dashboard"
              tamanho={undefined}
              click={undefined}
              tipo={undefined}
              icone={undefined}
              disabled={false}
              type={undefined}
            />
          </AreaTexto>
        </Grid>
      </Grid>
    </Container>
  );
};
