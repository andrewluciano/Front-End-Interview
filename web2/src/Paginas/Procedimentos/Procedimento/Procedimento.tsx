import {
  Badge,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  type SelectChangeEvent,
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
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { date2 } from "@/helpers/format";

import { TabPanelCustom } from "./Styles";
import Api from "../API/Procedimentos";
import { NumericFormat } from "react-number-format";

import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";

// Icones
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
// import dayjs from "dayjs";
import TabContext from "@mui/lab/TabContext";
import { useSearchParams } from "react-router-dom";

import LinearProgress from "@mui/material/LinearProgress";
import { useModal } from "@/Autenticacao/ModalContext";
import { BlocoDocumentos, BlocoPendencias } from "./Componentes";

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
  ValorEstimado: number;
  deleted_at: Date;
  Paciente: string;
  created_at: Date;
  ValorRecebido: number;
  assistant_message: string;
  ValorGlosado: number;
  StatusProcedimento: string;
  Procedimento: string;
  Progresso: string;
  Medico: string;
  DataProcedimento: Date;
  Plano: string;
  identifier: string;
  Estagio: string;
  Convenio: string;
  updated_at: Date;
  Descricao: string;
  CodProcedimento: string;
  PrazoProcedimentoEstagioLimite: Date;
  Documentos: [];
  Pendencias: [];
}
export const Procedimento: FC<ProcedimentoProps> = () => {
  // const [isFetching, setisFetching] = useState(true);

  const [searchParams] = useSearchParams();
  const identifier = searchParams.get("Procedimento");
  const { closeModal } = useModal();

  const [DocumentosUpload, setDocumentosUpload] = useState([]);
  const [DocumentosLista, setDocumentosLista] = useState([]);
  console.log("DocumentosLista", DocumentosLista);
  const queryClient = useQueryClient();
  // const [ProcedimentosIdentifier, setProcedimentosIdentifier] = useState(
  //   props?.DadosSelecionados ?? "",
  // );
  const [DadosCarregados, setDadosCarregados] = useState({
    ValorEstimado: "",
    deleted_at: "",
    Paciente: "",
    created_at: "",
    ValorRecebido: "",
    assistant_message: "",
    ValorGlosado: "",
    StatusProcedimento: "",
    Procedimento: "",
    Progresso: "",
    Medico: "",
    DataProcedimento: "",
    Plano: "",
    identifier: "",
    Estagio: "",
    Convenio: "",
    updated_at: "",
    Descricao: "",
    CodProcedimento: "",
    PrazoProcedimentoEstagioLimite: "",
    Documentos: [],
    Pendencias: [],
  });
  const [Estagio, setEstagio] = useState("");
  const [Status, setStatus] = useState("");

  const {
    isLoading: isProcedimentoLoading, // Use o estado de carregamento nativo
    refetch: ProcedimentoCarregado,
  } = useQuery(
    ["ProcedimentoCarregado", identifier],
    async () => {
      if (!identifier) return null; // Evita a chamada se não houver identifier
      const apiInstance = await Api.create();
      const response = await apiInstance.GetProcedimentos(identifier);
      if (!response?.is_error) {
        return response.content[0] as IDadosSelecionados; // Retorna o objeto diretamente
      }
      return null;
    },
    {
      enabled: !!identifier,
      onSuccess: (data) => {
        if (data) {
          setDadosCarregados(data);
        }
      },
      keepPreviousData: false,
    },
  );

  const { refetch: ProcedimentoArquivos } = useQuery(
    ["ProcedimentoArquivos"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetProcedimentosArquivos(identifier);

      if (!response?.is_error) {
        return response;
      }
      return null;
    },
    {
      onSuccess: (data) => {
        setDocumentosLista(data?.content);
        // setisFetching(false);
      },
      keepPreviousData: true,
    },
  );

  const carregouRef = useRef(false);

  useEffect(() => {
    if (!identifier || carregouRef.current) return;
    carregouRef.current = true;
    ProcedimentoCarregado();
    ProcedimentoArquivos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  const ToastLoading = "";

  const { mutate: AcaoAdicionarProcedimento } = useMutation(async (dados) => {
    toast.loading("Salvando Dados de Procedimento");
    const apiInstance = await Api.create();

    const response = await apiInstance.PutProcedimentos(
      DadosCarregados?.identifier,
      dados,
    );

    if (!response?.is_error) {
      toast.success("Procedimento Salvo com Sucesso");

      setTimeout(() => {
        toast.dismiss();
        setDocumentosUpload([]);
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

  const { mutate: AcaoAdicionarProcedimentoUpload } = useMutation(async () => {
    toast.loading("Upload Documentos Procedimento");
    const apiInstance = await Api.create();

    const response = await apiInstance.AdicionarDocumentos(
      identifier,
      DocumentosUpload[0],
    );

    if (!response?.is_error) {
      toast.success("Upload Documentos Sucesso");

      setTimeout(() => {
        toast.dismiss();
        closeModal();
        // Atualiza especificamente a lista de uploads deste procedimento
        queryClient.invalidateQueries({
          queryKey: ["ListaUploadsByProcedure", identifier],
        });
        // Pode haver listas globais abertas que também precisam atualizar
        queryClient.invalidateQueries({ queryKey: ["ListaUploadsAll"] });
      }, 500);
    } else {
      setTimeout(() => {
        closeModal();
        toast.dismiss(ToastLoading);
      }, 500);
      toast.dismiss(ToastLoading);
      // toast.error(response?.message);
      queryClient.invalidateQueries({
        queryKey: ["ListaUploadsByProcedure", identifier],
      });
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
    formValues.Pendencias = [];
    formValues.Documentos = [];
    formValues.deleted_at = null;
    formValues.assistant_message = null;

    formValues.ValorEstimado = Number(
      formValues.ValorEstimado.replace(/[R$ .]/g, "").replace(",", "."),
    );
    formValues.ValorGlosado = Number(
      formValues.ValorGlosado.replace(/[R$ .]/g, "").replace(",", "."),
    );
    formValues.ValorRecebido = Number(
      formValues.ValorRecebido.replace(/[R$ .]/g, "").replace(",", "."),
    );

    AcaoAdicionarProcedimentoUpload();
    AcaoAdicionarProcedimento(formValues);
  };
  function handleChangeEstagios(event: SelectChangeEvent): void {
    setEstagio(event.target.value as string);
  }

  function handleChangeStatus(event: SelectChangeEvent): void {
    setStatus(event.target.value as string);
  }

  // INICIO Conteudo Valores de TABS
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // FIM Conteudo Valores de TABS

  const handleChangeInputs = (e) => {
    const { name, value } = e.target;
    setDadosCarregados({
      ...DadosCarregados,
      [name]: value,
    });
  };

  const dataAtual = new Date();

  const DataAtual30 = () => {
    const dataAtual2 = new Date();
    dataAtual2.setDate(dataAtual2.getDate() + 30);

    return dataAtual2.toISOString();
  };

  const EnvioDocumentosoUpload = (dados: File) => {
    setDocumentosUpload(dados);
  };

  function fecharModal(): void {
    closeModal();
  }

  // function ChangeDate(DataProcedimento: Date | string): string | undefined {

  //   if (!DataProcedimento) {
  //   // Se a data for nula, indefinida ou string vazia, retorna uma string vazia ou undefined.
  //   // Retornar '' garantirá que o campo de input seja renderizado sem erro.
  //   return '';
  // }

  //   const dateAlterada = date2(DataProcedimento)
  //   console.log('dateAlterada',dateAlterada)
  //   return  dateAlterada
  // }

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

  return (
    <>
      {isProcedimentoLoading && <PaymentSkeleton />}
      {!isProcedimentoLoading && DadosCarregados && (
        <form onSubmit={(form) => Formulario(form)} style={{ width: "100%" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Adicionar Novo Paciente"
                variant="scrollable"
              >
                <Tab label="Dados Procedimento" />
                <Tab label="Documentos" />
                <Tab
                  label={
                    <Badge
                      color="secondary"
                      badgeContent={0}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          color: "#fff !important",
                        },
                      }}
                    >
                      Pendências
                    </Badge>
                  }
                />
              </Tabs>
            </Box>
            <TabPanelCustom visivel={value === 0}>
              <Grid container>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <input
                    type="hidden"
                    name="identifier"
                    value={DadosCarregados?.identifier}
                  />
                  <input type="hidden" name="Pendencias" value="" />
                  <input
                    type="hidden"
                    name="deleted_at"
                    value={DadosCarregados?.deleted_at || null}
                  />
                  <input
                    type="hidden"
                    name="created_at"
                    value={
                      DadosCarregados?.created_at || new Date().toISOString()
                    }
                  />
                  <input type="hidden" name="assistant_message" value="null" />
                  <input
                    type="hidden"
                    name="updated_at"
                    value={dataAtual.toISOString()}
                  />
                  <input
                    type="hidden"
                    name="PrazoProcedimentoEstagioLimite"
                    value={DataAtual30()}
                  />

                  <TextField
                    fullWidth
                    name="Paciente"
                    label="Nome do Paciente"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.Paciente}
                  />
                </FormControl>
                <Grid container size={{ sm: 12 }}>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "48.9ch" }}
                    variant="standard"
                  >
                    <TextField
                      fullWidth
                      name="Convenio"
                      label="Convênio"
                      type="Pesquisar"
                      onChange={handleChangeInputs}
                      value={DadosCarregados?.Convenio}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "48.9ch" }}
                    variant="standard"
                  >
                    <TextField
                      fullWidth
                      name="Plano"
                      label="Plano"
                      type="Pesquisar"
                      onChange={handleChangeInputs}
                      value={DadosCarregados?.Plano}
                    />
                  </FormControl>
                </Grid>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="Medico"
                    label="Nome do Médico"
                    type="Pesquisar"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.Medico}
                  />
                </FormControl>
                <Grid container size={{ sm: 12 }}>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "23.7ch" }}
                    variant="standard"
                  >
                    <TextField
                      fullWidth
                      name="CodProcedimento"
                      label="Código Procedimento"
                      type="number"
                      onChange={handleChangeInputs}
                      value={DadosCarregados?.CodProcedimento}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "74ch" }}
                    variant="standard"
                  >
                    <TextField
                      fullWidth
                      name="Procedimento"
                      label="Nome Procedimento"
                      type="Pesquisar"
                      onChange={handleChangeInputs}
                      value={DadosCarregados?.Procedimento}
                    />
                  </FormControl>
                </Grid>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "99.5ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="Descricao"
                    label="Descrição"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    multiline
                    rows={4}
                    value={DadosCarregados?.Descricao}
                  />
                </FormControl>
                <Grid container size={{ sm: 12 }}>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "48.9ch" }}
                    variant="standard"
                  >
                    <InputLabel
                      id="EstagioLabel"
                      sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                    >
                      Estágios
                    </InputLabel>
                    <Select
                      labelId="EstagioLabel"
                      id="demo-simple-select"
                      value={Estagio || DadosCarregados?.Estagio}
                      label="Estágios"
                      onChange={handleChangeEstagios}
                      // value={DadosCarregados?.Estagio}
                      variant="outlined"
                      name="Estagio"
                    >
                      {/* <MenuItem value="Aguardando Autorização Convênio">
                        Aguardando Autorização Convênio
                      </MenuItem>
                      <MenuItem value="Aguardando Agendamento">
                        Aguardando Agendamento
                      </MenuItem> */}
                      <MenuItem value="Aguardando Execução">
                        Aguardando Execução
                      </MenuItem>
                      <MenuItem value="Aguardando Faturamento">
                        Aguardando Faturamento
                      </MenuItem>
                      <MenuItem value="Negado">Negado</MenuItem>
                      <MenuItem value="Cancelado">Cancelado</MenuItem>
                      <MenuItem value="Glosado">Glosado</MenuItem>
                      <MenuItem value="Pago">Pago</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "48.9ch" }}
                    variant="standard"
                  >
                    <InputLabel
                      id="StatusDoProcedimento"
                      sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                    >
                      Status
                    </InputLabel>
                    <Select
                      labelId="StatusDoProcedimento"
                      id="demo-simple-select"
                      // value={Status}
                      value={Status || DadosCarregados?.StatusProcedimento}
                      label="Status"
                      onChange={handleChangeStatus}
                      // value={DadosCarregados?.StatusProcedimento}
                      variant="outlined"
                      name="StatusProcedimento"
                    >
                      <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                      <MenuItem value="Pendente">Pendente</MenuItem>
                      {/* <MenuItem value="Crítico">Crítico</MenuItem> */}
                      {/* <MenuItem value="Glosado">Glosado</MenuItem> */}
                      {/* <MenuItem value="Cancelado">Cancelado</MenuItem> */}
                      <MenuItem value="Finalizado">Finalizado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <FormControl
                  fullWidth
                  // sx={{ m: 1, width: "32ch", border:'0.5px solid #bbb', borderRadius:'5px',padding:'0 20px', boxSizing:'border-box' }}
                  sx={{ m: 1, width: "32ch", display: "none" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="Progresso"
                    label="Progresso"
                    variant="outlined"
                    type="number"
                    onChange={handleChangeInputs}
                    inputProps={{ max: 100, min: 0 }}
                    value={DadosCarregados?.Progresso}
                  />
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "32ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="ValorEstimado"
                    label="Faturamento Esperado"
                    variant="outlined"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.ValorEstimado}
                    InputProps={{
                      inputComponent: CurrencyInput,
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "32ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="ValorRecebido"
                    label="Faturamento Recebido"
                    type="Pesquisar"
                    onChange={handleChangeInputs}
                    value={DadosCarregados?.ValorRecebido}
                    InputProps={{
                      inputComponent: CurrencyInput,
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "32ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="ValorGlosado"
                    label="Valor Glosado"
                    type="Pesquisar"
                    value={DadosCarregados?.ValorGlosado}
                    onChange={handleChangeInputs}
                    InputProps={{
                      inputComponent: CurrencyInput,
                    }}
                  />
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "49ch" }}
                  variant="standard"
                >
                  <TextField
                    fullWidth
                    name="DataProcedimento"
                    label="Data Procedimento"
                    type="date"
                    value={ChangeDateForInput(
                      DadosCarregados?.DataProcedimento,
                    )}
                    onChange={handleChangeInputs}
                  />
                  {/* {date2(DadosCarregados?.DataProcedimento)} */}
                </FormControl>
              </Grid>
            </TabPanelCustom>
            <TabPanelCustom visivel={value === 1}>
              <Box sx={{ width: "100%", gap: "10px" }}>
                <Grid container size={{ sm: 12 }}>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "ch", justifyContent: "center" }}
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
                        name="Documentos"
                        onChange={(event) =>
                          EnvioDocumentosoUpload(event.target.files)
                        }
                        multiple
                      />
                    </Button>
                  </FormControl>
                </Grid>

                <BlocoDocumentos identifier={DadosCarregados?.identifier} />
              </Box>
            </TabPanelCustom>
            <TabPanelCustom visivel={value === 2}>
              <Box sx={{ width: "100%", gap: "10px" }}>
                {DadosCarregados?.identifier && (
                  <BlocoPendencias identifier={DadosCarregados?.identifier} />
                )}
              </Box>
            </TabPanelCustom>

            <Grid container spacing={2} sx={{ padding: "10px" }}>
              <BotaoPadrao
                size="large"
                titulo="Salvar Alterações no Procedimento"
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
              />
              <Button
                size="large"
                startIcon={<CloseIcon />}
                onClick={fecharModal}
              >
                Cancelar
              </Button>
            </Grid>
          </TabContext>
        </form>
      )}
    </>
  );
};
