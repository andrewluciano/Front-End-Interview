import { styled } from "@/stitches.config";
// import { FileText } from 'phosphor-react';
import { Link } from "react-router-dom";

export const Button = styled(Link, {
  transition: "all 0.2s ease-in-out",
  display: "flex",
  justifyContent: "flex-start",
  gap: "5px",
  width: "100%",
  alignItems: "center",
  height: "40px",
  maxHeight: "40px",
  padding: "$9 0",
  margin: "0px",
  border: "0",
  color: "#ffffff",
  fontSize: "$nwBase",
  fontWeight: "500",
  cursor: "pointer",
  textDecoration: "none",
  svg: {
    display: "flex",
    minWidth: "20px",
    minHeight: "20px",
  },
  variants: {
    tipo: {
      single: {
        backgroundColor: "white",
        color: "$nwGray400",
        "&:hover": {
          color: "#fff",
        },
      },
      default: {
        backgroundColor: "$nwGray400",
      },
      primario: {
        backgroundColor: "$primary",
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
    backgroundColor: "$nwRed600",
    cursor: "pointer",
  },
  "&:active": {
    backgroundColor: "$nwRed400",
  },
  "&.Disabled": {
    backgroundColor: "$nwGray600",
  },
});
