import { useModal } from "@/Autenticacao/ModalContext";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState, type ChangeEvent } from "react";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import SaveIcon from "@mui/icons-material/Save";
import { useQueryClient } from "react-query";

import Api from "@/APIS/Login";
import { useMutation } from "react-query";

export const AlterarSenha = (data) => {
  const { closeModal } = useModal();

  const [formValues, setFormValues] = useState({
    identifier: data?.DadosSelecionados?.id,
    cur_password: "",
    new_password: "",
    new_password1: "",
  });
  const [showCurPassword, setShowCurPassword] = useState(false);
  const [showNewPassword1, setShowNewPassword1] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
    autoHideDuration: number | null;
  }>({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 6000,
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
    autoHideDuration: number | null = 6000,
  ) => {
    setSnackbar({ open: true, message, severity, autoHideDuration });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const queryClient = useQueryClient();

  const handleSubmitAlterarSenha = () => {
    if (formValues.new_password1 !== formValues.new_password) {
      showSnackbar("Senhas não conferem", "error", 6000);
      return;
    }
    AcaoAlterarSenha();
  };

  const { mutate: AcaoAlterarSenha, isLoading: isLoadingAlterarSenha } =
    useMutation(
      async () => {
        const apiInstance = await Api.create();
        const response = await apiInstance.AlterarSenha(formValues);
        return response;
      },
      {
        onMutate: () => {
          showSnackbar("Alterando senha...", "info", null);
        },
        onSuccess: (response) => {
          if (!response?.is_error) {
            showSnackbar(
              response?.message || "Senha alterada com sucesso",
              "success",
              6000,
            );
          } else {
            showSnackbar(
              response?.message || "Falha ao alterar senha",
              "error",
              6000,
            );
          }

          setTimeout(() => {
            // closeModal();
            queryClient.invalidateQueries();
            queryClient.refetchQueries();
          }, 500);
        },
        onError: () => {
          showSnackbar("Falha ao alterar senha", "error", 6000);
        },
      },
    );

  return (
    <Box sx={{ width: "100%" }}>
      {isLoadingAlterarSenha && <LinearProgress />}
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }} sx={{ padding: "5px 10px" }}>
          <TextField
            fullWidth
            label="Senha atual"
            name="cur_password"
            value={formValues.cur_password}
            onChange={handleChange}
            variant="outlined"
            type={showCurPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showCurPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ padding: "5px 10px" }}>
          <TextField
            fullWidth
            label="Nova senha"
            name="new_password1"
            value={formValues.new_password1}
            onChange={handleChange}
            variant="outlined"
            type={showNewPassword1 ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword1((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showNewPassword1 ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ padding: "5px 10px" }}>
          <TextField
            fullWidth
            label="Confirme sua nova senha"
            name="new_password"
            value={formValues.new_password}
            onChange={handleChange}
            variant="outlined"
            type={showNewPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showNewPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ padding: "20px 10px 0px 10px", justifyContent: "flex-end" }}
      >
        <Button
          size="large"
          color="default"
          onClick={() => closeModal()}
          // startIcon={<CloseIcon />}
          disabled={isLoadingAlterarSenha}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmitAlterarSenha}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isLoadingAlterarSenha}
        >
          Confirmar Alteração
        </Button>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
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
    </Box>
  );
};
