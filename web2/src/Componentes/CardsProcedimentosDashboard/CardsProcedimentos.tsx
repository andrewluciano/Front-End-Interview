import { type FC } from "react";

import { theme } from "@/stitches.config";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { currency } from "@/helpers/format";

import { BlocoProcedimentos } from "./Styles";

export interface IDadosProcedimento {
  title: string;
  value: number;
  subitens?: IDadosProcedimentoDetalhe[];
  outher?: { valor_receber?: number; valor_recebido?: number };
}
export interface IDadosProcedimentoDetalhe {
  item: string;
  value: number;
  outher: [];
}
export const CardsProcedimentos: FC<
  IDadosProcedimento & { subitens?: IDadosProcedimentoDetalhe[] }
> = ({ title, value, subitens, outher }) => {
  // const PaymentSkeleton = () => (
  //   <Grid container size={12} sx={{ height: "80" }}>
  //     <Grid size={3} className="Loading">
  //       <BarLoader color="#4db8a2" />
  //     </Grid>
  //   </Grid>
  // );

  return (
    <BlocoProcedimentos tipo={title}>
      <CardContent>
        <Typography variant="h3" component="h3">
          {title || "sem titulo"}
        </Typography>
        <Typography variant="h2" component="h2">
          {value || value === 0 ? value : "sem valor"}
        </Typography>
        {subitens?.map((item, index) => (
          <Typography
            key={index}
            variant="caption"
            component="p"
            sx={{
              p: 0,
              m: 0,
              lineHeight: "16px",
              fontSize: `${theme.fontSizes[12]} !important`,
            }}
          >
            {item.value} {item.item}
          </Typography>
        ))}

        <Typography
          variant="caption"
          component="p"
          sx={{
            p: 0,
            m: 0,
            lineHeight: "16px",
            fontWeight: "bold",
            fontSize: `${theme.fontSizes[12]} !important`,
          }}
        >
          {currency(
            Number(
              (title ?? "").trim().toLowerCase() === "total"
                ? outher?.valor_receber
                : (title ?? "").trim().toLowerCase() === "pagos"
                  ? outher?.valor_recebido
                  : (title ?? "").trim().toLowerCase() === "glosas"
                    ? value
                    : (outher?.valor_receber ?? 0),
            ),
          )}
        </Typography>
      </CardContent>
    </BlocoProcedimentos>
  );
};
