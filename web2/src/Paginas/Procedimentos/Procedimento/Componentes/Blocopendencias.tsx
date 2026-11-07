import { Alert, AlertTitle, Box, Grid } from "@mui/material";
import { type FC } from "react";

import Api from "../../API/Procedimentos";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";
import { useSearchParams } from "react-router-dom";

interface EscolhaProps {
  Close: () => void;
  identifier: string;
  OpenManual: () => void;
  OpenVivIA: () => void;
}

export const BlocoPendencias: FC<EscolhaProps> = () => {
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get("Procedimento");

  console.log("identifier", identifier);
  const dadosListaPendencias = useQuery(
    ["ListaPendencias"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetPendencias(identifier);
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosListaPendencias?.isLoading;
  const hasContent = dadosListaPendencias?.data?.content ?? [];

  console.log("dadosListaPendencias", hasContent.length);

  const PaymentSkeleton = () => (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </>
  );

  return (
    <Grid container spacing={2} size={{ sm: 12, xs: 12 }}>
      {isFetching && <PaymentSkeleton />}
      {!isFetching && hasContent.length === 0 && (
        <Alert severity="info" sx={{ width: "100%" }}>
          <AlertTitle>Sem Pendências</AlertTitle>
          Nenhum pendência encontrada.
        </Alert>
      )}
      {!isFetching &&
        hasContent.length >= 1 &&
        hasContent.map((item) => (
          <Alert
            severity="warning"
            sx={{ width: "100%" }}
            key={item.identifier}
          >
            <AlertTitle>{item.title}</AlertTitle>
            {item.description}
          </Alert>
        ))}
    </Grid>
  );
};
