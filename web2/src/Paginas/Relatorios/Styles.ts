import { styled } from "@/stitches.config";
import Grid from "@mui/material/Grid";

export const Container = styled(Grid, {
  "tbody tr": {
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  td: {
    padding: "15px",
    height: "auto",
    fontSize: "0.8rem",
  },
});
