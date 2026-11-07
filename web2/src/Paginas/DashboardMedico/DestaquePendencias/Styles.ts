import { styled } from "@/stitches.config";

import { Grid } from "@mui/material";

export const GridCustom = styled(Grid, {
  ".aaa": {
    boxSizing: "border-box",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow:
      "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  },
  ".BlocoSemBotao": {
    border: "1px solid red",
    "@md2": {
      button: {
        display: "none",
      },
    },
  },
});
