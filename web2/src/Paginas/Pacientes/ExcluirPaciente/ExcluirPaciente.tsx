/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Grid, Typography } from "@mui/material";
import { type FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useMutation, useQueryClient } from "react-query";
import Api from "../API/Pacientes";
import toast from "react-hot-toast";

import { useModal } from "@/Autenticacao/ModalContext";

export const ExcluirPaciente: FC = (props: any) => {
  const { closeModal } = useModal();

  const queryClient = useQueryClient();
  // const AcaoExcluirPaciente = () => {
  //   axios
  //     .delete(`${baseURL}/patients/${props?.DadosSelecionados?.identifier}`)
  //     .then(function (response) {
  //       if (response?.status === 200) {
  //         toast.dismiss(ToastLoading);
  //         toast.success("Paciente Excluido com Sucesso!");
  //         setTimeout(() => {
  //           closeModal()
  //           queryClient.invalidateQueries();
  //           queryClient.refetchQueries();
  //         }, 500);

  //         // toast.dismiss(ToastLoading);
  //       } else {
  //         setTimeout(() => {
  //           closeModal()
  //         }, 500);
  //         toast.dismiss(ToastLoading);
  //         toast.error(response?.status);
  //         queryClient.invalidateQueries();
  //         toast.dismiss(ToastLoading);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.error("Error:", error); // Handle any errors
  //     });
  // };

  const { mutate: AcaoExcluirPaciente } = useMutation(async () => {
    toast.loading("Excluindo...");
    const apiInstance = await Api.create();

    const response = await apiInstance.RemovePacientes(
      props?.DadosSelecionados?.identifier,
    );

    if (!response?.is_error) {
      toast.success("Excluido com Sucesso");

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
      <Grid container size={{ xs: 12 }} sx={{ padding: "10px" }}>
        <Typography>
          Você deseja realmente excluir o Paciente -{" "}
          <strong>{props?.DadosSelecionados?.full_name}</strong>
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Button
          onClick={() => AcaoExcluirPaciente()}
          variant="contained"
          startIcon={<DeleteForeverIcon />}
        >
          Confirmar Exclusão
        </Button>
        <Button
          size="large"
          onClick={() => closeModal()}
          startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
      </Grid>
    </>
  );
};
