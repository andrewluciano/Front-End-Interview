import { type FC } from "react";
// import paragrafo from './styles';
import { Tooltip, type TooltipProps } from "@mui/material";

type PositionPlacement = TooltipProps["placement"];

interface CutTextProps {
  props: [];
  value: string;
  contagem: number;
  position: PositionPlacement;
  cont: number;
}

export const CutText: FC<CutTextProps> = ({ value, contagem, position }) => {
  // props.contagem = props.contagem || 20;
  const cont = contagem || 20;
  const pos = position || "bottom";
  const pontos = value.length > contagem ? "..." : "";
  return (
    <Tooltip placement={pos} title={value}>
      <span>{value.substring(0, cont) + pontos}</span>
    </Tooltip>
  );
};
