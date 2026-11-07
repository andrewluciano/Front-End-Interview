import { styled } from "@/stitches.config";

export const Container = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  fontSize: "3rem",
  height: "calc(100vh - 90px)",
  width: "100%",
  boxSizing: "border-box",
  padding: "0px",
  margin: "0",
  gap: "20px",

  alignItems: "flex-start",
  overflow: "auto",
  scrollbarColor: "#ccc transparent",
  scrollbarWidth: "thin",
});
