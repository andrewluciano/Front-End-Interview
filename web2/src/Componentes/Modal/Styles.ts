import { styled } from "@/stitches.config";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export const BoxCustom = styled(Box, {
  "@md2": {
    // top:'0px !important',
    // left:'0px !important',
    // top: "10% !important",

    // transform: "translateX(-50%) !important",
    boxSizing: "border-box !important",
    width: "95vw !important",
    // height: "90vh !important",
    // minHeight: "85vh !important",
    maxHeight: "85 vh !important",
    padding: "20px !important",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
});
export const ModalCustom = styled(Modal, {
  "@md2": {
    maxWidth: "100vw",
    // top:'0px !important',
    // left:'0px !important',
  },
});

export const CustomConteudoModal = styled(Grid, {
  overflow: "hidden",
  "@md2": {
    width: "85vw !important",
    padding: "0px",
    overflowY: "scroll",
  },
});
