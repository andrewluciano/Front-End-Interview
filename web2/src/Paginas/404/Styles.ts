import { styled } from "@/stitches.config";

export const Container = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  fontSize: "3rem",
  height: "100vh",
  width: "100%",
  boxSizing: "border-box",
  padding: "20px",
  margin: "0",
  gap: "20px",
  alignItems: "center",
  justifyContent: "center",
  overflow: "auto",

  scrollbarColor: "#ccc transparent",
  scrollbarWidth: "thin",
  // backgroundColor:'rgba(80,137,62,0.1)',
  backgroundColor: "#fff",
  ".AreaMensagem": {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    // boxShadow:`0px 1px 0px rgba(80,137,62,1)`,
    // boxShadow:'0px 0px 40px rgba(0,0,0,0.1)',
    width: "70vw",
    height: "40vw",
    h1: {
      textAlign: "center",
      lineHeight: "20rem",
      fontWeight: "800",
      fontSize: "20rem !important",
      // color:'rgba(80,137,62,0.3)'
      color: "#444",
    },
  },
});

export const AreaTexto = styled("div", {
  positoin: "absolute",
  top: "0px",
  margin: "0",
  padding: "0",
  textAlign: "center",

  h5: {
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: "$19 !important",
    color: "#444",
  },
  p: {
    padding: "0",
    margin: "0",
  },
  a: {
    padding: "$12",
    margin: "0",
    fontWeight: "900",
    backgroundColor: "#444",
    "&:hover": {
      backgroundColor: "#ccc",
      color: "#444",
    },
  },
});
