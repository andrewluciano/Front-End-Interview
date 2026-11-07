import { styled } from "@/stitches.config";
import Grid from "@mui/material/Grid";

// import Simbolo from "@/assets/imagens/Logo/simbolo.svg";

export const Container = styled(Grid, {
  background: `linear-gradient(45deg,rgba(30, 58, 95, 1) 0%, rgba(77, 184, 162, 1) 100%)`,
  backgroundSize: "cover",
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  ".Bloco1": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",

    zIndex: "9",
    ".Logo": {
      width: "240px",
    },
  },

  ".AreaForm": {
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
    padding: "20px",
    maxWidth: "100%",
    textAlign: "center",
  },

  "&:before": {
    width: "100%",
    height: "100%",
    overflow: "none",
    content: "",
    position: "absolute",
    top: "0",
    left: "0",
    // backgroundImage:`url("${Simbolo}")`,
    backgroundPosition: "-10%",
    backgroundSize: "200%",
    zIndex: "0",
    opacity: "0.2",
  },
});
