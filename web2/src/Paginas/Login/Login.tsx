import { FC, useEffect, useState, FormEvent, forwardRef } from "react";
import { IMaskInput } from "react-imask";
import type { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "./Styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { setItem, getItem } from "@/helpers/armazenamento";
import { useMutation } from "react-query";
import Api from "@/APIS/Login";

import Logo from "@/assets/imagens/Logo/logo-fatura-viva.svg?svg";
import { HealthStatus } from "@/Componentes/Health";

import {
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

import MailIcon from "@mui/icons-material/Mail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(00) 00000-0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref as any}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  },
);

export const Login: FC = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const token = getItem("auth-token");
    if (token) {
      navigate("/dashboard-Medico");
    }
  }, [navigate]);

  // const [sessionn] = useState(null);
  const [Cadastro, setCadastro] = useState(false);
  const [Login, setLogin] = useState(true);
  const [DadosLogados, setDadosLogados] = useState(null);
  const [EsqueciMinhaSenha, setEsqueciMinhaSenha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const exibicao = ({
    one,
    two,
    three,
  }: {
    one: boolean;
    two: boolean;
    three: boolean;
  }) => {
    setLogin(one);
    setCadastro(two);
    setEsqueciMinhaSenha(three);
  };

  // exibicao({ one: false, two: true, three: false })

  useEffect(() => {
    if (searchParams.has("NovoUsuario")) {
      exibicao({ one: false, two: true, three: false });
    }
  }, [searchParams]);

  const { mutate: AcaoLogar, isLoading: isLoadingLogar } = useMutation(
    async (dados: object) => {
      const apiInstance = await Api.create();

      const response = await apiInstance.Logar(dados);

      return response;
    },
    {
      onSuccess: (response) => {
        // showSnackbar(response?.message, "info");
        if (!response?.is_error) {
          showSnackbar(response?.message, "success");
          if (response?.content.length > 0) {
            setDadosLogados(response?.content[0].access_token);
            setItem("auth-token", response?.content[0].access_token || "");

            if (response?.content[0].access_token !== null)
              setTimeout(() => {
                setDadosLogados(response?.content[0].access_token);
                // refetchDadosMe(response);

                navigate("/ActionLogin", {
                  state: response?.content[0].access_token,
                });
              }, 1);
          } else {
            showSnackbar(response?.message, "error");
          }
        } else {
          showSnackbar(response?.message, "error");
        }
      },
      onError: () => {},
    },
  );

  // const { refetch: refetchDadosMe } = useQuery(
  //   ["dadosMe"],
  //   async () => {
  //     const apiInstance = await ApiDados.create();
  //     const response = await apiInstance.DadosMe(DadosLogados);

  //     // const response = await ApiDados.DadosMe(DadosLogados);
  //     if (!response?.is_error) {
  //       setItem("dados_users", JSON.stringify(response));
  //       toast.dismiss(ToastLoading);
  //       return response;
  //     }
  //     return null;
  //   },
  //   {
  //     enabled: !!sessionn,
  //     onSuccess: (data) => {

  //       setItem("role", data?.role);

  //       setTimeout(() => {
  //         if (data?.role === "medico") {
  //           navigate("/Dashboard-Medico");
  //         } else {
  //           navigate("/Dashboard");
  //         }
  //       }, 500);
  //     },
  //     keepPreviousData: true,
  //     staleTime: Infinity,
  //   },
  // );

  const { mutate: AcaoCadastrar, isLoading: isLoadingCadastrar } = useMutation(
    async (dados: object) => {
      const apiInstance = await Api.create();

      const response = await apiInstance.CadastrarLogin(dados);

      return response;
    },
    {
      onSuccess: (response) => {
        console.log("response?.data", response?.data);
        console.log("response", response);

        if (!response?.is_error) {
          showSnackbar(response?.message, "success");
          exibicao({ one: true, two: false, three: false });
          // setEsqueciMinhaSenha(false);
          // setLogin(true);
          // setCadastro(false);
        } else {
          showSnackbar("Falha no cadastro. Tente novamente.", "error");
        }
      },
      onError: (error: unknown) => {
        console.log("error", error);
        const err = error as AxiosError<{ detail?: string; message?: string }>;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail;
        const message = err?.message || err?.response?.data?.message;

        if (status === 400 && detail) {
          showSnackbar(detail, "error");
          return;
        }

        if (detail) {
          showSnackbar(detail, "error");
          return;
        }

        showSnackbar(
          message || "Falha ao Cadastrar. Tente novamente.",
          "error",
        );
      },
    },
  );

  const {
    mutate: AcaoEsqueciMinhaSenha,
    isLoading: isLoadingEsqueciMinhaSenha,
  } = useMutation(
    async (dados: object) => {
      const apiInstance = await Api.create();

      const response = await apiInstance.EsqueciMinhaSenha(dados);
      return response;
    },
    {
      onSuccess: (response) => {
        if (!response?.is_error) {
          showSnackbar("Login resetado com sucesso", "success");
          setEsqueciMinhaSenha(false);
          setLogin(true);
          setCadastro(false);
        } else {
          showSnackbar("Falha ao Resetar. Tente novamente.", "error");
        }
      },
      onError: () => {
        showSnackbar("Falha ao Resetar. Tente novamente.", "error");
      },
    },
  );

  const ActionLogin = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    AcaoLogar(formValues);
  };
  const ActionEsqueciMinhaSenha = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    AcaoEsqueciMinhaSenha(formValues);
  };

  const ActionCadastro = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    AcaoCadastrar(formValues);
  };

  // toast.dismiss();

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
              LOGIN
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#333",
              }}
            >
              Use seu E-mail e Senha para acessar.
            </Typography>

            {Login && (
              <>
                <form onSubmit={ActionLogin}>
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
                        label="Digite seu Email"
                        name="Email"
                        startAdornment={
                          <InputAdornment position="start">
                            <MailIcon />
                          </InputAdornment>
                        }
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
                        name="Senha"
                        label="Digite sua Senha"
                        type={showPassword ? "text" : "password"}
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
                        Login
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
              </>
            )}
            {Cadastro && (
              <>
                <form onSubmit={ActionCadastro}>
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
                        label="Digite seu nome Completo"
                        name="Nome"
                        startAdornment={
                          <InputAdornment position="start">
                            <MailIcon />
                          </InputAdornment>
                        }
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
                        label="Digite seu Email"
                        name="Email"
                        startAdornment={
                          <InputAdornment position="start">
                            <MailIcon />
                          </InputAdornment>
                        }
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
                        label="Digite seu Telefone"
                        name="Telefone"
                        InputProps={{
                          inputComponent: TextMaskCustom as any,
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
                        name="Senha"
                        label="Digite sua Senha"
                        type={showPassword ? "text" : "password"}
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
                      sx={{ m: 0.5, width: "100ch", padding: "5px 0" }}
                      variant="standard"
                      required
                    >
                      {/* <FormLabel id="LabelRoles">Gender</FormLabel> */}
                      <RadioGroup
                        row
                        aria-labelledby="LabelRoles"
                        name="role"
                        defaultValue={"medico"}
                      >
                        <FormControlLabel
                          value="medico"
                          control={<Radio size="small" />}
                          label="Médico"
                        />
                        <Tooltip title="Em Breve ">
                          <FormControlLabel
                            value="admin"
                            disabled
                            control={<Radio size="small" />}
                            label="Administrador"
                          />
                        </Tooltip>
                      </RadioGroup>
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
                        exibicao({ one: true, two: false, three: false })
                      }
                    >
                      Ja Tenho acesso
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
              </>
            )}
            {EsqueciMinhaSenha && (
              <>
                <form onSubmit={ActionEsqueciMinhaSenha}>
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
                        label="Digite seu Email"
                        name="email"
                        startAdornment={
                          <InputAdornment position="start">
                            <MailIcon />
                          </InputAdornment>
                        }
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      sx={{ m: 0, width: "100ch", padding: "5px 0" }}
                      variant="standard"
                      required
                    >
                      <Button type="submit" variant="contained" size="large">
                        Resetar Senha
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
                        exibicao({ one: true, two: false, three: false })
                      }
                    >
                      Ja Tenho acesso
                    </a>
                  </Typography>
                </Grid>
              </>
            )}
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
        open={
          isLoadingLogar || isLoadingCadastrar || isLoadingEsqueciMinhaSenha
        }
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
