import { styled } from "@/stitches.config";
import SemPendenciasIMG from "@/assets/imagens/undraw_completed_0sqh.svg?react";
import { Card, Grid, List } from "@mui/material";

export const Andrew = styled(Grid, {
  border: "1px solid blue",
  display: "flex",
  // height:'calc(100vh - 50%)',
  alignItems: "stretch",
  justifyContent: "stretch",
  minHeight: "100%",
  height: "100%",
  maxHeight: "100%",
});
export const TabPanelCustom = styled("div", {
  padding: "20px 0",
  width: "100%",
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

export const BlocoSemPendencias = styled(Card, {
  borderRadius: "0px !important",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  padding: "10px",
  width: "100%",
  height: "200px",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  p: {
    color: "$gray600",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
  svg: {},
});
export const SemPendencias = styled(SemPendenciasIMG, {
  width: "90px",
  height: "120px",
});

export const BlocoPendencias = styled(List, {
  padding: "0px",
  height: "100%",
  li: {
    padding: "0",
  },
  svg: {
    color: "$nwAmber500",
  },
  a: {
    cursor: "pointer",
    width: "100%",
    display: "flex",
    gap: "8px",
    boxSizing: "border-box",
    padding: "5px",
    lineHeight: "1rem",
    letterSpacing: "-0px",
    fontWeight: "400",
    color: "$nwGray500",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "$nwGray200",
      color: "#333",

      svg: {
        color: "#333",
      },
    },
  },
});
