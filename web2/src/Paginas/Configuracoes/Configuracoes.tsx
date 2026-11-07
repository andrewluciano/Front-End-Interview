import { type FC } from "react";
import { Grid } from "@mui/material";
import { Titulos } from "@/Componentes/Titulos";
import { Hospitais } from "./Hospitais";
import { Tuss } from "./TUSS";

export const Configuracoes: FC = () => {
  return (
    <Grid container direction="row" spacing={2}>
      <Titulos titulo="Configurações" icone={undefined} />

      <Grid size={{ sm: 12 }}>
        <Hospitais />
      </Grid>
      <Grid size={{ sm: 12 }}>
        <Tuss />
      </Grid>
    </Grid>
  );
};
