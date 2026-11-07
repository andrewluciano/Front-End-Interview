import { styled } from "@/stitches.config";
import { Grid } from "@mui/material";
import TabList from "@mui/lab/TabList";

export const GridCustom = styled(Grid, {
  ".aaa": {
    boxSizing: "border-box",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow:
      "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  },
  ".BlocoSemBotao": {
    border: "1px solid red",
    "@md2": {
      button: {
        display: "none",
      },
    },
  },
});

export const TabListCustom = styled(TabList, {
  backgroundColor: "#E2E8F0",
  maxHeight: "40px",
  minHeight: "40px",
  boxSizing: "border-box",
  alignItems: "center",
  justifyContent: "center",
  ".MuiTab-root": {
    margin: "5px 5px",
    maxHeight: "30px",
    minHeight: "30px",
    fontWeight: "400",
    padding: "0px 0px",
    fontSize: "0.8rem",
    borderRadius: "5px",
    color: "$nwSlate500",
    textTransform: "capitalize !important",
  },
  ".Mui-selected": {
    position: "relative",
    backgroundColor: "#fff",
    borderBottom: "none !important",
    zIndex: "99",
    fontWeight: "600",
    color: "#333 !important",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
  },
  ".MuiTabs-indicator": {
    display: "none",
  },
});
