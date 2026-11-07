import { type FC } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { BlocoProcedimentos } from "./Styles";

export interface IDadosProcedimento {
  title: string;
  value: number;
}
export const CardsProcedimentos: FC<IDadosProcedimento> = ({
  title,
  value,
}) => {
  // const PaymentSkeleton = () => (
  //   <Grid container size={12} sx={{ height: "80" }}>
  //     <Grid size={3} className="Loading">
  //       <BarLoader color="#4db8a2" />
  //     </Grid>
  //   </Grid>
  // );

  return (
    <>
      <BlocoProcedimentos type={title}>
        <CardContent>
          <Typography variant="h3" component="h3">
            {title || "sem valor"}
          </Typography>
          <Typography variant="h2" component="h2">
            {value || "sem valor"}
          </Typography>
        </CardContent>
      </BlocoProcedimentos>
    </>
  );
};
