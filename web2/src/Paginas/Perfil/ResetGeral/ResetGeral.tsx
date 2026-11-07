/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type FC, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "react-query";
import Api from "@/APIS/Reset";
import { useModal } from "@/Autenticacao/ModalContext";

export const ResetGeral: FC = (props: any) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const identifier =
    props?.DadosSelecionados?.id || props?.DadosSelecionados?.identifier;

  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({ open: false, message: "", severity: "info" });

  const { mutate: acaoEditarPerfil, isLoading } = useMutation(async () => {
    setSnackbar({
      open: true,
      message: "Resetando a plataforma",
      severity: "info",
    });

    const apiInstance = await Api.create();
    const response = await apiInstance.ResetPlataforma(identifier);

    if (!response?.is_error) {
      setSnackbar({
        open: true,
        message: response?.message || "Plataforma Resetada com Sucesso",
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
        message: response?.message || "Erro ao Resetar a Plataforma",
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

  const onChange = (token: string | null) => {
    setCaptchaToken(token);
    console.log("Captcha token:", token);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Typography variant="body2" sx={{ marginBottom: "10px" }}>
          Esta operação irá apagar permanentemente todos os dados e históricos
          da plataforma. Uma vez confirmada, a recuperação será impossível.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: "10px",
            fontWeight: "bold",
            color: "error.main",
          }}
        >
          Deseja mesmo resetar todo o sistema e perder os dados?
        </Typography>
      </Grid>

      <Grid>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6Lc95pQsAAAAAN0sKDHhRkwMRI0iQUAvFgtwHD0n" // Substitua pela sua chave real
          onChange={onChange}
        />
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{ padding: "10px", justifyContent: "flex-end" }}
      >
        <Button
          size="large"
          color="default"
          onClick={() => closeModal()}
          // startIcon={<CloseIcon />}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => acaoEditarPerfil()}
          variant="contained"
          color="error"
          disabled={!captchaToken}
          startIcon={<Check />}
          // disabled={isLoading}
        >
          Confirma o Reset
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
