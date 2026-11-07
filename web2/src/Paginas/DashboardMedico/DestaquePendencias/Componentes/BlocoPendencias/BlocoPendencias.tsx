import { type FC } from "react";
import { Grid, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import { BlocoSemPendencias } from "./Styles";

import { dateSimple } from "@/helpers/format";
import { useNavigate } from "react-router-dom";

interface IBlocoFaturamentoProps {
  tipo: "a-pagar" | "glosado" | "pagos";
}
export const BlocoPendencias: FC<IBlocoFaturamentoProps> = ({ dados }) => {
  const navigate = useNavigate();

  const handleClick = (identifier: string) => {
    navigate(`/procedimentos?Procedimento=${identifier}`, { replace: true });
  };

  return (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{
        display: "flex",
        gap: "10px",
        width: "100%",
        height: "100%",
        maxHeight: "250px",
        overflowY: "auto",
        p: 0.5,
      }}
    >
      {dados.length === 0 && (
        <BlocoSemPendencias container sx={{ p: 2 }}>
          <Typography
            variant="subtitle2"
            component={"p"}
            sx={{ fontWeight: "bold" }}
          >
            Nenhuma pendência <br /> registrada
          </Typography>
        </BlocoSemPendencias>
      )}

      {dados?.map((item, index) => (
        <Alert
          key={index}
          icon={false}
          sx={{
            p: 1,
            borderRadius: "5px",
            boxShadow: "0px 0px 0px 3px  rgba(0,0,0,0.1)",
            width: "100%",
            cursor: "pointer",
          }}
          severity={item?.status}
          onClick={() => handleClick(item?.identifier)}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {item?.type}
          </Typography>
          <Typography variant="caption" sx={{ pr: 0.5 }}>
            {dateSimple(item?.created_at)}
          </Typography>
          <Typography variant="caption">{item?.description}</Typography>
          <br />
          <Typography variant="caption">{item?.status}</Typography>
        </Alert>
      ))}
    </Grid>
  );
};
