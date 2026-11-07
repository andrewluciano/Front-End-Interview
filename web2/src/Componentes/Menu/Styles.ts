// import { styled } from '@stitches/react';
import { styled } from "@/stitches.config";
import Box from "@mui/material/Box";

import Simbolo from "@/assets/imagens/Logo/simbolo.svg?url";

// export const LogoSimbolo = styled("",{

// })
export const Container = styled(Box, {
  // position: "relative",
  position: "absolute",
  justifyContent: "flex-start",
  display: "flex",
  overflow: "inherit",
  flexDirection: "column",
  backgroundColor: "#fff",
  boxSizing: "border-box",
  padding: "0",
  margin: "0px 0 0px 0",
  transition: "all 0.2s ease-in-out",
  gap: "20px",
  height: "calc(100vh - 62px)",
  borderRadius: "0px",
  boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
  zIndex: "999",
  left: "-120px",

  "@md2": {
    left: "-120px",
    position: "absolute",
  },
  // boxShadow:
  // border:'1px solid $nwSlate300',
  //   "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",

  ul: {
    position: "relative",
    height: "100%",
    padding: "0",
    transition: "all 0.2s ease-in-out",
    overflow: "hidden",
    ".versao": {
      padding: "1px 1px 1px 5px",
      display: "flex",
      position: "absolute",
      width: "100%",
      bottom: "55px",
      fontSize: "0.5rem",
      color: "@primaryColor",
      textTransform: "uppercase",
      opacity: "0.4",
      letterSpacing: "1px",
    },
    a: {
      padding: "8px 8px 8px 10px",
      display: "flex",
      justifyContent: "flex-start",
      transition: "all 0.2s ease-in-out",

      "&:hover": {
        backgroundColor: "$primaryColor",
        span: {
          color: "#fff",
        },
        svg: {
          color: "#fff",
        },
      },
      "&.Mui-selected": {
        backgroundColor: "$primaryColor",
        span: {
          color: "#fff",
        },
        svg: {
          color: "#fff",
        },
        "&:hover": {
          backgroundColor: "#333",
          filter: "brightness(1.5)",
          span: {
            color: "#333",
          },
          svg: {
            color: "$primaryColor",
          },
        },
      },
      span: {
        transition: "all 0.2s ease-in-out",
        fontSize: "$11",
        color: "$primaryColor",
        lineHeight: "12px",
        textTransform: "uppercase",
        boxSizing: "border-box",
        paddingTop: "1px",
        width: "0px",
        height: "12px",
        opacity: "0",
        overflow: "hidden",
      },

      "&:last-child": {
        backgroundColor: "$darkGray",
        position: "absolute",
        width: "100%",
        bottom: "0",
        borderRadius: "0",
        span: {
          color: "#fff",
        },
        svg: {
          color: "#fff",
        },
      },
    },
  },

  variants: {
    open: {
      true: {
        width: "180px",
        "@md2": {
          left: "0px",
        },
        ul: {
          transition: "all 0.2s ease-in-out",
          a: {
            width: "180px",
            justifyContent: "flex-start",
            color: "$nwGray800",
            transition: "all 0.2s ease-in-out",

            span: {
              position: "relative",
              left: "5px",
              opacity: "1",
              width: "auto",
              transition: "all 0.2s ease-in-out",
            },
          },
        },
      },
      false: {
        width: "56px",
        ul: {
          a: {
            justifyContent: "flex-start",

            transition: "all 0.2s ease-in-out",

            span: {
              position: "relative",
              left: "5px",
              opacity: "1",
              width: "56px",
              transition: "all 0.2s ease-in-out",
            },
          },
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
    backgroundImage: `url("${Simbolo}")`,
    backgroundPosition: "-350px 400px",
    backgroundSize: "800px",
    backgroundRepeat: "no-repeat",
    zIndex: "0",
    opacity: "0.1",
  },
});
