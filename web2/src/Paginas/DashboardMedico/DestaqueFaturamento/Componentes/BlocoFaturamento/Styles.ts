import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";
import SemResultados from "@/assets/imagens/sem-resultado-2.svg?svg";

export const BlocoSemFaturamento = styled(Grid, {
  boxSizing: "border-box",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "10px",
  borderRadius: "5px",
  width: "100%",
  height: "100px",
  backgroundColor: "#fff",
  // boxShadow:
  //   "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  boxShadow: "0px 0px 0px 3px  rgba(0,0,0,0.1)",
  backgroundImage: `url(${SemResultados})`,
  backgroundSize: "auto 90px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "90% center",
});
