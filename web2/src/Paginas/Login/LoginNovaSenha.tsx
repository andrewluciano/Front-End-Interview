import { FC, useEffect, useState, FormEvent, forwardRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useMutation } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Logo from "@/assets/imagens/Logo/logo-fatura-viva.svg?svg";
import { Container } from "./Styles";
import { HealthStatus } from "@/Componentes/Health";
import Api from "@/APIS/Login";

import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export const LoginNovaSenha = () => {
  const [exibicao, setExibicao] = useState("andrew");
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"termos" | "politica" | null>(
    null,
  );

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

  const navigate = useNavigate();

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const { mutate: ActionSenha, isLoading: isLoadingLogar } = useMutation(
    async (dados: { code: string; Senha: string }) => {
      const apiInstance = await Api.create();

      const response = await apiInstance.NovaSenha(dados);

      return response;
    },
    {
      onSuccess: (response) => {
        if (!response?.is_error) {
          showSnackbar(
            response?.message || "Senha atualizada com sucesso",
            "success",
          );
          navigate("/");
          return;
        }

        showSnackbar(response?.message || "Falha ao atualizar senha", "error");
      },
      onError: () => {},
    },
  );

  const handleSubmitNovaSenha = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasLowercase = /[a-z]/.test(senha);
    const hasUppercase = /[A-Z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);

    if (!hasLowercase || !hasUppercase || !hasNumber) {
      showSnackbar(
        "A senha deve conter letras maiúsculas, minúsculas e números",
        "error",
      );
      return;
    }

    if (senha !== senha2) {
      showSnackbar("Senhas não conferem", "error");
      return;
    }

    if (!code) {
      showSnackbar("Código inválido ou ausente", "error");
      return;
    }

    ActionSenha({
      code,
      Senha: senha,
    });
  };

  useEffect(() => {
    const rawQuery = searchParams.toString();
    const tokenFromKey = searchParams.get("token");
    const tokenFromKeylessQuery =
      rawQuery && !rawQuery.includes("=") ? rawQuery : null;
    const resolvedCode = tokenFromKey || tokenFromKeylessQuery;

    setCode(resolvedCode);
    if (resolvedCode) {
      setExibicao("two");
    }
  }, [searchParams]);

  return (
    <Container
      container
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Grid container className="AreaLogin">
        {/* <Grid size={{ sm: 6 }} direction={"column"} className="Bloco1"></Grid> */}
        <Grid size={{ sm: 12 }} direction={"column"} className="Bloco2">
          <Box className="AreaForm">
            <center>
              <img
                src={Logo}
                className={"Logo"}
                alt="Logo Fatura Viva"
                style={{ width: "200px", margin: "20px 0" }}
              />
            </center>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#333",
              }}
            >
              Cadastrar Nova Senha
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#333",
              }}
            >
              Cadastre uma nova senha, para seu acesso.
            </Typography>

            <form onSubmit={handleSubmitNovaSenha}>
              <Grid container size={{ sm: 12, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 0, width: "100ch", padding: "5px 0" }}
                  variant="standard"
                  required
                >
                  <TextField
                    required
                    id="outlined-required"
                    name="Senha"
                    label="Digite sua Nova Senha"
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ m: 0, width: "100ch", padding: "5px 0" }}
                  variant="standard"
                  required
                >
                  <TextField
                    required
                    id="outlined-required"
                    name="Senha2"
                    label="Repita sua Nova Senha"
                    type={showPassword ? "text" : "password"}
                    value={senha2}
                    onChange={(e) => setSenha2(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ m: 0, width: "100ch", padding: "5px 0" }}
                  variant="standard"
                  required
                >
                  <Button type="submit" variant="contained" size="large">
                    Cadastrar
                  </Button>
                </FormControl>
              </Grid>
            </form>
            <Grid sx={{ textAlign: "center" }}>
              <Typography variant="caption">
                <a
                  onClick={() =>
                    exibicao({ one: false, two: true, three: false })
                  }
                >
                  Não tem acesso
                </a>
                &nbsp;|&nbsp;
              </Typography>

              <Typography variant="caption">
                <a
                  onClick={() =>
                    exibicao({ one: false, two: false, three: true })
                  }
                >
                  Esqueceu sua senha?
                </a>
              </Typography>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: "#fff" }}>
          <a
            onClick={() => setModalType("termos")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Termos de uso
          </a>
          &nbsp;-&nbsp;
          <a
            onClick={() => setModalType("politica")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Politica de Privacidade
          </a>
        </Typography>
      </Grid>
      <Dialog
        open={!!modalType}
        onClose={() => setModalType(null)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="scroll-dialog-title">
          {modalType === "termos" ? "Termos de Uso" : "Política de Privacidade"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {modalType === "termos" ? (
              <>
                <Typography paragraph>
                  <strong>1. Aceitação dos Termos</strong>
                  <br />
                  Ao acessar e utilizar a plataforma Fatura Viva, você concorda
                  em cumprir e estar vinculado aos seguintes termos e condições
                  de uso. Se você não concordar com qualquer parte destes
                  termos, você não deve utilizar nossos serviços.
                </Typography>
                <Typography paragraph>
                  <strong>2. Descrição do Serviço</strong>
                  <br />A Fatura Viva fornece serviços de gestão financeira e
                  conciliação bancária. Reservamo-nos o direito de modificar ou
                  descontinuar o serviço a qualquer momento, com ou sem aviso
                  prévio.
                </Typography>
                <Typography paragraph>
                  <strong>3. Cadastro e Segurança</strong>
                  <br />
                  Para acessar certos recursos, você deve se cadastrar e
                  fornecer informações precisas e completas. Você é responsável
                  por manter a confidencialidade de sua conta e senha.
                </Typography>
                <Typography paragraph>
                  <strong>4. Uso Aceitável</strong>
                  <br />
                  Você concorda em não usar o serviço para fins ilegais ou não
                  autorizados. O uso da plataforma para transmitir qualquer
                  conteúdo que seja ilegal, ofensivo ou que viole direitos de
                  terceiros é estritamente proibido.
                </Typography>
                <Typography paragraph>
                  <strong>5. Limitação de Responsabilidade</strong>
                  <br />A Fatura Viva não será responsável por quaisquer danos
                  diretos, indiretos, incidentais ou consequenciais resultantes
                  do uso ou da incapacidade de usar o serviço.
                </Typography>
              </>
            ) : (
              <>
                <Typography paragraph>
                  <strong>1. Coleta de Informações</strong>
                  <br />
                  Coletamos informações pessoais que você nos fornece
                  voluntariamente ao se cadastrar, como nome, e-mail e telefone.
                  Também podemos coletar dados de uso e navegação para melhorar
                  nossos serviços.
                </Typography>
                <Typography paragraph>
                  <strong>2. Uso das Informações</strong>
                  <br />
                  Utilizamos suas informações para fornecer, manter e melhorar
                  nossos serviços, além de comunicar novidades e atualizações.
                  Não vendemos nem alugamos suas informações pessoais para
                  terceiros.
                </Typography>
                <Typography paragraph>
                  <strong>3. Segurança dos Dados</strong>
                  <br />
                  Implementamos medidas de segurança para proteger suas
                  informações contra acesso não autorizado, alteração,
                  divulgação ou destruição.
                </Typography>
                <Typography paragraph>
                  <strong>4. Cookies</strong>
                  <br />
                  Utilizamos cookies para melhorar a experiência do usuário.
                  Você pode configurar seu navegador para recusar cookies, mas
                  isso pode limitar algumas funcionalidades da plataforma.
                </Typography>
                <Typography paragraph>
                  <strong>5. Alterações na Política</strong>
                  <br />
                  Podemos atualizar esta Política de Privacidade periodicamente.
                  Recomendamos que você revise esta página regularmente para
                  estar ciente de quaisquer alterações.
                </Typography>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalType(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <HealthStatus />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingLogar}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
