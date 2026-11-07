import { type FC } from "react";

import { ButtonClose } from "./styles";

interface IMyProps {
  titulo: string;
  link: string;
  tamanho: string;
  click: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tipo: string;
  icone: string;
  disabled: boolean;
}

export const BotaoFechar: FC<IMyProps> = (props: IMyProps) => {
  return (
    <>
      {!props.disabled ? (
        <ButtonClose
          to={props.link}
          onClick={props.click || ""}
          tipo={"fechar"}
        >
          <span>+</span>
        </ButtonClose>
      ) : (
        <ButtonClose to="#" onClick={props.click || ""} tipo={"disabled"}>
          <span>+</span>
        </ButtonClose>
      )}
    </>
  );
};
