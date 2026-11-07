import { styled } from "@/stitches.config";

export const Container = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  fontSize: "3rem",
  height: "auto",
  width: "100%",
  // borderRadius:'10px',
  boxSizing: "border-box",
  padding: "0px",
  margin: "0",
  gap: "20px",
  flexWrap: "wrap",
  flex: "1",
});

export const AreaDestaque = styled("div", {
  position: "relative",
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "row",
  boxSizing: "border-box",
  // borderRadius:'10px',
  backgroundColor: "#fff",
  width: "auto",
});

export const BlocoDestaque = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  boxSizing: "border-box",
  padding: "0px",
  flex: "3",
  color: "#333",
  p: {
    margin: "0",
    boxSizing: "border-box",
    padding: "8px 20px",
    fontSize: "0.8rem",
  },
  variants: {
    tipo: {
      destaque: {
        // borderRadius:'10px',
        backgroundColor: "$primaryColor",
        color: "#fff",
      },
    },
  },
});
