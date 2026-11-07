import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";
export const GridCustom = styled(Grid, {
  ".Loading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
