import { type FC } from "react";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import { BlocoSemFaturamento } from "./Styles";

interface IBlocoFaturamentoProps {
  tipo: "a-pagar" | "glosado" | "pagos";
}

export const BlocoFaturamento: FC<IBlocoFaturamentoProps> = ({ tipo }) => {
  return (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{
        display: "flex",
        gap: "10px",
        width: "100%",
        height: "100%",
        maxHeight: "220px",
        overflowY: "auto",
        p: 0.5,
      }}
    >
      {tipo === "a-pagar" && (
        <>
          <Grid
            container
            size={{ sm: 12 }}
            sx={{
              p: 1,
              borderRadius: "5px",
              boxShadow: "0px 0px 0px 3px  rgba(0,0,0,0.1)",
              color: "palette.primary.main",
            }}
          >
            <Grid container size={{ sm: 12 }} alignItems={"center"}>
              <Typography variant="subtitle2" sx={{ pr: 0.5 }}>
                Valor Original
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                sem valoir
              </Typography>
            </Grid>
            <Grid container size={{ sm: 12 }} alignItems={"center"}>
              <Typography variant="caption" sx={{ pr: 0.5 }}>
                12/11/2025
              </Typography>
              <Typography variant="caption">sem nome</Typography>
            </Grid>
          </Grid>
        </>
      )}
      {tipo === "glosado" && (
        <>
          <BlocoSemFaturamento container sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              component={"p"}
              sx={{ fontWeight: "bold" }}
            >
              Nenhum Faturamento <br /> Registrado
            </Typography>
          </BlocoSemFaturamento>
        </>
      )}
      {tipo === "pagos" && (
        <Grid
          container
          size={{ sm: 12 }}
          sx={{
            p: 1,
            borderRadius: "5px",
            boxShadow: "0px 0px 0px 3px  rgba(0,0,0,0.1)",
            color: "palette.primary.main",
          }}
        >
          <Grid container size={{ sm: 12 }} alignItems={"center"}>
            <Typography variant="subtitle2" sx={{ pr: 0.5 }}>
              Vl Pago
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              sem valor pago
            </Typography>
          </Grid>
          <Grid container size={{ sm: 12 }} alignItems={"center"}>
            <Typography variant="caption" sx={{ pr: 0.5 }}>
              sem data
            </Typography>
            <Typography variant="caption">sem nome</Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
