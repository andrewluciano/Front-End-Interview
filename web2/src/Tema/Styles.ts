import { Grid } from "@mui/material";
import { styled } from "@/stitches.config";

export const Container = styled(Grid, {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  fontSize: "1rem",
  height: "100vh",
  width: "100vw",
  maxHeight: "100vh",
  boxSizing: "border-box",
  padding: "0px",
  margin: "0px 0 0px 0",
  gap: "0px",
  overflow: "block",
});

export const AreaConteudo = styled(Grid, {
  display: "flex",
  flexDirection: "row",
  gap: "0px",
  flex: "3",
  width: "100%",
  boxSizing: "border-box",
  padding: "0px",
  maxHeight: "calc(100vh - 60px)",
  margin: "62px 0 0px 0",
  overflow: "block",
  "@md2": {
    position: "fixed",
    top: "0px",
    width: "100%",
    height: "calc(100vh - 180px)",
    minHeight: "calc(100vh - 180px)",
    maxHeight: "calc(100vh - 180px)",
    margin: "62px 0 0px 0",
  },
});

export const AreaDireita = styled(Grid, {
  alignContent: "flex-start !important",
  gap: "20px",
  // marginLeft: "58px",
  maxHeight: "calc(100vh - 62px)",
  overflow: "none",
  boxSizing: "border-box",
  // padding: "10px 5px 0px 5px",
  padding: "20px",
  "@md2": {
    marginLeft: "0",
    height: "calc(100vh - 180px)",
    maxHeight: "calc(100vh - 180px)",
    overflow: "none",
    padding: "10px",
  },
});

export const Conteudo = styled(Grid, {
  boxSizing: "border-box",
  padding: "0",
  positiion: "relative",
  width: "100%",
  height: "calc(100vh - 110px)",
  minHeight: "calc(100vh - 110px)",
  maxHeight: "calc(100vh - 110px)",

  overflowY: "scroll",
  "@md2": {
    // paddingBottom: "20px",
    height: "calc(100vh - 190px)",
    minHeight: "calc(100vh - 216px)",
    maxHeight: "calc(100vh - 216px)",
    paddingBottom: "15px",
  },
});

export const LoadingPaginas = styled(Grid, {});
