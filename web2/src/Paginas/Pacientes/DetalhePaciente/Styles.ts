import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";

export const TabPanelCustom = styled("div", {
  padding: "20px 0",
  variants: {
    visivel: {
      true: {
        display: "flex",
      },
      false: {
        display: "none",
      },
    },
  },
});

export const GridCustom = styled(Grid, {
  ".Loading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
