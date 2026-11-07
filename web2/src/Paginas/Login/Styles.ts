import { styled } from "@/stitches.config";
import Grid from "@mui/material/Grid";

import Simbolo from "@/assets/imagens/LoginDestaque.jpg";

export const Container = styled(Grid, {
  background: `linear-gradient(45deg,rgba(30, 58, 95, 1) 0%, rgba(77, 184, 162, 1) 100%)`,
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  flexDirection: "row",
  boxSizing: "border-box",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  ".AreaLogin": {
    transition: "all .2s ease-in-out",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
    padding: "20px",
    minHeight: "50vh",
    backgroundColor: "#fff",
    borderRadius: "4px",
    maxWidth: "400px",
    minWidth: "375px",
    alignItems: "center",
    justifyContent: "center",
    "@md2": {
      // minWidth: "98vw",
      minWidth: "350px",
      maxWidth: "350px",
      // height: "98vh",
    },
  },

  ".Bloco1": {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    background: "#fff",
    // width: "35vw",
    height: "100%",
    zIndex: "9",
    backgroundImage: `url('${Simbolo}')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    img: {
      height: "100%",
    },
  },
  ".Bloco2": {
    // width: "65vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9",
    a: {
      transition: "all .2s ease-in-out",
      color: "#333",
      textDecoration: "underline",
      cursor: "pointer",
      "&:hover": {
        color: "$primaryColor",
      },
    },
  },
  ".AreaForm": {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    maxWidth: "350px",
    "@md2": {
      maxWidth: "310px",
      // border:'1px solid red']
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "20px 0 !important",
    padding: "0 !important",

    ".AreaBotoes": {
      button: {
        backgroundColor: "$primaryColor",
        "&:hover": {
          backgroundColor: "$secondaryColor",
        },
      },
    },
  },
  "&:before": {
    width: "100%",
    height: "100%",
    overflow: "none",
    content: "",
    position: "absolute",
    top: "0",
    left: "0",
    // backgroundImage:`url("${Simbolo}")`,
    backgroundPosition: "-10%",
    backgroundSize: "200%",
    zIndex: "0",
    opacity: "0.2",
  },
  "&.nulo": {
    background: "#efefef !important",
  },
  ".actionLoginAnimation": {
    position: "absolute",
    transition: "all .2s ease-in-out",
    opacity: "0",
    filter: "scale(0)",
    "&.actionLoginAnimationCarregando": {
      opacity: "1",
      filter: "scale(1)",
    },
    "&.actionLoginAnimationCarregado": {
      opacity: "0",
      filter: "scale(0)",
    },
  },
});
