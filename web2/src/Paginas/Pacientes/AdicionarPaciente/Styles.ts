import { styled } from "@/stitches.config";

export const Content = styled("div", {});
export const TabPanelCustom = styled("div", {
  padding: "20px 0",
  variants: {
    visivel: {
      true: {
        display: "flex",
      },
      false: {
        display: "none",
      },
    },
  },
});
