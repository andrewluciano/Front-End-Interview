import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";
import SemPendencias from "@/assets/imagens/sem-pendencias.svg?svg";

export const BlocoSemPendencias = styled(Grid, {
  boxSizing: "border-box",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "10px",
  borderRadius: "5px",
  width: "100%",
  height: "100px",
  backgroundColor: "#F5F5F5",
  // boxShadow:
  //   "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  boxShadow: "0px 0px 0px 3px  rgba(0,0,0,0.1)",

  backgroundImage: `url(${SemPendencias})`,
  backgroundSize: "auto 90px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "90% center",
});
