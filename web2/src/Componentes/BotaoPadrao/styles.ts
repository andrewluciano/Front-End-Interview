import { styled } from "@/stitches.config";
// import { FileText } from 'phosphor-react';
// import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export const ButtonCustom = styled(Button, {
  transition: "all 0.2s ease-in-out",
  display: "flex",
  justifyContent: "center",
  gap: "5px",
  width: "auto",
  alignItems: "center",
  height: "auto",
  padding: "$10 $22",
  margin: "0px 0px 5px 0px",
  border: "0",
  color: "#ffffff",
  borderRadius: "0px",
  fontSize: "$16",
  fontWeight: "Normal",
  cursor: "pointer",
  textDecoration: "none",
  "&.MuiButton-containedPrimary": {
    backgroundColor: "$primaryColor",
  },

  svg: {
    display: "flex",
    minWidth: "20px",
    minHeight: "20px",
  },
  variants: {
    tipo: {
      single: {
        backgroundColor: "white",
        border: "1px solid $primaryColor",
        color: "$primary",

        "&:hover": {
          color: "#fff",
        },
      },
      default: {
        backgroundColor: "$nwGray400",
      },
      primario: {
        backgroundColor: "$primaryColor",
      },
      disabled: {
        pointerEvents: "none",
        cursor: "default",
        backgroundColor: "$nwGray400",
      },
    },
    Largura: {
      auto: {
        width: "130px",
        flex: "none",
      },
      138: {
        width: "138px",
      },
    },
  },
  "&:hover": {
    backgroundColor: "$secondaryColor",
    cursor: "pointer",
  },
  "&:active": {
    backgroundColor: "$secondaryColor",
    filter: "brightness(1.15)",
  },
  "&.Disabled": {
    backgroundColor: "$nwGray600",
  },
});

export const ButtonClose = styled("button", {
  position: "relative",
  fontWeight: "800",
  color: "#333",
  fontSize: "2rem",
  margin: "0",
  padding: "0 0 0 0",
  width: "30px",
  height: "30px",
  maxWidth: "30px",
  maxHeight: "30px",
  border: "0px solid blue",
  cursor: "pointer",
  backgroundColor: "transparent",
  span: {
    display: "flex",
    minWidth: "30px",
    minHeight: "30px",
    maxWidth: "30px",
    maxHeight: "30px",
    border: "0px solid red",
    fontSize: "2rem",
    position: "absolute",
    top: "1px",
    left: "1px",
    boxSizing: "border-box",
    padding: "20% 10%",
    lineHeight: "1rem",
    transform: "rotate(45deg)",
    letterSpacing: "0px",
    textAlign: "left",
  },
  "&:hover": {
    backgroundColor: "transparent",
    span: {
      color: "$secondary",
    },
  },
});
