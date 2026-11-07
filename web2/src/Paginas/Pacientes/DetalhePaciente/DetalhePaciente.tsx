/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { type FC, type FormEvent, useEffect, useState } from "react";

import { BotaoPadrao } from "@/Componentes/BotaoPadrao";

import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";

// Icones
import { PhoneMaskCustom, CEPMaskCustom } from "@/Componentes/MaskInput";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { ExcluirPaciente } from "../ExcluirPaciente";

import toast from "react-hot-toast";
let ToastLoading = "";

// APIs
import Api from "../API/Pacientes";
import ApiCep from "@/APIS/Ceps";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { TabPanelCustom } from "./Styles";

import LinearProgress from "@mui/material/LinearProgress";
import { useModal } from "@/Autenticacao/ModalContext";
import { DocumentoPaciente } from "../Componentes/DocumentoPaciente";

export const DetalhePaciente: FC = (props) => {
  const queryClient = useQueryClient();

  const { openModal, closeModal } = useModal();
  const [Loading, setLoading] = useState(false);

  const AbreModalExcluirPaciente = (e) => {
    e.preventDefault();

    setTimeout(() => {
      const modalContent = (
        <ExcluirPaciente DadosSelecionados={props?.DadosSelecionados} />
      );
      const TituloModal = "Excluir Paciente";
      const SubTituloModal = "Excluir dados do paciente";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 100);
  };

  const { mutate: PesquisaCep } = useMutation(
    async (dados) => {
      ToastLoading = toast.loading("Buscando CEP");
      const response = await ApiCep.GetCEP(dados);

      if (response?.status === 200) {
        toast.dismiss(ToastLoading);
        setTimeout(() => {
          toast.dismiss(ToastLoading);
          queryClient.invalidateQueries();
          queryClient.refetchQueries();
          formEditarPaciente.state.value = response?.state;
          formEditarPaciente.city.value = response?.city;
          formEditarPaciente.district.value = response?.district;
          formEditarPaciente.address.value = response?.address;
          formEditarPaciente.address_number.focus();
        }, 500);
      } else {
        toast.dismiss(ToastLoading);
        queryClient.invalidateQueries();
        toast.error("Cep Invalido");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  );

  const DadosPacientes = useQuery(
    ["DadosPacientes"],
    async () => {
      setLoading(true);
      const apiInstance = await Api.create();

      const response = await apiInstance.GetPacientes(
        props?.DadosSelecionados?.identifier,
      );
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = DadosPacientes.isLoading;

  const hasContent = DadosPacientes?.data?.content[0] ?? [];

  const { mutate: AcaoAdicionarPaciente } = useMutation(async (dados: []) => {
    toast.loading("Alterando...");
    const apiInstance = await Api.create();

    const response = await apiInstance.EditarPacientes(
      hasContent?.identifier,
      dados,
    );

    if (!response?.is_error) {
      toast.success("Alterado com Sucesso");

      setTimeout(() => {
        toast.dismiss();
        closeModal();
        queryClient.invalidateQueries();
        queryClient.refetchQueries();
      }, 500);
    } else {
      setTimeout(() => {
        closeModal();
        queryClient.invalidateQueries();
        queryClient.refetchQueries();
      }, 500);
      toast.dismiss();
    }

    return response;
  });

  const Formulario = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    const formData = new FormData(form.target);
    const formValues = Object.fromEntries(formData.entries());
    // formValues.birth_date = new Date(formValues.birth_date).toISOString();

    console.log("Formulario", formValues);

    AcaoAdicionarPaciente(formValues);
  };
  const [value, setValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const [Genero, setGenero] = useState("");
  function handleChangeGenero(event: SelectChangeEvent): void {
    console.log(Genero);
    setGenero(event.target.value as string);
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  const [DocType, setDocType] = useState("");
  function handleChangeDocType(event: SelectChangeEvent): void {
    console.log(DocType);
    setDocType(event.target.value as string);
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  const PaymentSkeleton = () => (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{ height: "180px", alignContent: "center", justifyContent: "center" }}
    >
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </Grid>
  );

  // const [setDateBirth] = useState(
  //   dayjs(hasContent?.birth_date || ""),
  // );

  // const handleChangeDate = (e: Date) => {
  //   setDateBirth(e);
  //   setFormValues({
  //     ...formValues,
  //     ["birth_date"]: e,
  //   });
  // };

  const [formValues, setFormValues] = useState({
    identifier: hasContent?.identifier,
    full_name: hasContent?.full_name,

    sus_number: hasContent?.sus_number,
    primary_document_number: hasContent?.primary_document_number,
    primary_document_type: hasContent?.primary_document_type,

    email: hasContent?.email,
    phone: hasContent?.phone,
    birth_date: hasContent?.birth_date,
    gender: hasContent?.gender,

    address_zipcode: hasContent?.address_zipcode,
    address: hasContent?.address,
    address_number: hasContent?.address_number,

    address_state: hasContent?.address_state,
    address_city: hasContent?.address_city,
    address_neighbor: hasContent?.address_neighbor,

    marital_status: hasContent?.marital_status,
    nationality: hasContent?.nationality,

    emergency_contact_name: hasContent?.emergency_contact_name,
    emergency_contact: hasContent?.emergency_contact,

    medical_history: hasContent?.medical_history,
    allergies: hasContent?.allergies,
    current_medications: hasContent?.current_medications,

    primary_physician_code: hasContent?.primary_physician_code,

    primary_physician: hasContent?.primary_physician,
    insurance_provider: hasContent?.insurance_provider,

    insurance_provider_plan: hasContent?.insurance_provider_plan,

    insurance_policy_number: hasContent?.insurance_policy_number,
    optin_message: hasContent?.optin_message,
    optin_message_date: hasContent?.optin_message_date,
  });

  useEffect(() => {
    if (hasContent && Object.keys(hasContent).length > 0) {
      setFormValues(hasContent);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [hasContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
      {!isFetching && !Loading && hasContent && (
        <form onSubmit={(form) => Formulario(form)} name="formEditarPaciente">
          <input
            type="hidden"
            name="identifier"
            value={hasContent?.identifier}
          />
          <input
            type="hidden"
            name="optin_message"
            value={hasContent?.optin_message}
          />
          <input
            type="hidden"
            name="optin_message_date"
            value={hasContent?.optin_message_date}
          />
          <Box sx={{ width: "100%", sm: 12, md: 12 }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChangeTab}
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
                    sx={{ m: 1, width: "100ch" }}
                    variant="standard"
                  >
                    <TextField
                      required
                      fullWidth
                      name="full_name"
                      label="Nome do Paciente"
                      variant="outlined"
                      value={formValues?.full_name || ""}
                      onChange={handleChange}
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
                      value={formValues?.sus_number || ""}
                      onChange={handleChange}
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
                      value={formValues?.primary_document_type || ""}
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
                      value={formValues?.primary_document_number || ""}
                      onChange={handleChange}
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
                      value={formValues?.email || ""}
                      onChange={handleChange}
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
                      value={formValues?.phone || ""}
                      onChange={handleChange}
                      InputProps={{
                        inputComponent: PhoneMaskCustom,
                      }}
                    />
                  </FormControl>

                  <Grid size={{ sm: 4, xs: 12 }}>
                    <FormControl
                      fullWidth
                      sx={{ m: 1, width: "32ch" }}
                      variant="standard"
                    >
                      <InputLabel
                        id="LabelGenero"
                        sx={{ padding: "0", margin: "-4px 0 0 15px" }}
                      >
                        Genero
                      </InputLabel>
                      <Select
                        labelId="LabelGenero"
                        id="Genero-select"
                        value={formValues?.gender || ""}
                        label="Genero"
                        onChange={handleChangeGenero}
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

                  <Grid size={{ sm: 4, xs: 12 }}>
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
                        value={formValues?.nationality || ""}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={{ sm: 4, xs: 12 }} sx={{ paddingLeft: "8px" }}>
                    <FormControl
                      fullWidth
                      sx={{ m: 1, width: "31.5ch" }}
                      variant="standard"
                      required
                    >
                      <TextField
                        required
                        fullWidth
                        name="birth_date"
                        label="Data de nascimento"
                        type="date"
                        value={formValues?.birth_date || ""}
                        onChange={handleChange}
                      />

                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            format="MM/DD/YYYY"
                            sx={{ m: 0, width: "50ch" }}
                            label="Data de nascimento"
                            name="birth_date"
                            value={DateBirth || ""}
                            onChange={handleChangeDate}
                          />
                        </DemoContainer>
                      </LocalizationProvider> */}
                    </FormControl>
                  </Grid>

                  <Grid size={{ sm: 2, xs: 12 }}>
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
                        value={formValues?.address_zipcode || ""}
                        onChange={handleChange}
                        InputProps={{
                          inputComponent: CEPMaskCustom,
                        }}
                        onBlur={(e) => PesquisaCep(e.target.value)}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={{ sm: 1.15, xs: 12 }}>
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
                        value={formValues?.address_state || ""}
                        onChange={handleChange}
                      />
                      {/* <SelectCustom id="UFs" name="UFs" /> */}
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 4, xs: 12 }}>
                    <FormControl
                      fullWidth
                      sx={{ m: 1, width: "32ch" }}
                      variant="standard"
                    >
                      <TextField
                        required
                        fullWidth
                        name="address_city"
                        label="Cidade"
                        value={formValues?.address_city || ""}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 4.8, xs: 12 }}>
                    <FormControl
                      fullWidth
                      sx={{ m: 1, width: "39.2ch" }}
                      variant="standard"
                    >
                      <TextField
                        required
                        fullWidth
                        name="address_neighbor"
                        label="Bairro"
                        value={formValues?.address_neighbor || ""}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={{ sm: 10, xs: 12 }}>
                    <FormControl
                      fullWidth
                      sx={{ m: 1, width: "83ch" }}
                      variant="standard"
                    >
                      <TextField
                        required
                        fullWidth
                        name="address"
                        label="Endereço"
                        type="Pesquisar"
                        value={formValues?.address || ""}
                        onChange={handleChange}
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
                        label="Número"
                        type="Pesquisar"
                        value={formValues?.address_number || ""}
                        onChange={handleChange}
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
                      required
                      fullWidth
                      name="insurance_provider"
                      variant="outlined"
                      label="Convenio"
                      value={formValues?.insurance_provider || ""}
                      onChange={handleChange}
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
                      value={formValues?.insurance_provider_plan || ""}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ m: 1, width: "32ch" }}
                    variant="standard"
                  >
                    <TextField
                      required
                      fullWidth
                      name="insurance_policy_number"
                      label="Numero Carteirinha"
                      value={formValues?.insurance_policy_number || ""}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
              </TabPanelCustom>

              <TabPanelCustom visivel={value === 2}>
                <Grid container size={{ xs: 12 }}>
                  <Grid size={{ xs: 12 }} spacing={1}>
                    <Typography variant="subtitle2" sx={{ padding: "10px" }}>
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
                      value={formValues?.emergency_contact_name || ""}
                      onChange={handleChange}
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
                      value={formValues?.emergency_contact || ""}
                      onChange={handleChange}
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
                      value={formValues?.primary_physician || ""}
                      onChange={handleChange}
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
                      value={formValues?.primary_physician_code || ""}
                      onChange={handleChange}
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
                      value={formValues?.medical_history || ""}
                      onChange={handleChange}
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
                      value={formValues?.allergies || ""}
                      onChange={handleChange}
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
                      value={formValues?.current_medications || ""}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
              </TabPanelCustom>

              <TabPanelCustom visivel={value === 3}>
                <DocumentoPaciente
                  DadosSelecionados={props?.DadosSelecionados}
                />
              </TabPanelCustom>
            </TabContext>
          </Box>
          <Grid container spacing={2} sx={{ padding: "10px" }}>
            <BotaoPadrao
              size="large"
              titulo="Salvar Alterações"
              variant="contained"
              type="submit"
            />
            <Button size="large" onClick={() => closeModal()}>
              Cancelar Alterações
            </Button>
            <Button
              size="large"
              color="error"
              onClick={() => AbreModalExcluirPaciente()}
              startIcon={<DeleteForeverIcon />}
            >
              Excluir Paciente
            </Button>
          </Grid>
        </form>
      )}
      {Loading && <PaymentSkeleton />}
    </>
  );
};
