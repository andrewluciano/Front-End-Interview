/* eslint-disable @typescript-eslint/no-explicit-any */

import { type FC } from "react";

import { ButtonCustom } from "./styles";

interface IMyProps {
  titulo: string;
  link: any;
  tamanho: any;
  click: any;
  tipo: any;
  size: any;
  icone: any;
  disabled: boolean;
  variant: any;
  type: any;
}

export const BotaoPadrao: FC<IMyProps> = (props: IMyProps) => {
  return (
    <>
      {!props.disabled ? (
        <ButtonCustom {...props}>
          {props.titulo} {props.icone}
        </ButtonCustom>
      ) : (
        <ButtonCustom
          to="#"
          onClick={props.click || ""}
          Largura={props.tamanho}
          {...props}
        >
          {props.titulo} {props.icone}
        </ButtonCustom>
      )}
    </>
  );
};
