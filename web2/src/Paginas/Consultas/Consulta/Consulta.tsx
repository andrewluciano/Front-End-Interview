import {
  Badge,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  TextField,
  type SelectChangeEvent,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  type FC,
  type FormEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/material/styles";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { PhoneMaskCustom } from "@/Componentes/MaskInput";
import { NumericFormat } from "react-number-format";
import { RetornoIdade } from "@/helpers/format/Dates";

import Api from "../API/Consultas";

import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { cleanCurrency } from "@/Componentes/CleanCurrency";

// Icones
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
// import dayjs from "dayjs";

import { ExcluirConsulta } from "@/Paginas/Consultas/ExcluirConsulta";

import { useSearchParams } from "react-router-dom";

import LinearProgress from "@mui/material/LinearProgress";
import { useModal } from "@/Autenticacao/ModalContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CurrencyInput = forwardRef(function CurrencyInput(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props?.name,
            value: values.value, // This gives you the unmasked numeric value
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale={true}
    />
  );
});

interface ProcedimentoProps {
  Close: () => void;
}

export interface IDadosSelecionados {
  nome_paciente: string;
  nome_procedimento: string;
  cpf_rg: string;
  r_nascido: boolean;
  numero_carteira: string;
  data_nascimento: Date;
  idade: number;
  contato: string;
  convenio: string;
  unidade: string;
  local: string;
  tipo_encontro: string;
  estagio: string;
  status: string;
  data_consulta: Date;
  medico: string;
  medico_encaminhador: string;
  encaminhamento: boolean;
  retorno: boolean;
  valor_receber: number;
  valor_recebido: number;
  identifier?: string;
}
export const Consulta: FC<ProcedimentoProps> = () => {
  const [Tipo, setTipo] = useState("");
  const [DataNascimento, setDataNascimento] = useState("");
  const [RecemNascido, setRecemNascido] = useState(false);
  const [Encaminhamento, setEncaminhamento] = useState(false);
  const [Retorno, setRetorno] = useState(false);
  function handleChangeTipo(event: SelectChangeEvent): void {
    setTipo(event.target.value as string);
    handleChangeInputs({
      target: {
        name: "tipo_encontro",
        value: event.target.value as string,
      },
    });
  }

  function handleChangeDataNascimento(event: SelectChangeEvent): void {
    event.preventDefault();
    const teste = new Date(event.target.value);

    setTimeout(() => {
      setDataNascimento(RetornoIdade(teste));
    }, 100);
  }

  const [searchParams] = useSearchParams();
  const identifier = searchParams.get("Atendimento");
  const { closeModal } = useModal();
  const { openModal } = useModal();

  const queryClient = useQueryClient();

  const [DadosCarregados, setDadosCarregados] = useState({
    nome_paciente: "",
    nome_procedimento: "",
    cpf_rg: "",
    r_nascido: "",
    numero_carteira: "",
    data_nascimento: "",
    idade: "",
    contato: "",
    convenio: "",
    unidade: "",
    local: "",
    tipo_encontro: "",
    estagio: "",
    status: "",
    data_consulta: "",
    medico: "",
    medico_encaminhador: "",
    encaminhamento: false,
    retorno: false,
    valor_receber: "",
    valor_recebido: "",
  });

  const {
    isLoading: isProcedimentoLoading, // Use o estado de carregamento nativo
    refetch: ConsultaCarregada,
  } = useQuery(
    ["ConsultaCarregada", identifier],
    async () => {
      if (!identifier) return null; // Evita a chamada se não houver identifier
      const apiInstance = await Api.create();
      const response = await apiInstance.GetConsultas(identifier);

      if (!response?.is_error) {
        return response.content[0] as IDadosSelecionados; // Retorna o objeto diretamente
      }
      return null;
    },
    {
      enabled: !!identifier,
      onSuccess: (data) => {
        console.log('data',data)
        if (data) {
          setDadosCarregados(data);
        }
      },
      keepPreviousData: false,
    },
  );

  const carregouRef = useRef(false);

  useEffect(() => {
    if (!identifier || carregouRef.current) return;
    carregouRef.current = true;
    ConsultaCarregada();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  const ToastLoading = "";

  const { mutate: AcaoAdicionarProcedimento } = useMutation(async (dados) => {
    toast.loading("Salvando Dados de Procedimento");
    const apiInstance = await Api.create();

    const response = await apiInstance.PutConsultas(
      DadosCarregados?.identifier,
      dados,
    );

    if (!response?.is_error) {
      toast.success("Procedimento Salvo com Sucesso");

      setTimeout(() => {
        toast.dismiss();
        closeModal();
        queryClient.invalidateQueries();
        queryClient.refetchQueries();
      }, 500);
    } else {
      setTimeout(() => {
        closeModal();
        toast.dismiss(ToastLoading);
      }, 500);
      toast.dismiss(ToastLoading);
      // toast.error(response?.message);
      queryClient.invalidateQueries();
      toast.dismiss(ToastLoading);
    }

    return response;
  });

  const PaymentSkeleton = () => (
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
  );

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    const formData = new FormData(form.target);
    const formValues = Object.fromEntries(formData.entries());

    formValues.r_nascido = formValues.r_nascido ? true : false;
    formValues.encaminhamento = formValues.encaminhamento ? true : false;
    formValues.retorno = formValues.retorno ? true : false;
    formValues.valor_receber = cleanCurrency(formValues.valor_receber);
    formValues.valor_recebido = cleanCurrency(formValues.valor_recebido);

    AcaoAdicionarProcedimento(formValues);
  };

  const handleChangeInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setDadosCarregados({
      ...DadosCarregados,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  function fecharModal(): void {
    closeModal();
  }

  function ChangeDateForInput(
    DataProcedimento: Date | string,
  ): string | undefined {
    if (!DataProcedimento) {
      return "";
    }

    // Se for uma string (como uma string ISO), pegue apenas a parte YYYY-MM-DD
    if (typeof DataProcedimento === "string") {
      return DataProcedimento.substring(0, 10);
    }

    // Se for um objeto Date, converta para string YYYY-MM-DD
    // Esta conversão deve ser cuidadosa com fusos horários.
    try {
      const dateObj = new Date(DataProcedimento);
      if (isNaN(dateObj.getTime())) return ""; // Verifica se é uma data válida

      // Formata para YYYY-MM-DD, ajustando para não deslocar o dia devido ao fuso
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "";
    }
  }

  // Excluir Procedimento
  const handleOpenDelete = (item) => {
    openModal(
      <ExcluirConsulta DadosSelecionados={item} />,
      "Exlusão de Procedimento",
      "Confirme a exclusão do procedimento",
    );
  };

  return (
    <>
      {isProcedimentoLoading && <PaymentSkeleton />}
      {!isProcedimentoLoading && DadosCarregados && (
        <form onSubmit={(form) => Formulario(form)} style={{ width: "100%" }}>
          <Grid>
            <Grid
              container
              sx={{
                pb: 2,
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "calc(100vh - 260px)",
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  justifyContent: "center",
                  display: "none",
                }}
                variant="standard"
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Carregar Arquivos
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                  />
                </Button>
              </FormControl>

              <Grid container size={{ sm: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <InputLabel
                    id="TipoLabel"
                    sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                  >
                    Tipo de Procedimento
                  </InputLabel>
                  <Select
                    labelId="TipoLabel"
                    id="demo-simple-select"
                    label="Tipo de Consulta"
                    onChange={handleChangeTipo}
                    variant="outlined"
                    name="tipo_encontro"
                    value={DadosCarregados?.tipo_encontro || "semcadastro"}
                  >
                    <MenuItem value="semcadastro">Sem Cadastro</MenuItem>
                    <MenuItem value="consulta">Consulta</MenuItem>
                    <MenuItem value="procedimento">Procedimento</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 7 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="nome_paciente"
                    label="Nome do Paciente"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.nome_paciente}
                  />
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 3 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="cpf_rg"
                    label="Documento"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.cpf_rg}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 2 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="contato"
                    label="Contato"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.contato}
                    InputProps={{
                      inputComponent: PhoneMaskCustom,
                    }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 3 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="data_nascimento"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.data_nascimento}
                    label="Data de Nascimento"
                    variant="outlined"
                    onBlur={handleChangeDataNascimento}
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 3 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    disabled
                    fullWidth
                    name="idade"
                    label="Idade"
                    variant="outlined"
                    value={DataNascimento || DadosCarregados?.idade}
                  />
                </FormControl>
              </Grid>

              <Divider sx={{ width: "97%", m: 2 }} />

              <Grid container size={{ sm: 6 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "48.9ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="convenio"
                    label="Convênio"
                    type="Pesquisar"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.convenio}
                  />
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 6 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "48.9ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="numero_carteira"
                    label="Carteirinha"
                    type="Pesquisar"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.numero_carteira}
                  />
                </FormControl>
              </Grid>

              <Divider sx={{ width: "97%", m: 2 }} />

              <Grid container size={{ sm: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="nome_procedimento"
                    label="Nome do Procedimento"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.nome_procedimento}
                  />
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 6 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="local"
                    label="Local do Procedimento"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.local}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 6 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="unidade"
                    label="Unidade do Procedimento"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.unidade}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 4 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="data_consulta"
                    label="Data e Hora da Consulta"
                    variant="outlined"
                    type="datetime-local"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.data_consulta}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 4 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="valor_receber"
                    label="Valor do Procedimento"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.valor_receber}
                    InputProps={{
                      inputComponent: CurrencyInput,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 4 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="valor_recebido"
                    label="Valor Recebido"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.valor_recebido}
                    InputProps={{
                      inputComponent: CurrencyInput,
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 6 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="medico"
                    label="Nome do Médico"
                    type="Pesquisar"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.medico}
                  />
                </FormControl>
              </Grid>

              {/* <Grid container size={{ sm: 3.95 }}>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel
              id="EstagioLabel"
              sx={{ padding: "0", margin: "-4px 0 0 15px" }}
            >
              Estágios
            </InputLabel>
            <Select
              labelId="EstagioLabel"
              id="estagio-select"
              label="Estágios"
              onChange={handleChangeInputs}
              variant="outlined"
              name="estagio"
              value={DadosCarregados?.estagio || ""}
            >
              <MenuItem value="Aguardando Faturamento">
                Aguardando Faturamento
              </MenuItem>
              <MenuItem value="Glosado">Glosado</MenuItem>
              <MenuItem value="Pago">Pago</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}

              <Grid container size={{ sm: 6 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <InputLabel
                    id="StatusLabel"
                    sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                  >
                    Status
                  </InputLabel>
                  <Select
                    labelId="StatusLabel"
                    id="status-select"
                    label="Status"
                    onChange={handleChangeInputs}
                    variant="outlined"
                    name="status"
                    value={DadosCarregados?.status || ""}
                  >
                    <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                    <MenuItem value="Pendente">Pendente</MenuItem>
                    <MenuItem value="Finalizado">Finalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={0} sx={{ padding: "10px" }}>
              <BotaoPadrao
                size="large"
                titulo="Salvar"
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
              />
              <Button
                size="large"
                variant="default"
                startIcon={<CloseIcon />}
                onClick={fecharModal}
              >
                Cancelar
              </Button>
              <Button
                size="large"
                color="error"
                startIcon={<DeleteForeverRoundedIcon />}
                onClick={() => handleOpenDelete(DadosCarregados)}
              ></Button>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};
