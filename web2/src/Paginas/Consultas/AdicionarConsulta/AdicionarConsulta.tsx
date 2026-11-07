import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  type SelectChangeEvent,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  type FC,
  type FormEvent,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { styled } from "@mui/material/styles";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { cleanCurrency } from "@/Componentes/CleanCurrency";
import { useSearchParams } from "react-router-dom";

import { PhoneMaskCustom } from "@/Componentes/MaskInput";

import Api from "../API/Consultas";
import ApiUploads from "@/APIS/ProcedimentosUploads";

import { NumericFormat } from "react-number-format";

import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";

// Icones
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useModal } from "@/Autenticacao/ModalContext";
import { RetornoIdade } from "@/helpers/format/Dates";
import TabContext from "@mui/lab/TabContext";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { TabPanelCustom } from "./Styles";

interface IConsulta {
  nome_paciente: string;
  nome_procedimento: string;
  cpf_rg: string;
  r_nascido: string;
  numero_carteira: string;
  data_nascimento: Date;
  idade: number;
  contato: string;
  convenio: string;
  unidade: string;
  local: string;
  tipo_encontro: string;
  data_consulta: Date;
  medico: string;
  medico_encaminhador: string;
  valor_receber: number;
  valor_recebido: number;
}

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
            name: props.name,
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
// const ToastLoading = "";

export const AdicionarConsulta: FC = () => {
  const { closeModal } = useModal();
  const [searchParams] = useSearchParams();

  const [Tipo, setTipo] = useState("consulta");
  const [DataNascimento, setDataNascimento] = useState(0);
  const [RecemNascido, setRecemNascido] = useState(false);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const ColunaLargura = isMobile ? 120 : (window.innerWidth - 200) / 4;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (searchParams.has("AdicionarConsultaUpload")) {
      setValue(1);
      return;
    }
    if (searchParams.has("AdicionarConsultaManual")) {
      setValue(0);
    }
  }, [searchParams]);

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    const formData = new FormData(form.target);
    const formValues = Object.fromEntries(formData.entries());

    formValues.idade = DataNascimento.toString() || "0";
    formValues.valor_receber =
      cleanCurrency(formValues.valor_receber).toString() || "0";
    formValues.valor_recebido =
      cleanCurrency(formValues.valor_recebido).toString() || "0";
    formValues.r_nascido = RecemNascido.toString();
    AcaoAdicionarConsulta(formValues);
  };

  function handleChangeTipo(event: SelectChangeEvent): void {
    setTipo(event.target.value as string);
  }

  function handleChangeDataNascimento(event: SelectChangeEvent): void {
    event.preventDefault();
    setTimeout(() => {
      setDataNascimento(RetornoIdade(event.target.value));
    }, 100);
  }

  const queryClient = useQueryClient();

  const { mutate: AcaoAdicionarConsulta } = useMutation(async (dados) => {
    toast.loading("Adicionando Consulta...");
    const apiInstance = await Api.create();

    const response = await apiInstance.AdicionarConsultas(dados);

    if (!response?.is_error) {
      toast.dismiss();
      toast.success("Consulta adicionada com sucesso");
      queryClient.invalidateQueries();
      queryClient.refetchQueries();
      setTimeout(() => {
        closeModal();
      }, 500);
    } else {
      toast.dismiss();
      const errorDetail = response?.data?.detail;
      if (response?.status === 422 && errorDetail) {
        // Exibe o erro de validação (422)
        if (Array.isArray(errorDetail)) {
          errorDetail.forEach((err) =>
            toast.error(`${err.loc.join(" -> ")}: ${err.msg}`),
          );
        } else {
          toast.error(errorDetail);
        }
      } else {
        toast.error("Erro ao adicionar consulta");
      }
      queryClient.invalidateQueries();
    }
    return response;
  });

  const { mutate: EnvioProcedimentoUpload } = useMutation(
    async (file: File) => {
      toast.loading("Carregando Dados de Procedimento");
      const apiInstance = await ApiUploads.create();
      const response = await apiInstance.PostUploadsConsultas(file);
      if (!response?.is_error) {
        toast.success("UPload feito com sucesso");
        setTimeout(() => {
          toast.dismiss();
          queryClient.invalidateQueries({ queryKey: ["ListaUploadsAll"] });
          queryClient.invalidateQueries({
            queryKey: ["ListaUploadsByProcedure"],
          });
        }, 500);
      } else {
        setTimeout(() => {}, 500);
        toast.dismiss();
      }
      return response;
    },
  );

  function handleChangeRecemNascido(
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void {
    setRecemNascido(checked);
  }

  return (
    <form onSubmit={(form) => Formulario(form)}>
      <Box
        sx={{
          width: "100%",
          sm: 12,
          md: 12,
          height: "100%",
          overflow: "hidden !important",
        }}
      >
        {/* <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", display:'none'}}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Adicionar Consulta"
              variant="scrollable"
            >
              <Tab sx={{ sm: "auto" }} label="Adicionar Atendimento Manualmente" />
              {/* <Tab sx={{ sm: "auto" }} label="Upload de Arquivo" /> 
            </Tabs>
          </Box> */}

        {/* <TabPanelCustom visivel={value === 0} > */}
        <Grid container>
          <Grid
            container
            sx={{
              pb: 2,
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "calc(100vh - 285px)",
            }}
          >
            <Grid container size={{ sm: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "99.5ch" }}
                variant="standard"
              >
                <InputLabel
                  id="TipoLabel"
                  sx={{ padding: "0", margin: "-6px 0 0 15px" }}
                >
                  Tipo de Procedimento
                </InputLabel>
                <Select
                  labelId="TipoLabel"
                  id="demo-simple-select"
                  fullWidth
                  value={Tipo}
                  required
                  label="Tipo de Procedimento"
                  onChange={handleChangeTipo}
                  variant="outlined"
                  name="tipo_encontro"
                >
                  <MenuItem value="consulta">Consulta</MenuItem>
                  <MenuItem value="procedimento">Procedimento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container size={{ sm: 6.93, xs: 6.93 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "99.5ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="nome_paciente"
                  label="Nome do Paciente"
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
                  required
                  fullWidth
                  name="cpf_rg"
                  label="Documento"
                  variant="outlined"
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
                  required
                  fullWidth
                  name="contato"
                  label="Contato"
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
                  value={DataNascimento}
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
                  label="Data e Hora do Procedimento"
                  variant="outlined"
                  type="datetime-local"
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
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ padding: "10px" }}>
            <BotaoPadrao
              size="large"
              titulo="Adicionar Procedimento"
              variant="contained"
              type="submit"
              startIcon={<SaveIcon />}
            />
            <Button
              size="large"
              startIcon={<CloseIcon />}
              onClick={() => closeModal()}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
        {/* </TabPanelCustom> */}

        <TabPanelCustom visivel={value === 1}>
          <Grid container size={{ md: 12 }}>
            <Grid
              container
              spacing={2}
              sx={{ pb: 2 }}
              justifyContent={"flex-end"}
              size={{ md: 12 }}
            >
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<ChecklistIcon />}
              >
                Selecionar Arquivos de Consultas
                <VisuallyHiddenInput
                  type="file"
                  name="file"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setSelectedFiles(files);
                  }}
                />
              </Button>
            </Grid>
            <Grid container size={{ md: 12 }} flexDirection={"column"}>
              <Typography variant="body2" sx={{ pb: 2, fontWeight: "600" }}>
                Arquivos Selecionados para upload
              </Typography>
              <DataGrid
                sx={{ width: "100%" }}
                rows={selectedFiles.map((file) => ({
                  id: file
                    ? `${file.name}-${file.lastModified}-${file.size ?? 0}`
                    : Math.random().toString(36).slice(2),
                  name: file?.name ?? "",
                  type: file?.type || "desconhecido",
                  size: file?.size ?? 0,
                  lastModified: file
                    ? new Date(file.lastModified).toLocaleString()
                    : "",
                  file,
                }))}
                columns={
                  [
                    {
                      field: "actions",
                      headerName: "Ações",
                      width: 120,
                      sortable: false,
                      filterable: false,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<FileUploadOutlinedIcon />}
                          onClick={() =>
                            EnvioProcedimentoUpload(params.row.file)
                          }
                        >
                          Enviar
                        </Button>
                      ),
                    },
                    { field: "name", headerName: "Arquivo", width: 350 },
                    { field: "type", headerName: "Tipo", width: ColunaLargura },
                    {
                      field: "size",
                      headerName: "Tamanho (bytes)",
                      width: ColunaLargura,
                    },
                  ] as GridColDef[]
                }
                getRowId={(row) => row.id}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Grid>
          </Grid>
        </TabPanelCustom>
        {/* </TabContext> */}
      </Box>
    </form>
  );
};
