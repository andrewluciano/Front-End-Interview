import { styled } from "@/stitches.config";
import { Card, Grid, Paper, Box } from "@mui/material";
import SemPendencias from "@/assets/imagens/undraw_empty_4zx0.svg?svg";

export const CardCustom = styled(Card, {
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

export const PaperCustom = styled(Box, {
  position: "relative",
  padding: "14px 14px 14px 30px",
  borderRadius: "5px",
  // border: "none",
  backgroundColor: "#fff",
  boxShadow: 1,
  flexDirection: "column",
  width: "100%",
  // borderBottom: "1.5px solid #ccc",
  // "@media (sm2)": {
  //   border:'1px solid red',
  //   width: "calc(100vw - 125px)",
  // },

  h5: {
    margin: "0",
    padding: "0",
    fontSize: "$12",
  },
  h2: {
    margin: "0",
    padding: "0",
    fontSize: "$16",
  },

  "&:after": {
    content: "",
    position: "absolute",
    top: "50%",
    left: "14px",
    transform: "translateY(-50%)",
    width: "6px",
    height: "85%",
    borderRadius: "10px",
    backgroundColor: "#C0E56A",
  },
});

export const SemAgenda = styled(Grid, {
  position: "relative",
  boxSizing: "border-box",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "10px",
  borderRadius: "5px",
  width: "100%",
  height: "100px",
  backgroundColor: "#F5F5F5",
  // boxShadow:
  //   "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  // boxShadow: "0px 0px 0px 3px  rgba(0,0,0,0.1)",
  boxShadow: "0",

  backgroundImage: `url(${SemPendencias})`,
  backgroundSize: "auto 90px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "90% center",
  p: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
});

export const LegendaAgenda = styled(Grid, {
  backgroundColor: "$StatusConsulta",
  width: "10px",
  height: "10px",
  borderRadius: "25%",
  variants: {
    type: {
      Consultas: {
        backgroundColor: "$StatusConsulta",
      },
      Procedimentos: {
        backgroundColor: "$StatusProcedimentos",
      },
    },
  },
});
