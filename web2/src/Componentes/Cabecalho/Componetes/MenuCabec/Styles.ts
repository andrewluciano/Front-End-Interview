// import { styled } from '@stitches/react';
import { styled } from "@/stitches.config";

import Simbolo from "@/assets/imagens/Logo/simbolo.svg?url";
import { Grid } from "@mui/material";

export const Container = styled(Grid, {
  a: {
    justifyContent: "center",
    padding: "8px 0px",
    textDecoration: "none",
    color: "#999",
    margin: "0 15px",
    "&.selected": {
      color: "#444",
      borderBottom: "2px solid $primaryColor",
    },
    "&:hover": {
      color: "$444",
    },
  },

  "@md2": {
    left: "-120px",
    position: "absolute",
  },
});
