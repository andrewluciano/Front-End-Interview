/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import { type FC, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useMutation, useQueryClient } from "react-query";
import Api from "../API/GestaoArquivos";

import { useModal } from "@/Autenticacao/ModalContext";

export const ReprocessarArquivo: FC = (props: any) => {
  const { closeModal } = useModal();

  const queryClient = useQueryClient();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({ open: false, message: "", severity: "info" });

  const { mutate: AcaoReprocessarArquivo } = useMutation(async () => {
    setSnackbar({
      open: true,
      message: "Reprocessando...",
      severity: "info",
    });

    const apiInstance = await Api.create();

    const response = await apiInstance.ReprocessarArquivos(
      props?.DadosSelecionados?.identifier,
    );

    if (!response?.is_error) {
      setSnackbar({
        open: true,
        message: response?.message || "Reprocessado com Sucesso",
        severity: "success",
      });

      setTimeout(() => {
        closeModal();
        queryClient.invalidateQueries();
        queryClient.refetchQueries();
      }, 2000);
    } else {
      setSnackbar({
        open: true,
        message: response?.message || "Erro ao reprocessar arquivo",
        severity: "error",
      });

      setTimeout(() => {
        closeModal();
        queryClient.invalidateQueries();
        queryClient.refetchQueries();
      }, 2500);
    }

    return response;
  });

  return (
    <>
      <Grid container size={{ xs: 12 }} sx={{ padding: "10px" }}>
        <Typography>
          Você deseja realmente reprocessar o Arquivo -{" "}
          <strong>{props?.DadosSelecionados?.nome}</strong>
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Button
          onClick={() => AcaoReprocessarArquivo()}
          variant="contained"
          startIcon={<DeleteForeverIcon />}
        >
          Confirmar Reprocessamento
        </Button>
        <Button
          size="large"
          onClick={() => closeModal()}
          startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "info" ? null : 2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
