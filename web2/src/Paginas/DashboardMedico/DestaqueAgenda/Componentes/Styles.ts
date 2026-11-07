import { styled } from "@/stitches.config";
import { Card } from "@mui/material";
export const CardCustom = styled(Card, {
  variants: {
    type: {
      consultas: {
        backgroundColor: "$StatusConsulta !important",
        color: "#444 !important",
      },
      Procedimentos: {
        backgroundColor: "$StatusProcedimentos !important",
        color: "#444 !important",
      },
      blue: {
        backgroundColor: "$StatusSolicitadas !important",
        color: "#444 !important",
      },
      Autorizadas: {
        backgroundColor: "$StatusAutorizadas !important",
        color: "#fff !important",
      },
      Pendentes: {
        backgroundColor: "$StatusPendentes !important",
        color: "#fff !important",
      },
      Agendadas: {
        backgroundColor: "$StatusAgendadas !important",
        color: "#fff !important",
      },
    },
  },
});
