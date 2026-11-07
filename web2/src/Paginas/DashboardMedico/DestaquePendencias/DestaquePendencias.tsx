import { type FC } from "react";
import Grid from "@mui/material/Grid";

import { BlocoPendencias } from "./Componentes/BlocoPendencias";

import { useQuery } from "react-query";
import Api from "../API/Bullets";

import LinearProgress from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";

export const DestaquePendencias: FC<{
  VlQtPendencias: (QtPendencias: number) => void;
}> = ({ VlQtPendencias }) => {
  const DashboardMedicoPendencies = useQuery(
    ["DashboardMedicoPendencies"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetDashboardMedicoPendencies();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = DashboardMedicoPendencies.isLoading;
  const hasContent = DashboardMedicoPendencies?.data?.content ?? [];
  VlQtPendencias(DashboardMedicoPendencies?.data?.length || 0);

  const PaymentSkeleton = () => (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{ height: "180px", alignContent: "center", justifyContent: "center" }}
    >
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </Grid>
  );

  return (
    <>
      <Grid sx={{ gap: "10px", pt: 2 }} container size={{ sm: 12 }}>
        {isFetching && <PaymentSkeleton />}
        {!isFetching && <BlocoPendencias dados={hasContent} />}
      </Grid>
    </>
  );
};
