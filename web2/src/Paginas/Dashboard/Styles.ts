import { Grid } from "@mui/material";
import { styled } from "@/stitches.config";

export const Container = styled(Grid, {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  fontSize: "3rem",
  height: "auto",
  width: "100%",
  boxSizing: "border-box",
  padding: "0px",
  margin: "0",
  gap: "20px",
  flexWrap: "wrap",
  flex: "1",
  alignItems: "flex-start",
});

export const AreaDestaque = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  boxSizing: "border-box",
  borderRadius: "10px",
  gap: "20px",
  backgroundColor: "#fff",
  width: "100%",
});

export const BlocoDestaque = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  boxSizing: "border-box",
  padding: "10px",
  flex: "3",
  color: "#333",
  h3: {
    margin: "0",
    textTransform: "uppercase",
    fontWeight: "200",
    fontSize: "1rem",
  },
  h2: {
    margin: "0",
    fontSize: "2rem",
  },
  p: {
    margin: "0",
    fontSize: "0.9rem",
  },
  variants: {
    tipo: {
      destaque: {
        borderRadius: "10px",
        backgroundColor: "$primaryColor",
        color: "#fff",
      },
    },
  },
});
