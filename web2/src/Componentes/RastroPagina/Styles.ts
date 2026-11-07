import { styled } from "@/stitches.config";
import Grid from "@mui/material/Grid";

export const Container = styled(Grid, {
  // background: `linear-gradient(45deg,rgba(30, 58, 95, 1) 0%, rgba(77, 184, 162, 1) 100%)`,
  display: "flex",
  backgroundSize: "cover",
  position: "relative",
  top: "-5px",
  textTransform: "uppercase",
  fontSize: "$10",
  justifyContent: "flex-start",
  height: "18px",
  ol: {
    margin: "0",
    paddeing: "0",
    padding: "0",
    color: "$SonicSilver",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",

    li: {
      position: "relative",
      // maxHeight:'13px',
      // margin:'0',
      // paddeing:'0',

      display: "flex",
      aligmItens: "center",
      justifyContent: "center",
      maxHeight: "15px",
      height: "13px",

      "&.MuiBreadcrumbs-separator": {
        top: "-0px",
        // transform:'translateY(-35%)',
        lineHeight: "0px",
        height: "0",
        fontWeight: "1000",
        color: "$primaryColor",
        fontSize: "14px",
      },
      "&:last-child": {
        a: {
          color: "$primaryColor",
          fontWeight: "1000",
        },
      },
    },
  },
  p: {
    fontSize: "$10",
    margin: "0",
    padding: "0",
    // lineHeight:'initial',
    fontWeight: "bold",
    color: "$darkGray",
    maxHeight: "15px",
  },
  a: {
    fontSize: "$10",
    fontWeight: "500",
    textDecoration: "none",
    margin: "0",
    padding: "0",
    color: "$SonicSilver",
  },
  span: {
    fontSize: "$10",
    fontWeight: "bold",
    textDecoration: "none",
    margin: "0",
    padding: "0",
    color: "$primaryColor",
  },
});
