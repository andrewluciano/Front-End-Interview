import { FC, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "./Styles";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// import Api from "@/APIS/Logout";
import { useMutation } from "react-query";
import { token_ } from "@/APIS/BaseApis";

import Logo from "@/assets/imagens/Logo/logo-fatura-viva.svg?svg";

export const LogoutSession: FC = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const { mutate: AcaoDeslogarOriginal } = useMutation(async () => {
    setSnackbar({
      open: true,
      message: "Deslogando...",
      severity: "info",
    });

    localStorage.clear();

    setTimeout(() => {
      setSnackbar({
        open: true,
        message: "Deslogado com sucesso",
        severity: "success",
      });
      localStorage.clear();
    }, 500);

    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
      setSnackbar({
        open: true,
        message: "Até Mais!",
        severity: "success",
      });
      // navigate("/");
    }, 1500);
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
      navigate("/");
    }, 1950);
  });

  const AcaoDeslogar = useCallback(() => {
    if (token_ !== null) {
      AcaoDeslogarOriginal();
    } else {
      navigate("/");
    }
  }, [AcaoDeslogarOriginal, navigate]);

  useEffect(() => {
    if (token_ !== null) {
      AcaoDeslogar();
    } else {
      navigate("/");
    }
  }, [AcaoDeslogar, navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container container sx={{ height: "100vh" }} direction={"column"}>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid size={{ xs: 12, md: 6 }} direction={"column"} className="Bloco1">
        <center>
          <img
            src={Logo}
            className={"Logo"}
            alt="Logo Fatura Viva"
            style={{ width: "200px", margin: "20px 0" }}
          />
        </center>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} direction={"column"} className="Bloco2">
        <Box className="AreaForm">
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "300",
              textTransform: "uppercase",
              color: "#333",
            }}
          >
            Você foi deslogado do sistema
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#333",
            }}
          >
            Retornando para tela login
          </Typography>
        </Box>
      </Grid>
    </Container>
  );
};
