/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "./Styles";

import LinearProgress from "@mui/material/LinearProgress";

import { setItem, getItem } from "@/helpers/armazenamento";
import { useMutation } from "react-query";
import ApiDados from "@/APIS/DadosMe";

import Logo from "@/assets/imagens/Logo/logo-fatura-viva.svg?svg";

import toast from "react-hot-toast";
import { Box, Grid, Button, Snackbar, Alert } from "@mui/material";

export const ActionLogin: FC = () => {
  document
    .getElementById("loginActionAnimacoes")
    ?.classList.add("actionLoginAnimationCarregando");
  const navigate = useNavigate();

  const location = useLocation();
  const token = location.state;

  const [sessionn] = useState(null);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const { mutate: refetchDadosMe } = useMutation(
    ["dadosMe"],
    async () => {
      toast.loading("Carregando Dados de Usuário...");

      const apiInstance = await ApiDados.create();
      const response = await apiInstance.DadosMe(token);

      if (!response) {
        throw new Error("Erro ao carregar dados: Sem resposta do servidor.");
      }

      if (response?.statusCode === 500) {
        throw new Error("Erro interno do servidor (500).");
      }

      if (!response?.is_error) {
        toast.dismiss();
        setItem("dados_users", JSON.stringify(response));
        setItem("onBoarding", response?.onboarding);
        return response;
      }
      throw new Error(response?.message || "Erro ao carregar dados.");
    },
    {
      enabled: !!sessionn,
      onSuccess: (data) => {
        setItem("role", data?.role);

        setTimeout(() => {
          toast.dismiss();
          if (data?.onboarding === true) {
            navigate("/Dashboard-Medico");
          } else {
            navigate("/Dashboard-Medico?onBoarding");
          }
        }, 1000);
      },
      onError: (err: any) => {
        toast.dismiss();
        showSnackbar(err.message || "Erro ao processar login.", "error");
        setError(true);
      },
      keepPreviousData: true,
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (token !== undefined) {
      refetchDadosMe();
    } else {
      navigate("/");
    }
  }, [refetchDadosMe, token]);

  return (
    <Container
      container
      alignItems="center"
      justifyContent="center"
      sx={{ display: "flex", flexDirection: "row" }}
      className="nulo"
    >
      <Grid
        id="loginActionAnimacoes"
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          p: "20px",
        }}
        className="actionLoginAnimation"
      >
        <Grid
          container
          size={{ sm: 12 }}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <img
            src={Logo}
            className={"Logo"}
            alt="Logo Fatura Viva"
            style={{ width: "200px" }}
          />
          {error && (
            <Button onClick={() => navigate("/")} variant="text" sx={{ mt: 2 }}>
              Voltar para tela de login
            </Button>
          )}
        </Grid>
        {!error && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
