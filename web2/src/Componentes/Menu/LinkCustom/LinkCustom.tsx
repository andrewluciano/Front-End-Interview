import { type FC } from "react";

import { Button } from "./styles";

interface IMyProps {
  titulo: string;
  link: string;
  tamanho: string;
  click: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tipo: string;
  icone: string;
  disabled: boolean;
}

export const LinkCustom: FC<IMyProps> = (props: IMyProps) => {
  return (
    <>
      {!props.disabled ? (
        <Button
          to={props.link}
          onClick={props.click || ""}
          Largura={props.tamanho}
          tipo={props.tipo || "default"}
        >
          {props.icone} <span>{props.titulo}</span>
        </Button>
      ) : (
        <Button
          to="#"
          onClick={props.click || ""}
          Largura={props.tamanho}
          tipo={"disabled"}
        >
          {props.icone} <span>{props.titulo}</span>
        </Button>
      )}
    </>
  );
};
