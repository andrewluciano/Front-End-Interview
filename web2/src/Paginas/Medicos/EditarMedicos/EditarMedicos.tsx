/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import { type FC, type FormEvent, useEffect, useState } from "react";
import { BotaoPadrao } from "@/Componentes/BotaoPadrao";

import { ExcluirMedicos } from "../ExcluirMedicos";

import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Api from "../API/Medicos";

import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import { PhoneMaskCustom } from "@/Componentes/MaskInput";

import LinearProgress from "@mui/material/LinearProgress";
import { GridCustom } from "./Styles";
import { useModal } from "@/Autenticacao/ModalContext";

export const EditarMedicos: FC = (props: any) => {
  const { openModal, closeModal } = useModal();

  const AbreModalExcluirMedico = (e) => {
    e.preventDefault();
    // setDadosSelecionados(dados);

    setTimeout(() => {
      const modalContent = (
        <ExcluirMedicos DadosSelecionados={props?.DadosSelecionados} />
      );
      const TituloModal = "Excluir Médico";
      const SubTituloModal = "Excluir dados do Médico";
      openModal(modalContent, TituloModal, SubTituloModal);
    }, 100);
  };
  const DadosMedico = useQuery(
    ["DadosMedico"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetMedicos(
        props?.DadosSelecionados?.identifier,
      );
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = DadosMedico?.isLoading;

  const hasContent = DadosMedico?.data?.content[0] ?? [];

  const queryClient = useQueryClient();

  const { mutate: AcaoEditarMedicos } = useMutation(async (dados: []) => {
    toast.loading("Alterando Dados do Médico...");
    const apiInstance = await Api.create();

    const response = await apiInstance.EditarMedico(
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

    console.log("JSON.stringify(formValues)", JSON.stringify(formValues));
    console.log("formValues", formValues);
    AcaoEditarMedicos(formValues);
  };

  const PaymentSkeleton = () => (
    <GridCustom container size={12} sx={{ height: "180" }}>
      <Box sx={{ width: "100%" }} className="Loading">
        <LinearProgress />
      </Box>
    </GridCustom>
  );

  const [formValues, setFormValues] = useState({
    full_name: hasContent?.full_name,
    email: hasContent?.email,
    crm: hasContent?.crm,
    crm_state: hasContent?.crm_state,
    phone: hasContent?.phone,
    speciality: hasContent?.speciality,
  });

  useEffect(() => {
    if (hasContent && Object.keys(hasContent).length > 0) {
      setFormValues(hasContent);
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
      {!isFetching && (
        <form onSubmit={(form) => Formulario(form)}>
          <Grid container size={{ xs: 12, md: 12 }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: "100ch" }}
              variant="standard"
            >
              <input type="hidden" value={hasContent?.identifier} />
              <input type="hidden" value={hasContent?.created_at} />
              <TextField
                required
                fullWidth
                name="full_name"
                label="Nome do Medicos"
                variant="outlined"
                value={formValues?.full_name || ""}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              fullWidth
              sx={{ m: 1, width: "100ch" }}
              variant="standard"
            >
              <TextField
                required
                fullWidth
                name="email"
                label="Email do Medicos"
                type="Pesquisar"
                value={formValues?.email || ""}
                onChange={handleChange}
              />
            </FormControl>

            <Grid container size={{ sm: 6, xs: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="crm"
                  label="CRM do Medicos"
                  variant="outlined"
                  value={formValues?.crm || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid container size={{ sm: 6, xs: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <input type="hidden" value={hasContent?.identifier} />
                <TextField
                  required
                  fullWidth
                  name="crm_state"
                  label="Estado do CRM"
                  variant="outlined"
                  value={formValues?.crm_state || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid container size={{ sm: 6, xs: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Telefone do Medico"
                  type="Pesquisar"
                  value={formValues?.phone || ""}
                  onChange={handleChange}
                  InputProps={{
                    inputComponent: PhoneMaskCustom,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid container size={{ sm: 6, xs: 12 }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: "49ch" }}
                variant="standard"
              >
                <TextField
                  required
                  fullWidth
                  name="speciality"
                  label="Especialidade do Medico"
                  type="Pesquisar"
                  value={formValues?.speciality || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ padding: "10px" }}>
            <BotaoPadrao
              size="large"
              titulo="Alterar Dados Medicos"
              variant="contained"
              type="submit"
              startIcon={<SaveIcon />}
            />
            <Button
              size="large"
              onClick={() => closeModal()}
              startIcon={<CloseIcon />}
            >
              Cancelar
            </Button>
            <Button
              size="large"
              color="error"
              onClick={(e) =>
                AbreModalExcluirMedico(e, props?.DadosSelecionados)
              }
              startIcon={<DeleteForeverIcon />}
            >
              Excluir Médico
            </Button>
          </Grid>
        </form>
      )}

      {isFetching && <PaymentSkeleton />}
    </>
  );
};
