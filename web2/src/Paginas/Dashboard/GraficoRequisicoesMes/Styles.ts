import { Grid } from "@mui/material";
import { styled } from "@/stitches.config";

export const Container = styled(Grid, {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  fontSize: "3rem",
  height: "300px",

  boxSizing: "border-box",
  padding: "0px",
  margin: "0",
  gap: "20px",
  borderRadius: "5px",
  alignItems: "flex-start",
  backgroundColor: "#fff",
  boxShadow:
    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
});
