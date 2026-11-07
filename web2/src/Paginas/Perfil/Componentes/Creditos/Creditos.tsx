import { type FC } from "react";
import { formatarParaCentenas } from "@/helpers/format";
import { useQuery } from "react-query";
import Api from "@/APIS/Usage";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";
import { Add, CalendarToday } from "@mui/icons-material";

const creditos = {
  usage: 0,
  available: 1000000,
  plan: "free",
  expiration_date: "01/03/2026",
};

export const Creditos: FC = () => {
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
  const handleAddCredits = () => {
    console.log("implementar funcao");
  };
  const PaymentSkeleton = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );

  return (
    <Card sx={{ borderColor: "primary.main", borderWidth: 1 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            <Typography variant="h5" component="h2">
              Créditos Disponíveis
            </Typography>
          </Box>
        }
      />
      <CardContent>
        {isFetching ? (
          <PaymentSkeleton />
        ) : (
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            // justifyContent="space-between"
            alignItems={{ md: "flex-start" }}
            gap={10}
          >
            <Stack
              spacing={2}
              sx={{ justifyContent: "space-between", minHeight: "220px" }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Saldo Atual
                </Typography>
                <Typography variant="h2" color="primary" fontWeight="bold">
                  {formatarParaCentenas(
                    hasContent.available - hasContent.usage,
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  créditos
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Válido até: <strong>{hasContent.expiration_date}</strong>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddCredits}
                  disabled
                >
                  Adicionar Créditos
                </Button>
              </Box>
            </Stack>
            <Stack
              spacing={2}
              sx={{ justifyContent: "space-between", minHeight: "220px" }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Plano Atual
                </Typography>
                <Typography variant="h2" color="primary" fontWeight="bold">
                  {hasContent.plan}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddCredits}
                  disabled
                >
                  Upgrade de Plano
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
