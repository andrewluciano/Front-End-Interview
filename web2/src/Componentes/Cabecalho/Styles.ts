import { styled } from "@stitches/react";
import Box from "@mui/material/Box";
export const Container = styled(Box, {
  position: "fixed",
  top: "0",
  width: "100%",
  fontSize: "1rem",
  height: "63px",
  maxHeight: "63px",
  zIndex: 1000,
  backgroundColor: "#fff",
  borderRadius: "0px",
  boxSizing: "border-box",
  margin: "0px",
  boxShadow: "0 1px 1px rgba(0,0,0,0.15)",
  button: {
    gap: "10px",
    color: "$primaryColor",
  },
  "@md2": {
    maxWidth: "100vw",
  },

  "#MenuPerfil": {
    border: "1px solid red !important",
    a: {
      fontSize: "0.875rem",
      border: "1px solid red",
    },
  },
});
