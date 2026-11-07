import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";

import { TabPanelCustom } from "./Styles";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { type FC, type FormEvent, useState } from "react";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";

import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";

import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import Api from "../API/AdicionarPaciente";

// Icones
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { PhoneMaskCustom, CEPMaskCustom } from "@/Componentes/MaskInput";
import { CRMMaskCustom } from "@/Componentes/MaskInput";

// APIS
import ApiCep from "@/APIS/Ceps";
import { useModal } from "@/Autenticacao/ModalContext";

interface IMyProps {
  Close: () => void;
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

export const AdicionarPaciente: FC<IMyProps> = () => {
  const { closeModal } = useModal();

  const [DocumentosUpload, setDocumentosUpload] = useState([]);

  const EnvioDocumentosoUpload = (dados: File) => {
    setDocumentosUpload(dados);
  };

  const [formAdicionarPaciente, setFormAdicionarPaciente] = useState({
    address_zipcode: "",
    address_state: "",
    address_city: "",
    address_neighbor: "",
    address: "",
    address_number: "",
  });

  const [Gender, setGender] = useState("");
  function handleChangeGender(event: SelectChangeEvent): void {
    setGender(event.target.value as string);
  }
  const [DocType, setDocType] = useState("");
  function handleChangeDocType(event: SelectChangeEvent): void {
    setDocType(event.target.value as string);
  }

  const queryClient = useQueryClient();

  const { mutate: PesquisaCep } = useMutation(
    async (dados) => {
      toast.loading("Carregando dados do CEP");
      try {
        const response = await ApiCep.GetCEP(dados);
        if (!response) {
          throw new Error("CEP inválido");
        }

        document.getElementById("address_number")?.focus();

        setFormAdicionarPaciente({
          ...formAdicionarPaciente,
          address_zipcode: response?.zipcode,
          address: response?.street,
          address_state: response?.state,
          address_city: response?.city,
          address_neighbor: response?.neighborhood,
        });

        toast.dismiss();
        return response;
      } catch (error) {
        toast.dismiss();
        toast.error("Cep Invalido");
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  );

  const { mutate: AcaoAdicionarPaciente } = useMutation(async (dados) => {
    const ToastLoading = toast.loading("Adicionando paciente");
    const apiInstance = await Api.create();

    const response = await apiInstance.PostPaciente(dados);

    if (!response?.is_error) {
      toast.success("Paciente adicionado com sucesso");

      setTimeout(() => {
        toast.dismiss(ToastLoading);
        console.log("DocumentosUpload", DocumentosUpload);
        if (DocumentosUpload.length > 0) {
          refetchAcaoAdicionarProcedimentoUpload(response?.relationated_id);
        } else {
          closeModal();
          queryClient.invalidateQueries();
          queryClient.refetchQueries();
        }
      }, 500);
    } else {
      setTimeout(() => {
        toast.dismiss();
      }, 500);
      queryClient.invalidateQueries();
    }
    return response;
  });

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    const formData = new FormData(form.target);
    const formValues = Object.fromEntries(formData.entries());
    // formValues.birth_date = new Date(formValues.birth_date).toISOString();
    formValues.address = formAdicionarPaciente?.address || "";
    formValues.address_neighbor = formAdicionarPaciente?.address_neighbor || "";
    formValues.address_state = formAdicionarPaciente?.address_state || "";
    formValues.address_city = formAdicionarPaciente?.address_city || "";

    // const formValuesjSon = JSON.stringify(formValues);
    AcaoAdicionarPaciente(formValues);
  };

  // const { refetch: refetchAcaoAdicionarProcedimentoUpload } = useQuery(
  //   ["AcaoAdicionarProcedimentoUpload"],
  //   async (dados) => {

  const { mutate: refetchAcaoAdicionarProcedimentoUpload } = useMutation(
    async (dados) => {
      if (DocumentosUpload.length === 0) {
        return;
      }

      const ToastLoading = toast.loading(
        "Upload de documentos para o paciente",
      );
      const apiInstance = await Api.create();

      const response = await apiInstance.AdicionarDocumentos(
        dados,
        DocumentosUpload[0],
      );

      if (!response?.is_error) {
        toast.success("Upload Documentos com Sucesso");

        setTimeout(() => {
          toast.dismiss();
          closeModal();
          queryClient.invalidateQueries();
          queryClient.refetchQueries();
          setDocumentosUpload([]);
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
    },
  );

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <form onSubmit={(form) => Formulario(form)} name="formAdicionarPaciente">
      <input type="hidden" name="optin_message" value={true} />
      <input
        type="hidden"
        name="optin_message_date"
        value={new Date().toISOString()}
      />
      <Box sx={{ width: "100%", sm: 12, md: 12 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Adicionar Novo Paciente"
              variant="scrollable"
            >
              <Tab sx={{ sm: "auto" }} label="Dados Paciente" />
              <Tab sx={{ sm: "auto" }} label="Dados Convênio" />
              <Tab sx={{ sm: "auto" }} label="Dados Médicos" />
              <Tab sx={{ sm: "auto" }} label="Documentos" />
            </Tabs>
          </Box>
          <TabPanelCustom visivel={value === 0}>
            <Grid container size={{ xs: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "99.8ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="full_name"
                  label="Nome do Paciente"
                  variant="outlined"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "41.2ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="sus_number"
                  label="Cartão do SUS"
                  variant="outlined"
                />
              </FormControl>

              <FormControl
                fullWidth
                sx={{ m: 1, width: "15.2ch" }}
                variant="standard"
              >
                <InputLabel
                  id="LabedocumentType"
                  sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                >
                  Documento
                </InputLabel>
                <Select
                  labelId="LabedocumentType"
                  id="Doctype-select"
                  value={DocType}
                  label="primary_document_type"
                  onChange={handleChangeDocType}
                  variant="outlined"
                  name="primary_document_type"
                >
                  <MenuItem value="RG">RG</MenuItem>
                  <MenuItem value="CNH">CNH</MenuItem>
                  <MenuItem value="CPF">CPF</MenuItem>
                  <MenuItem value="RE">RE</MenuItem>
                  <MenuItem value="Outro">Outro</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "40.2ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="primary_document_number"
                  label="Doc do Paciente"
                  variant="outlined"
                />
              </FormControl>

              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="Pesquisar"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49.4ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Telefone"
                  type="Pesquisar"
                  InputProps={{
                    inputComponent: PhoneMaskCustom,
                  }}
                />
              </FormControl>

              <Grid container size={{ sm: 4, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "32ch" }}
                  variant="standard"
                >
                  <InputLabel
                    id="LabelGender"
                    sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                  >
                    Genero
                  </InputLabel>
                  <Select
                    labelId="LabelGender"
                    id="Gender-select"
                    value={Gender}
                    label="Genero"
                    onChange={handleChangeGender}
                    variant="outlined"
                    name="gender"
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Feminino">Feminino</MenuItem>
                    <MenuItem value="Trans">Trans</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                    <MenuItem value="Prefiro não Informar">
                      Prefiro não Informar
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 4, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "32ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    name="nationality"
                    label="Nacionalidade"
                    type="Pesquisar"
                  />
                </FormControl>
              </Grid>

              <Grid
                container
                size={{ sm: 4, xs: 12 }}
                sx={{ paddingLeft: "8px" }}
              >
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "31.3ch" }}
                  variant="standard"
                  required
                >
                  <TextField
                    required
                    fullWidth
                    name="birth_date"
                    label="Data de nascimento"
                    type="date"
                  />
                  {/* 
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        sx={{ m: 0, width: "50ch" }}
                        label="Data de nascimento"
                        name="birth_date"
                      />
                    </DemoContainer>
                  </LocalizationProvider> */}
                </FormControl>
              </Grid>

              <Grid container size={{ sm: 2, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "15ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    name="address_zipcode"
                    label="Cep"
                    type="Pesquisar"
                    InputProps={{
                      inputComponent: CEPMaskCustom,
                    }}
                    onBlur={(e) => PesquisaCep(e.target.value)}
                  />
                </FormControl>
              </Grid>
              {/* <Grid size={{ sm: 2.45, xs: 12 }}>
                <FormControl fullWidth sx={{ m: 1, width: "20ch" }} variant="standard">
                    <TextField
                        required
                        fullWidth
                        name="country"
                        label="Pais"               
                    />
                </FormControl>
            </Grid>         */}
              <Grid container size={{ sm: 1.15, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "8ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    name="address_state"
                    label="UF"
                    disabled
                    value={formAdicionarPaciente?.address_state}
                  />
                  {/* <SelectCustom id="UFs" name="UFs" /> */}
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 4, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "32ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    disabled
                    name="address_city"
                    label="Cidade"
                    value={formAdicionarPaciente?.address_city}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 4.8, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "39.2ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    name="address_neighbor"
                    disabled
                    label="Bairro"
                    value={formAdicionarPaciente?.address_neighbor}
                  />
                </FormControl>
              </Grid>
              <Grid container size={{ sm: 10, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "83ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    name="address"
                    disabled
                    label="Endereço"
                    type="Pesquisar"
                    value={formAdicionarPaciente?.address}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ sm: 2, xs: 12 }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: "15.2ch" }}
                  variant="standard"
                >
                  <TextField
                    required
                    fullWidth
                    name="address_number"
                    id="address_number"
                    label="Número"
                    type="Pesquisar"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanelCustom>

          <TabPanelCustom visivel={value === 1}>
            <Grid container size={{ xs: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "32ch" }}
                variant="standard"
              >
                <TextField
                  fullWidth
                  name="insurance_provider"
                  variant="outlined"
                  label="Convenio"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "32ch" }}
                variant="standard"
              >
                <TextField
                  fullWidth
                  name="insurance_provider_plan"
                  label="Plano"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "32ch" }}
                variant="standard"
              >
                <TextField
                  fullWidth
                  name="insurance_policy_number"
                  label="Numero Carteirinha"
                />
              </FormControl>
            </Grid>
          </TabPanelCustom>

          <TabPanelCustom visivel={value === 2}>
            <Grid container size={{ xs: 12 }}>
              <Grid size={{ xs: 12 }} spacing={1}>
                <Typography variant="subtitle2" sx={{ paddingLeft: "10px" }}>
                  Contato de Emergência
                </Typography>
              </Grid>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="emergency_contact_name"
                  variant="outlined"
                  label="Contato Emergência"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="emergency_contact"
                  variant="outlined"
                  label="Telefone"
                  InputProps={{
                    inputComponent: PhoneMaskCustom,
                  }}
                />
              </FormControl>
              <Grid size={{ xs: 12 }} spacing={1}>
                <Typography variant="subtitle2" sx={{ padding: "10px" }}>
                  Dados do Médico Principal
                </Typography>
              </Grid>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="primary_physician"
                  variant="outlined"
                  label="Médico"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="primary_physician_code"
                  label="CRM do Medico"
                  type="Pesquisar"
                  InputProps={{
                    inputComponent: CRMMaskCustom,
                  }}
                />
              </FormControl>
              <Grid size={{ xs: 12 }} spacing={1}>
                <Typography variant="subtitle2" sx={{ padding: "10px" }}>
                  Informações Médicas
                </Typography>
              </Grid>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "100ch" }}
                variant="standard"
              >
                <TextField
                  fullWidth
                  name="medical_history"
                  variant="outlined"
                  label="Histórico Médico"
                  multiline
                  rows={4}
                />
              </FormControl>

              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  fullWidth
                  name="allergies"
                  variant="outlined"
                  label="Alergias"
                  multiline
                  rows={4}
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  fullWidth
                  name="current_medications"
                  variant="outlined"
                  label="Medicamentos Continuos"
                  multiline
                  rows={4}
                />
              </FormControl>
            </Grid>
          </TabPanelCustom>

          <TabPanelCustom visivel={value === 3}>
            <Box>
              <Grid container size={{ sm: 12, xs: 12 }}>
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
              </Grid>

              <Grid container size={{ sm: 12, xs: 12 }} spacing={1}>
                <Typography variant="subtitle2" sx={{ paddingLeft: "10px" }}>
                  Documentos
                </Typography>
                {DocumentosUpload.length > 0 && (
                  <Typography variant="body2" sx={{ color: "green" }}>
                    {DocumentosUpload.length} arquivo(s) carregado(s)
                  </Typography>
                )}
              </Grid>
            </Box>
          </TabPanelCustom>
        </TabContext>
      </Box>

      {/* Inicio AreaBotoes */}
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <BotaoPadrao
          size="large"
          titulo="Adicionar Paciente"
          variant="contained"
          type="submit"
          startIcon={<SaveIcon />}
        />
        <Button
          size="large"
          startIcon={<CloseIcon />}
          onClick={() => closeModal()}
        >
          Cancelar
        </Button>
      </Grid>
    </form>
  );
};
