import { type FC } from "react";
import { Grid, LinearProgress, Typography } from "@mui/material";
import { formatarParaCentenas } from "@/helpers/format";
import Api from "@/APIS/Usage";
import { useQuery } from "react-query";

const creditos = {
  usage: 0,
  available: 0,
  plan: "free",
  expiration_date: "01/03/2026",
};

export const CreditosCabecalho: FC = () => {
  const dadosListaCreditos = useQuery(
    ["listaCreditos"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetUsage();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaCreditos?.isLoading;
  const hasContent = dadosListaCreditos?.data?.content[0] ?? creditos;

  return (
    <Grid
      container
      size={{ sm: 2.5, xs: 5.5 }}
      flexDirection="row"
      sx={{
        gap: "5px",
        py: 0,
        px: 0,
      }}
    >
      <Grid
        container
        flexDirection="row"
        alignItems={"center"}
        sx={{ width: "100%" }}
      >
        <Grid container size={{ sm: 12, xs: 12 }}>
          <Typography
            variant="caption"
            color="textPrimary"
            sx={{
              p: 0,
              color: "#666",
            }}
          >
            Créditos disponiveis
          </Typography>
        </Grid>
        <Grid container size={{ sm: 12, xs: 12 }} justifyContent={"flex-start"}>
          {isFetching ? (
            <LinearProgress value={29} sx={{ height: "7px", width: "100%" }} />
          ) : (
            <Typography
              variant="caption"
              color="textPrimary"
              sx={{
                p: 0,
                fontSize: "0.75rem",
                fontWeight: "bold",
                lineHeight: "14px",
                textAlign: "right",
              }}
            >
              {formatarParaCentenas(hasContent.available - hasContent.usage)}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid sx={{ width: "100%", display: "none" }}>
        {isFetching ? (
          <LinearProgress value={29} sx={{ height: "7px", width: "100%" }} />
        ) : (
          <LinearProgress
            variant="determinate"
            value={
              hasContent.available > 0
                ? (hasContent.usage / hasContent.available) * 100
                : 0
            }
            sx={{ height: "7px" }}
          />
        )}
      </Grid>
    </Grid>
  );
};
