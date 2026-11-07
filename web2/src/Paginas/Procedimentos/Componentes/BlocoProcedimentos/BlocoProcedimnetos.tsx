import React, { type FC, useMemo, useCallback } from "react";
import { CutText } from "@/Componentes/CutText";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { dateSimple } from "@/helpers/format";
import DeleteIcon from "@mui/icons-material/Delete";

import { BlocoItem, Label, H2, GridCustom } from "./Styles";

import { ExcluirProcedimento } from "../../ExcluirProcedimento";
import { useModal } from "@/Autenticacao/ModalContext";

interface ProcedimentoItem {
  Convenio: string;
  identifier: string;
  DataProcedimento: string | Date | null;
  StatusProcedimento?: string | null;
  Paciente?: string | null;
  Procedimento?: string | null;
  Medico?: string | null;
}

interface BlocoProps {
  dados: {
    Estagio?: string | null;
    procedimentos: ProcedimentoItem[];
  };
  handleAbreModalProcedimento: (
    e: React.MouseEvent<HTMLButtonElement>,
    identifier: string,
  ) => void;
}

export const BlocoProcedimnetos: FC<BlocoProps> = ({
  dados,
  handleAbreModalProcedimento,
}) => {
  const { openModal } = useModal();

  const estagioLabel = useMemo(
    () => dados?.Estagio?.replace("Aguardando ", "") || "Estágio Desconhecido",
    [dados?.Estagio],
  );

  const onEditar = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, identifier: string) => {
      handleAbreModalProcedimento(e, identifier);
    },
    [handleAbreModalProcedimento],
  );

  const onExcluir = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, item: ProcedimentoItem) => {
      e.preventDefault();
      const modalContent = <ExcluirProcedimento DadosSelecionados={item} />;
      openModal(
        modalContent,
        "Excluir Procedimento",
        "Excluir dados do procedimento",
      );
    },
    [openModal],
  );

  const ProcedimentoRow = React.memo(
    ({
      item,
      onEditar,
      onExcluir,
    }: {
      item: ProcedimentoItem;
      onEditar: (
        e: React.MouseEvent<HTMLButtonElement>,
        identifier: string,
      ) => void;
      onExcluir: (
        e: React.MouseEvent<HTMLButtonElement>,
        item: ProcedimentoItem,
      ) => void;
    }) => {
      return (
        <Grid className="ItemOperacao" container>
          <BlocoItem
            size={{ xs: 12, sm: 12 }}
            direction="row"
            className="BlocoItem"
          >
            <BlocoItem
              container
              alignItems={"flex-start"}
              size={{ xs: 12, md: 12 }}
              sx={{ padding: "5px 0px" }}
              direction="row"
              gap="10px"
            >
              <Grid size={{ xs: 3.5, md: 3.5 }}>
                <Typography variant="caption">
                  {dateSimple(item?.DataProcedimento)}
                </Typography>
              </Grid>
              <Grid
                container
                alignItems={"center"}
                justifyContent={"flex-end"}
                size={{ xs: 7.4, md: 7.4 }}
                sx={{ textAlign: "right", gap: "5px" }}
              >
                <Chip
                  sx={{ fontSize: "0.7rem", p: 0, height: "20px" }}
                  label={item?.StatusProcedimento || "Status Desconhecido"}
                  color={
                    item?.StatusProcedimento === "Pendente"
                      ? "warning"
                      : "default"
                  }
                />
              </Grid>
            </BlocoItem>
            <BlocoItem
              container
              alignItems={"flex-start"}
              size={{ xs: 12, md: 12 }}
              sx={{ padding: "5px 10px" }}
              direction="column"
              gap="10px"
            >
              <Grid size={{ xs: 12, md: 12 }}>
                <Label htmlFor="">Paciente</Label>
                <H2>
                  <CutText
                    value={item?.Paciente || "Sem Nome Cadastrado"}
                    props={[]}
                    contagem={20}
                    position={undefined}
                    cont={0}
                  />
                </H2>
              </Grid>
            </BlocoItem>
            <BlocoItem
              container
              alignItems="flex-start"
              size={{ xs: 12, md: 12 }}
              sx={{ padding: "5px 10px" }}
              direction="column"
              gap="10px"
            >
              <Grid
                container
                direction={"column"}
                sx={{ gap: "10px" }}
                size={{ xs: 12, md: 12 }}
              >
                <Grid
                  container
                  size={{ xs: 12, md: 12 }}
                  flexDirection={"column"}
                >
                  <Label>Procedimento</Label>
                  <Typography
                    variant="subtitle1"
                    sx={{ textTransform: "capitalize !important" }}
                  >
                    <strong>
                      <CutText
                        value={item?.Procedimento || "Sem Nome Cadastrado"}
                        contagem={22}
                      />
                    </strong>
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={{ xs: 12, md: 12 }}
                  flexDirection={"row"}
                  alignItems={"center"}
                  sx={{ gap: "5px" }}
                >
                  <Label>
                    <strong>Médico</strong>
                  </Label>
                  <Typography variant="caption">
                    <CutText
                      value={item?.Medico || "Médico Não Identificado"}
                      contagem={27}
                    />
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={{ xs: 12, md: 12 }}
                  flexDirection={"row"}
                  alignItems={"center"}
                  sx={{ gap: "5px" }}
                >
                  <Label>
                    <strong>Convênio</strong>
                  </Label>
                  <Typography variant="caption">
                    <CutText
                      value={item?.Convenio || "Convênio Não Identificado"}
                      contagem={27}
                      props={[]}
                      position={undefined}
                      cont={0}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </BlocoItem>
          </BlocoItem>
          <BlocoItem
            container
            size={{ xs: 12, md: 12 }}
            sx={{ padding: "5px 10px", gap: "5px" }}
            flexDirection="row"
          >
            <Grid
              container
              size={{ xs: 5.85, md: 5.85 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  fontWeight: "200",
                  fontSize: "0.8rem",
                  width: "100%",
                }}
                onClick={(e) => onEditar(e, item?.identifier)}
              >
                Editar
              </Button>
            </Grid>
            <Grid container size={{ xs: 5.85, md: 5.85 }}>
              <Button
                startIcon={<DeleteIcon fontSize="inherit" />}
                size="small"
                color="error"
                sx={{
                  fontWeight: "400",
                  fontSize: "0.8rem",
                  width: "100%",
                }}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  onExcluir(e, item)
                }
              >
                Excluir
              </Button>
            </Grid>
          </BlocoItem>
        </Grid>
      );
    },
  );

  return (
    <Grid
      container
      size={{ sm: 12, xs: 12 }}
      spacing={1}
      sx={{
        flexDirection: "column",
        flexWrap: "nowrap",
        minWidth: "280px",
        maxWidth: "280px",
      }}
    >
      <Card>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "0px",
            height: "100%",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            sx={{ margin: "0" }}
          >
            <CutText
              value={estagioLabel}
              props={[]}
              contagem={25}
              position={undefined}
              cont={0}
            />
          </Typography>
        </CardContent>
      </Card>
      <GridCustom container>
        {dados?.procedimentos.map((itemP: ProcedimentoItem) => (
          <ProcedimentoRow
            key={itemP.identifier}
            item={itemP}
            onEditar={onEditar}
            onExcluir={onExcluir}
          />
        ))}
      </GridCustom>
    </Grid>
  );
};
