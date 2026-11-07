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
  boxShadow: "initial",
  "@md2": {
    flex: "25% 0 10% !important",
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
    fontWeight: "400",

    fontSize: "1.3rem",
  },
  p: {
    margin: "0",
    fontSize: "0.9rem",
  },
  variants: {
    type: {
      Solicitadas: {
        backgroundColor: "$StatusSolicitadas !important",
        color: "#fff !important",
      },
      Autorizadas: {
        backgroundColor: "$StatusAutorizadas !important",
        color: "#fff !important",
      },
      Pendentes: {
        backgroundColor: "$StatusPendentes !important",
        color: "#fff !important",
      },
      Agendadas: {
        backgroundColor: "$StatusAgendadas !important",
        color: "#fff !important",
      },
    },
  },
});
export const Container = styled(Box, {
  display: "flex",
  flexDirection: "row",
  height: "82px",
  borderRadius: "5px",
  boxShadow:
    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  "@md2": {
    width: "100%",
    flexGrow: "2",
    maxWidth: "94vw",
  },
  ".BlocoDestaque": {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    border: "1px solid red",
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
