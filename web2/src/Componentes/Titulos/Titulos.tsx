import { type FC } from "react";

import { TypographyCustom } from "./styles";
import { Typography } from "@mui/material";

interface IMyProps {
  titulo: string;
  subTitulo: string;
  icone: Node;
}

export const Titulos: FC<IMyProps> = (props: IMyProps) => {
  return (
    <>
      <Typography
        variant="h4"
        className={"TituloPagina"}
        sx={{ fontWeight: "650", fontSize: "2rem" }}
      >
        {props.titulo}
      </Typography>
      {props.subTitulo && (
        <Typography
          variant="body2"
          className={"SubTituloPagina"}
          sx={{ color: "#666" }}
        >
          {props.subTitulo}
        </Typography>
      )}
    </>
  );
};
