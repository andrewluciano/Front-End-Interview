import { styled } from "@/stitches.config";
// import styled from 'styled-components';

import { Card, Box } from "@mui/material";

export const BlocoProcedimentos = styled(Card, {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  boxSizing: "border-box",
  color: "#333",
  flex: "12%",
  minWidth: "130px",
  width: "auto",
  height: "125px",
  borderRadius: "4px !important",
  // backgroundColor: "#fff",
  flexShrink: "0",
  padding: "0",
  boxShadow: "1",
  backgroundColor: "$PaperColor !important",
  div: {
    padding: "15px 15px 0 15px",
  },
  "*": {
    color: "#333 !important",
  },
  h3: {
    margin: "0",
    fontWeight: "300",
    fontSize: "0.8rem",
    "@md2": {
      fontSize: "0.7rem",
    },
  },
  h2: {
    margin: "0",
    fontWeight: "bold",
    fontSize: "$30",
  },
  p: {
    margin: "0",
    fontSize: "0.9rem",
  },
  variants: {
    tipo: {
      Totalizadores: {
        // backgroundColor: "transparent !important",
        color: "#fff",
      },
      "A realizar": {
        // backgroundColor: "transparent !important",
        color: "#fff",
      },
      Pagos: {
        // backgroundColor: "$StatusSolicitadas !important",
        "*": {
          color: "$primaryColor !important",
        },
      },
      Perdas: {
        // backgroundColor: "transparent !important",
        color: "#fff",
      },
    },
  },
});
export const Container = styled(Box, {
  display: "flex",
  flexDirection: "row",
  height: "82px",
  borderRadius: "0px",

  boxShadow:
    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  "@md2": {
    width: "100%",
    flexGrow: "2",
    maxWidth: "99vw",
  },
  ".BlocoDestaque": {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    boxSizing: "border-box",
    // flex: "3",
    color: "#333",
    borderRadius: "0px",
    flex: "12%",
    minWidth: "105px",
    boxShadow: "initial",

    "@md2": {
      // border:'1px solid red',
      flex: "25% 0 10% !important",
    },

    h3: {
      margin: "0",
      // textTransform: "uppercase",
      fontWeight: "300",
      fontSize: "0.8rem",
    },
    h2: {
      margin: "0",
      fontWeight: "400",

      fontSize: "1.3rem",
    },
    p: {
      margin: "0",
      fontSize: "0.9rem",
    },
    "&:nth-of-type(1)": {
      backgroundColor: "$primaryColor",
      borderRadius: "5px 0 0 5px",
      width: "+10px",
      "*": {
        color: "#fff",
      },
    },
    "&:last-child": {
      borderRadius: "0 5px 5px 0",
    },
    "&.Estagios": {
      "&:nth-of-type(1)": {
        background: "#fff",
        "*": {
          color: "#333",
        },
      },
    },
    variants: {
      tipo: {
        destaque: {
          // borderRadius:'2px',
          backgroundColor: "$primaryColor",
          color: "#fff",
        },
      },
    },
  },
  ".Loading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});
