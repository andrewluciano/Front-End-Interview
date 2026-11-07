/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { type FC, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

import { useMutation, useQueryClient } from "react-query";
import Api from "@/APIS/Onboarding";
import toast from "react-hot-toast";

import { useModal } from "@/Autenticacao/ModalContext";
import { PhoneMaskCustom } from "@/Componentes/MaskInput";

export const EditarPerfil: FC = (props: any) => {
  const { closeModal } = useModal();

  const [formValues, setFormValues] = useState({
    id: "",
    email: "",
    full_name: "",
    billing_email: "",
    offices: [] as string[],
    phone: "",
    personal_document: "",
    professional_document: "",
    role: "",
    message: null,
    onboarding: true,
    privacy_agreement: true,
    terms_agreement: true,
  });

  const [newOffice, setNewOffice] = useState("");

  useEffect(() => {
    if (props?.DadosSelecionados) {
      setFormValues({
        ...props.DadosSelecionados,
        offices: props.DadosSelecionados.offices || [],
      });
    }
  }, [props?.DadosSelecionados]);

  const handleChange = (event: { target: { name: string; value: any } }) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOffice = () => {
    if (newOffice && !formValues.offices.includes(newOffice)) {
      setFormValues((prev) => ({
        ...prev,
        offices: [...prev.offices, newOffice],
      }));
      setNewOffice("");
    }
  };

  const handleDeleteOffice = (officeToDelete: string) => {
    setFormValues((prev) => ({
      ...prev,
      offices: prev.offices.filter((office) => office !== officeToDelete),
    }));
  };

  const queryClient = useQueryClient();

  const { mutate: AcaoEditarPerfil } = useMutation(async () => {
    toast.loading("Editando...");
    // const apiInstance = await Api.create();

    // Aqui deve ser implementada a chamada real para salvar o perfil
    // const response = await apiInstance.SalvarPerfil(formValues);

    // Simulando sucesso por enquanto, já que a API específica não foi fornecida
    // e o código original usava SalvarOnboarding com parâmetros fixos

    const apiInstance = await Api.create();

    const response = await apiInstance.SalvarOnboarding(formValues);

    if (!response?.is_error) {
      toast.success("Editado com Sucesso");

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

  return (
    <>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Nome Completo"
            name="full_name"
            value={formValues.full_name}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            disabled
            value={formValues.email}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email de Faturamento"
            name="billing_email"
            value={formValues.billing_email}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Telefone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              inputComponent: PhoneMaskCustom as any,
            }}
          />
        </Grid>
        <Grid container size xs={12} sm={6}>
          <TextField
            fullWidth
            label="Documento (CPF ou CNPJ)"
            name="personal_document"
            value={formValues.personal_document}
            onChange={handleChange}
            variant="outlined"
            disabled // Geralmente documentos não são editáveis livremente
          />
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Documento Profissional"
            name="professional_document"
            value={formValues.professional_document}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="role-label">Função</InputLabel>
            <Select
              labelId="role-label"
              label="Função"
              name="role"
              value={formValues.role || ""}
              onChange={handleChange as any}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="doctor">Medico</MenuItem>
              <MenuItem value="aministrator">Faturista</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Novo Escritório"
                value={newOffice}
                onChange={(e) => setNewOffice(e.target.value)}
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOffice();
                  }
                }}
              />
              <Button
                size="large"
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddOffice}
              >
                Adicionar
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {formValues.offices?.map((office, index) => (
                <Chip
                  key={index}
                  label={office}
                  onDelete={() => handleDeleteOffice(office)}
                />
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ padding: "10px", justifyContent: "flex-end" }}
      >
        <Button
          size="large"
          color="default"
          onClick={() => closeModal()}
          // startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => AcaoEditarPerfil()}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Confirmar Edição
        </Button>
      </Grid>
    </>
  );
};
