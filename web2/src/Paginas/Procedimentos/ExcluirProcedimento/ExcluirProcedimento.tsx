/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Grid, Typography } from "@mui/material";
import { type FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useMutation, useQueryClient } from "react-query";
import Api from "../API/Procedimentos";
import toast from "react-hot-toast";

import { useModal } from "@/Autenticacao/ModalContext";

export const ExcluirProcedimento: FC = (props: any) => {
  const { closeModal } = useModal();

  const queryClient = useQueryClient();

  const { mutate: AcaoExcluirProcedimento } = useMutation(async () => {
    toast.loading("Excluindo...");
    const apiInstance = await Api.create();

    const response = await apiInstance.RemoveProcedimentos(
      props?.DadosSelecionados?.identifier,
    );

    if (!response?.is_error) {
      toast.dismiss();

      toast.success("Excluido com Sucesso");
      queryClient.invalidateQueries();

      queryClient.invalidateQueries({
        queryKey: ["ListaProcedimentosDashboard"],
      });

      setTimeout(() => {
        toast.dismiss();
        closeModal();
      }, 500);
    } else {
      setTimeout(async () => {
        closeModal();
        queryClient.invalidateQueries();
        queryClient.invalidateQueries({
          queryKey: ["ListaProcedimentosDashboard"],
        });
      }, 500);
      toast.dismiss();
    }

    return response;
  });

  return (
    <>
      <Grid container size={{ xs: 12 }} sx={{ padding: "10px", gap: "10px" }}>
        <Grid size={{ sm: 12 }}>
          <Typography>
            Você deseja realmente excluir o Procedimento -{" "}
            <strong>
              {props?.DadosSelecionados?.Procedimento || "Sem Dados"}
            </strong>
          </Typography>
        </Grid>
        <Grid size={{ sm: 12 }}>
          <Typography>
            Paciente -{" "}
            <strong>{props?.DadosSelecionados?.Paciente || "Sem Dados"}</strong>
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Button
          onClick={() => AcaoExcluirProcedimento()}
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
