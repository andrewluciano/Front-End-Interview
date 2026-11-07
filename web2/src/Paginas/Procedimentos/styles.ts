import { styled } from "@/stitches.config";
import { Button, Grid } from "@mui/material";
import SemProcedimentos from "@/assets/imagens/sem-procedimentos.svg";

export const Content = styled(Grid, {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  fontSize: "1rem",
  height: "auto",
  width: "100%",
  boxSizing: "border-box",
  padding: "0px",
  margin: "0",
  gap: "20px",
  flexWrap: "wrap",
  flex: "1",
  "@lg2": {
    maxWidth: "1024px",
  },

  ".ItemOperacao": {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "center",
    height: "auto",
    borderRadius: "5px",
    boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
    padding: "10px 2px",
    gap: "20px",
    // minWidth:'210px',
    minWidth: "280px",
    Width: "280px",
    minHeight: "240px",
    "@md2": {
      // flexDirection: "column",
      // height: "auto",
      // padding: "15px",
    },
  },
});

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
export const H3 = styled("h3", {
  margin: "0",
  padding: "0",
  fontWeight: "bold",
  fontSize: "$12",
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
export const Paragrafo = styled("p", {
  display: "flex",
  flexDirection: "column",
  margin: "0",
  padding: "0",
  fontSize: "$13",
  color: "#333",
  span: {
    fontSize: "$12",
    color: "#444444",
  },
});
export const BtnAdicionaProcedimento = styled(Button, {
  position: "fixed !important",
  bottom: "20px",
  right: "20px",
  boxSizing: "border-box",
  padding: "10px !important",
  textAlign: "center",
  borderRadius: "100% !important",
  fontSize: "3rem",
  width: "40px !important",
  height: "60px !important",
  zIndex: "99",
});

export const Cardlist = styled(Grid, {
  height: "83vh",
  overflowY: "scroll",
  overflowX: "hidden",
  border: "1px solid red",
});

export const BlocoSemProcedimentos = styled(Grid, {
  boxSizing: "border-box",
  backgroundImage: `url(${SemProcedimentos})`,
  backgroundSize: "auto 90px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "90% center",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow:
    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  width: "480px",
  height: "200px",
  alignItems: "center",
  margin: "10px auto",
  padding: "50px 25px !important",
  paddingRight: "50px !important",
  "@md2": {
    width: "320px",
    padding: "0",
    textAlign: "center",
    backgroundPosition: "center 30px",
    paddingTop: "150px !important",
    paddingRight: "25px !important",
    height: "auto",
    justifyContent: "center",
    h6: {
      margin: "5px auto",
    },
  },
});
