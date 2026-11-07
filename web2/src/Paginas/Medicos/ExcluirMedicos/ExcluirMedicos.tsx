/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Grid, Typography } from "@mui/material";
import { type FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Api from "../API/AdicionarMedico";
import { useModal } from "@/Autenticacao/ModalContext";

export const ExcluirMedicos: FC = (props: any) => {
  const { closeModal } = useModal();

  const queryClient = useQueryClient();

  const { mutate: AcaoExcluirMedicos } = useMutation(async () => {
    toast.loading("Removendo Médico...");
    const apiInstance = await Api.create();

    const response = await apiInstance.RemoveMedicos(
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
          Você deseja realmente excluir o Médico -{" "}
          <strong>{props?.DadosSelecionados?.full_name}</strong>
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Button
          onClick={() => AcaoExcluirMedicos()}
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
