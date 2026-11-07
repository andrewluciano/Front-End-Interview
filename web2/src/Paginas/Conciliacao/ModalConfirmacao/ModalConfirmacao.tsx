import {
  Box,
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  styled,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";

import { type FC, type FormEvent, useState } from "react";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";

import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import Api from "../API/Conciliacao";

// Icones

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// APIS
import { useModal } from "@/Autenticacao/ModalContext";
import { formatarParaCentenas } from "@/helpers/format";

interface IMyProps {}

export const ModalConfirmacao: FC<IMyProps> = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const PaymentSkeleton = () => (
    <>
      <Box
        sx={{
          position: "fixed",
          zIndex: "999",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "center",
          width: "200px",
          p: "10px",
          backgroundColor: "rgba(255,255,255,0.4)",
        }}
      >
        <LinearProgress sx={{ maxWidth: "200px" }} />
      </Box>
    </>
  );

  const dadosConfirmacaoPlanner = useQuery(
    ["ConfirmacaoPlanner"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetConciliationsAutomaticaPlanner();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosConfirmacaoPlanner?.isLoading;
  const hasContent = dadosConfirmacaoPlanner?.data?.content ?? [];

  const handleConciliacaoAutomatica = async () => {
    setSnackbarMessage("Conciliação automática em andamento...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    const apiInstance = await Api.create();
    const response = await apiInstance.PostAutoConciliation();

    if (!response?.is_error) {
      setSnackbarMessage(
        response?.message || "Conciliação automática realizada com sucesso",
      );
      setSnackbarSeverity("success");
      setTimeout(() => {
        closeModal();
      }, 1500);
    } else {
      setSnackbarMessage(
        response?.message || "Erro ao realizar conciliação automática",
      );
      setSnackbarSeverity("error");
    }
  };

  return (
    <Grid container sx={{ p: 1 }}>
      {isFetching ? (
        <PaymentSkeleton />
      ) : (
        hasContent.map((item) => (
          <>
            <Grid container size={{ xs: 12 }} key={item.id}>
              <Grid container size={{ xs: 12 }}>
                <Typography variant="h5">
                  <strong>Resumo</strong>
                </Typography>
              </Grid>
              <Grid container sx={{ py: 2 }}>
                <Grid container size={{ xs: 12 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body1">Total de arquivos:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>{item.total_files}</Grid>
                </Grid>
                <Grid container size={{ xs: 12 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body1">Tamanho Total:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    {item.total_size_mb.toFixed(2)} mb
                  </Grid>
                </Grid>
                <Grid container size={{ xs: 12 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="h6">Créditos:</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="h6">
                      {formatarParaCentenas(item.credits)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{ py: 2 }} size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                O consumo de créditos é calculado com base no tamanho e volume
                dos arquivos, além da complexidade técnica para análise e
                resolução da conciliação. Quanto maior o processamento e o tempo
                de resposta exigido, proporcional será o custo.
              </Typography>
            </Grid>
            <Grid container sx={{ py: 2 }}>
              <BotaoPadrao
                size="large"
                titulo="Confirmar Conciliação"
                variant="contained"
                type="submit"
                startIcon={<CheckIcon />}
                onClick={() => handleConciliacaoAutomatica()}
              />
              &nbsp;
              <Button
                size="large"
                onClick={() => closeModal()}
                startIcon={<CloseIcon />}
              >
                Cancelar
              </Button>
            </Grid>
          </>
        ))
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
