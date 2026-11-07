import {
  Box,
  Divider,
  Grid,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";

import { SemPendencias, BlocoSemPendencias, BlocoPendencias } from "./Styles";

import Api from "./API/Pendencias";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

// import { Scrollbars } from "react-custom-scrollbars";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { FC } from "react";
import { CutText } from "@/Componentes/CutText";
import { useNavigate } from "react-router-dom";

export const Pendencias: FC = () => {
  const navigate = useNavigate();
  const dadosPendencias = useQuery(
    ["dadosPendencias"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetPendencias();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosPendencias?.isLoading;

  const hasContent = dadosPendencias?.data?.content ?? [];

  const PaymentSkeleton = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );

  return (
    <Grid
      container
      size={{ sm: 12, xs: 12 }}
      sx={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        p: 2,
        alignItems: "flex-start",
        borderRadius: "5px",
        justifyContent: "flex-start",
      }}
    >
      {/* <Typography variant="h6" sx={{ padding: "10px 0 0 0", width:'100%'}}>
        Pendências
      </Typography> */}

      {isFetching && <PaymentSkeleton />}

      {!isFetching && (
        <>
          {hasContent.length === 0 && (
            <BlocoSemPendencias>
              <Typography component={"p"} variant="subtitle1">
                Sem Pendências
              </Typography>
              <SemPendencias />
            </BlocoSemPendencias>
          )}

          <BlocoPendencias
            container
            spacing={1}
            sx={{
              minWidth: "200px",
              borderRadius: "5px",
              height: "400px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "0px",
            }}
          >
            {hasContent.length > 0 &&
              hasContent?.map((item) => {
                return (
                  <>
                    <Alert
                      severity="warning"
                      sx={{ width: "100%", cursor: "pointer" }}
                      key={item?.identifier}
                      onClick={() =>
                        navigate(`?Procedimento=${item?.identifier}`, {
                          replace: true,
                        })
                      }
                    >
                      <AlertTitle
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <WarningRoundedIcon sx={{ width: "20px" }} />
                        {item?.title}
                      </AlertTitle>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        <CutText value={item?.description} contagem="23" />
                      </Typography>
                    </Alert>
                    <Divider />
                  </>
                );
              })}
          </BlocoPendencias>
        </>
      )}
    </Grid>
  );
};
