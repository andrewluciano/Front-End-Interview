import { Typography } from "@mui/material";
import { styled } from "@/stitches.config";
// import { FileText } from 'phosphor-react';

export const TypographyCustom = styled(Typography, {
  transition: "all 0.2s ease-in-out",
  display: "flex",
  justifyContent: "flex-start",
  gap: "5px",
  width: "100%",
  alignItems: "center",
  height: "auto",
  maxHeight: "auto",
  padding: "0px !important",
  minHeight: "auto",
  margin: "0 !important",
  // border: "0",
  color: "$nwZinc800 !important",
  borderRadius: "0px",
  fontSize: "$30 !important",
  fontWeight: "700 !important",
  textDecoration: "none",
  // textTransform: "uppercase",
  // fontStyle: "italic",
  svg: {
    display: "flex",
    minWidth: "20px",
    minHeight: "20px",
  },
});
