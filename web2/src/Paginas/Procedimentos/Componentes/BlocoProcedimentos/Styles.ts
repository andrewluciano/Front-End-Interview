import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";

export const BlocoItem = styled(Grid, {
  // display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
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
  gap: "10px !important",
  maxHeight: "calc(100vh - 180px)",
  paddingBottom: "25px",
  overflowY: "auto",
  width: "calc(100% + 10px)",
  overflowX: "hidden",
  "@md2": {
    maxHeight: "calc(100vh - 162px)",
  },
});
