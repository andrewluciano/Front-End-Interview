import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  Alert,
  Fade,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Badge,
  LocalHospital,
  Receipt,
  Business,
  Add,
  Check,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import {
  OnboardingContainer,
  OnboardingCard,
  CardHeader,
  CardBody,
  Logo,
  LogoIcon,
  Title,
  Subtitle,
  FormSection,
  SectionTitle,
  FormRow,
  StepContent,
  ButtonGroup,
  ClinicsList,
} from "./OnboardingLayout";
import { StepIndicator } from "./StepIndicator";
import { styled } from "@/stitches.config";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/Autenticacao/ModalContext";
import { setItem, getItem } from "@/helpers/armazenamento";
import { useMutation } from "react-query";
import Api from "@/APIS/OnBoarding";
import toast from "react-hot-toast";

const steps = ["Dados Pessoais", "Dados Profissionais", "Clínicas"];

interface FormData {
  nome: string;
  emailPrincipal: string;
  telefone: string;
  cpf: string;
  crm: string;
  emailFaturamento: string;
  clinicas: string[];
}

interface UserData {
  id: string | number;
  email: string;
  full_name: string;
  role?: string;
}

interface OnboardingPayload {
  id: string | number;
  email: string;
  full_name: string;
  billing_email: string;
  offices: string[];
  phone: string;
  personal_document: string;
  professional_document: string;
  role?: string;
  onboarding: boolean;
  privacy_agreement: boolean;
  terms_agreement: boolean;
}

const SuccessContainer = styled("div", {
  textAlign: "center",
  padding: "$8",
});

const SuccessIcon = styled("div", {
  width: "80px",
  height: "80px",
  borderRadius: "$full",
  backgroundColor: "$primary",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto $6",
  color: "$white",
});

export const OnboardingForm = () => {
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const dados = getItem("dados_users");
    if (dados) {
      try {
        setUserData(JSON.parse(dados));
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e);
      }
    }
  }, []);

  // ACAO ENVIO
  const { mutate: salvarOnboarding } = useMutation(
    ["salvarOnboarding"],
    async (payload: OnboardingPayload) => {
      toast.loading("Salvando Dados de Usuário...");

      const apiInstance = await Api.create();
      // Assumindo que SalvarOnboarding aceita o payload. Se não, precisará ajustar a assinatura no Api
      const response = await apiInstance.SalvarOnboarding(payload);

      if (!response?.is_error) {
        toast.dismiss();
        return response;
      }
      toast.dismiss();
      toast.error("Erro ao salvar dados.");
      return null;
    },
    {
      onSuccess: (data) => {
        if (data) {
          setItem("onBoarding", false);
          setCompleted(true);
        }
      },
    },
  );

  const [activeStep, setActiveStep] = useState(0);
  const [clinicInput, setClinicInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    emailPrincipal: "",
    telefone: "",
    cpf: "",
    crm: "",
    emailFaturamento: "",
    clinicas: [],
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const isValidCPF = (cpf: string) => {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    const calcCheck = (base: number) => {
      let sum = 0;
      for (let i = 0; i < base - 1; i++) {
        sum += parseInt(cpf.charAt(i), 10) * (base - i);
      }
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };
    const d10 = calcCheck(10);
    if (d10 !== parseInt(cpf.charAt(9), 10)) return false;
    const d11 = calcCheck(11);
    if (d11 !== parseInt(cpf.charAt(10), 10)) return false;
    return true;
  };

  const isValidCNPJ = (cnpj: string) => {
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const calcDigit = (weights: number[]) => {
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += parseInt(cnpj.charAt(i), 10) * weights[i];
      }
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const d13 = calcDigit([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    if (d13 !== parseInt(cnpj.charAt(12), 10)) return false;

    const d14 = calcDigit([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    if (d14 !== parseInt(cnpj.charAt(13), 10)) return false;

    return true;
  };

  const formatCPF = (raw: string) => {
    const digits = raw.slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9,
    )}-${digits.slice(9)}`;
  };

  const formatCNPJ = (raw: string) => {
    const digits = raw.slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8)
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12)
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
        5,
        8,
      )}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
      5,
      8,
    )}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  };

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        nome: userData.full_name || "",
        emailPrincipal: userData.email || "",
      }));
    }
  }, [userData]);

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Format phone
      if (field === "telefone") {
        value = value.replace(/\D/g, "");
        if (value.length <= 11) {
          value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
          value = value.replace(/(\d{5})(\d)/, "$1-$2");
        }
      }

      // Format CPF + Validate when complete
      if (field === "cpf") {
        const raw = value.replace(/\D/g, "").slice(0, 14);
        value = raw.length <= 11 ? formatCPF(raw) : formatCNPJ(raw);

        if (raw.length === 11) {
          setErrors((prev) => ({
            ...prev,
            cpf: isValidCPF(raw) ? undefined : "CPF inválido",
          }));
        } else if (raw.length === 14) {
          setErrors((prev) => ({
            ...prev,
            cpf: isValidCNPJ(raw) ? undefined : "CNPJ inválido",
          }));
        } else if (errors.cpf) {
          setErrors((prev) => ({ ...prev, cpf: undefined }));
        }
      }

      // Mask CRM: "CRM/UF 000000" (UF duas letras, 6 dígitos)
      if (field === "crm") {
        const upper = value.toUpperCase();
        const letters = upper.replace(/[^A-Z]/g, "").slice(0, 2);
        const digits = upper.replace(/[^0-9]/g, "").slice(0, 10);
        value = `${letters}${letters.length ? " " : ""}${digits}`;
      }

      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const addClinic = () => {
    if (clinicInput.trim() && !formData.clinicas.includes(clinicInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        clinicas: [...prev.clinicas, clinicInput.trim()],
      }));
      setClinicInput("");
    }
  };

  const removeClinic = (clinic: string) => {
    setFormData((prev) => ({
      ...prev,
      clinicas: prev.clinicas.filter((c) => c !== clinic),
    }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (activeStep === 0) {
      if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
      if (!formData.emailPrincipal.trim()) {
        newErrors.emailPrincipal = "Email é obrigatório";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailPrincipal)) {
        newErrors.emailPrincipal = "Email inválido";
      }
      if (!formData.telefone.trim())
        newErrors.telefone = "Telefone é obrigatório";
    }

    if (activeStep === 1) {
      if (!formData.cpf.trim()) {
        newErrors.cpf = "CPF/CNPJ é obrigatório";
      } else {
        const raw = formData.cpf.replace(/\D/g, "");
        if (raw.length === 11) {
          if (!isValidCPF(raw)) newErrors.cpf = "CPF inválido";
        } else if (raw.length === 14) {
          if (!isValidCNPJ(raw)) newErrors.cpf = "CNPJ inválido";
        } else {
          newErrors.cpf = "CPF/CNPJ inválido";
        }
      }
      if (!formData.crm.trim()) newErrors.crm = "CRM é obrigatório";
      if (!formData.emailFaturamento.trim()) {
        newErrors.emailFaturamento = "Email de faturamento é obrigatório";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailFaturamento)
      ) {
        newErrors.emailFaturamento = "Email inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!userData) {
      toast.error("Erro ao recuperar dados do usuário. Tente novamente.");
      return;
    }

    const payload = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      billing_email: formData.emailFaturamento,
      offices: formData.clinicas,
      phone: formData.telefone,
      personal_document: formData.cpf,
      professional_document: formData.crm,
      role: userData.role,
      onboarding: true,
      privacy_agreement: true, // Assumindo aceite implícito ou adicionar checkbox
      terms_agreement: true, // Assumindo aceite implícito ou adicionar checkbox
    };

    console.log("Payload para envio:", payload);
    salvarOnboarding(payload);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addClinic();
    }
  };

  if (completed) {
    return (
      <OnboardingContainer>
        <OnboardingCard style={{ color: "green" }}>
          <CardHeader style={{ color: "green" }}>
            <Logo>
              <LogoIcon>
                <LocalHospital sx={{ fontSize: 28 }} />
              </LogoIcon>
            </Logo>
            <Title>Cadastro Concluído!</Title>
            <Subtitle>Bem-vindo ao sistema</Subtitle>
          </CardHeader>
          <CardBody>
            <SuccessContainer>
              <SuccessIcon style={{ color: "green" }}>
                <Check sx={{ fontSize: 40 }} />
              </SuccessIcon>
              <Box sx={{ mb: 3 }}>
                <h3 style={{ marginBottom: 8, color: "#121212" }}>
                  Obrigado, {formData.nome}!
                </h3>
                <p style={{ color: "#777777" }}>
                  Seu cadastro foi realizado com sucesso. Você receberá um email
                  de confirmação em breve.
                </p>
              </Box>
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  backgroundColor: "rgba(80, 137, 62, 0.1)",
                  color: "#3e5935",
                  "& .MuiAlert-icon": {
                    color: "#50893E",
                  },
                }}
              >
                Um link de acesso foi enviado para {formData.emailPrincipal}
              </Alert>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  closeModal();
                  navigate("/Dashboard-Medico");
                  setCompleted(false);
                  setActiveStep(0);
                  setFormData({
                    nome: "",
                    emailPrincipal: "",
                    telefone: "",
                    cpf: "",
                    crm: "",
                    emailFaturamento: "",
                    clinicas: [],
                  });
                }}
              >
                Continuar no sistema
              </Button>
            </SuccessContainer>
          </CardBody>
        </OnboardingCard>
      </OnboardingContainer>
    );
  }

  return (
    <OnboardingContainer>
      <OnboardingCard style={{ boxSizing: "border-box", padding: "20px" }}>
        <CardBody>
          <StepIndicator activeStep={activeStep} steps={steps} />

          <Fade in key={activeStep}>
            <StepContent>
              {activeStep === 0 && (
                <FormSection>
                  <SectionTitle>Informações Pessoais</SectionTitle>
                  <br />
                  <FormRow single>
                    <TextField
                      label="Nome Completo"
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={handleChange("nome")}
                      error={!!errors.nome}
                      helperText={errors.nome}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormRow>
                  <br />
                  <FormRow>
                    <TextField
                      label="Email Principal"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.emailPrincipal}
                      onChange={handleChange("emailPrincipal")}
                      error={!!errors.emailPrincipal}
                      helperText={errors.emailPrincipal}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange("telefone")}
                      error={!!errors.telefone}
                      helperText={errors.telefone}
                      fullWidth
                      inputProps={{ maxLength: 15 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormRow>
                </FormSection>
              )}

              {activeStep === 1 && (
                <FormSection>
                  <SectionTitle>Dados Profissionais</SectionTitle>
                  <br />
                  <FormRow>
                    <TextField
                      label="CPF/CNPJ"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      value={formData.cpf}
                      onChange={handleChange("cpf")}
                      error={!!errors.cpf}
                      helperText={errors.cpf}
                      fullWidth
                      inputProps={{ maxLength: 18 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="CRM"
                      placeholder="UF 000000"
                      value={formData.crm}
                      onChange={handleChange("crm")}
                      error={!!errors.crm}
                      helperText={errors.crm}
                      fullWidth
                      inputProps={{ maxLength: 13 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalHospital sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormRow>
                  <br />
                  <FormRow single>
                    <TextField
                      label="Email de Faturamento"
                      type="email"
                      placeholder="faturamento@email.com"
                      value={formData.emailFaturamento}
                      onChange={handleChange("emailFaturamento")}
                      error={!!errors.emailFaturamento}
                      helperText={errors.emailFaturamento}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Receipt sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormRow>
                </FormSection>
              )}

              {activeStep === 2 && (
                <FormSection>
                  <SectionTitle>Clínicas de Trabalho</SectionTitle>
                  <br />
                  <FormRow single>
                    <TextField
                      label="Adicionar Clínica"
                      placeholder="Nome da clínica"
                      value={clinicInput}
                      onChange={(e) => setClinicInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business sx={{ color: "#ACA99F" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={addClinic}
                              edge="end"
                              sx={{
                                backgroundColor: "#50893E",
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor: "#3e5935",
                                },
                              }}
                              size="small"
                            >
                              <Add />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormRow>

                  {formData.clinicas.length > 0 && (
                    <ClinicsList>
                      {formData.clinicas.map((clinic) => (
                        <Chip
                          key={clinic}
                          label={clinic}
                          onDelete={() => removeClinic(clinic)}
                          sx={{
                            backgroundColor: "rgba(80, 137, 62, 0.1)",
                            color: "#3e5935",
                            fontWeight: 500,
                            "& .MuiChip-deleteIcon": {
                              color: "#50893E",
                              "&:hover": {
                                color: "#D24340",
                              },
                            },
                          }}
                        />
                      ))}
                    </ClinicsList>
                  )}

                  {formData.clinicas.length === 0 && (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "#ACA99F",
                      }}
                    >
                      <Business sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <p>Nenhuma clínica adicionada ainda</p>
                      <p style={{ fontSize: "0.875rem" }}>
                        Digite o nome da clínica e pressione Enter ou clique no
                        botão +
                      </p>
                    </Box>
                  )}
                </FormSection>
              )}
            </StepContent>
          </Fade>

          <ButtonGroup>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
              sx={{
                borderColor: "#EDEDF1",
                color: "#777777",
                "&:hover": {
                  borderColor: "#ACA99F",
                  backgroundColor: "#f8f8f8",
                },
              }}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={
                activeStep === steps.length - 1 ? <Check /> : <ArrowForward />
              }
            >
              {activeStep === steps.length - 1
                ? "Finalizar Cadastro"
                : "Próximo"}
            </Button>
          </ButtonGroup>
        </CardBody>
      </OnboardingCard>
    </OnboardingContainer>
  );
};
