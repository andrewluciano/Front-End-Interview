import { keyframes } from "@stitches/react";
import { styled } from "@/stitches.config";
// import styled from 'styled-components';

export const Container = styled("div", {});
export const AreaBarra = styled("div", {
  borderRadius: "5px",
  backgroundColor: "#D9D9D9",
  width: "90%",
  height: "5px",
});

export const ProgressoAnimacao = keyframes({
  "0%": { width: "0" },
});

export const Barra = styled("div", {
  transition: "all .2s ease-in-out",
  borderRadius: "5px",
  backgroundColor: "#333",
  // width: `$$progesso`,
  height: "5px",
  animation: `${ProgressoAnimacao} 0.3s`,

  variants: {
    prazo: {
      bom: {
        backgroundColor: "green",
      },
      medio: {
        backgroundColor: "orange",
      },
      alto: {
        backgroundColor: "red",
      },
    },
  },
});
