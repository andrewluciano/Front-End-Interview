import { type FC } from "react";
import DateObject from "react-date-object";

interface IMyProps {
  data: Date;
}

export const DataSimples: FC<IMyProps> = (props) => {
  const date = new DateObject(props?.data);

  return date.format("DD/MM/YYYY");
};
