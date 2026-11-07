import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";

export const BlocoItem = styled(Grid, {
  // display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  maxWidth: "275px",

  "&.BlocoItem": {},

  "&:nth-of-type(2) > div": {
    "@md2": {
      gap: "10px",
    },
  },
  "@md2": {
    gap: "10px",
    flexDirection: "column",
  },
  variants: {
    tipo: {
      Loading: {
        "> span ": {
          width: "100%",
          minWidth: "100%",
        },
      },
    },
  },
});

export const H2 = styled("h2", {
  margin: "0",
  padding: "0",
  fontWeight: "bold",
  fontSize: "$18",
});
export const Label = styled("label", {
  margin: "0",
  padding: "0",
  fontSize: "$11",
  color: "#333",
});

export const GridCustom = styled(Grid, {
  display: "flex",
  gap: "10px !important",
  flexDirection: "row",
  flexWrap: "nowrap !important",
  // maxHeight: "calc(100vh - 100px)",
  maxHeight: "410px",
  paddingBottom: "25px",
  overflowX: "auto",
  width: "calc(100%)",
  overflowY: "hidden",

  "@md2": {
    maxHeight: "calc(100vh - 162px)",
  },
  "& > *": {
    flexShrink: 0,
    width: "auto !important",
  },
  ".ItemOperacao": {
    position: "relative",
    top: "0",
    height: "390px",

    maxWidth: "290px",
  },
});
