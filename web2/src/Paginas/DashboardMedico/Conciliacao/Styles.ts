import { styled } from "@/stitches.config";
import HandShake from "@/assets/imagens/handshake.svg";
import { Grid } from "@mui/material";

export const GridCustom = styled(Grid, {
  gap: "10px",

  boxSizing: "border-box",
  boxShadow: "1",
  padding: "15px 10px 15px 10px",
  backgroundColor: "#fff",
  backgroundImage: `url(${HandShake})`,
  backgroundSize: "auto 90px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "100% center",
  height: "125px",
});
