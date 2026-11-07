import React, { type FC, useMemo, useCallback, useState } from "react";
import { CutText } from "@/Componentes/CutText";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { dateTime, currency } from "@/helpers/format";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import EditIcon from "@mui/icons-material/Edit";

import { BlocoItem, Label, H2, GridCustom } from "./Styles";

import { ExcluirConsulta } from "../../ExcluirConsulta";
import { useModal } from "@/Autenticacao/ModalContext";

interface ProcedimentoItem {
  identifier: string;
  nome_paciente?: string | null;
  cpf_rg?: string | null;
  r_nascido?: string | null;
  numero_carteira?: string | null;
  data_nascimento?: Date | string | null;
  idade?: string | null;
  contato?: string | null;
  convenio?: string | null;
  unidade?: string | null;
  local?: string | null;
  tipo_encontro?: string | null;
  data_consulta?: Date | string | null;
  medico?: string | null;
  medico_encaminhador?: string | null;
  valor_receber?: number | string | null;
  valor_recebido?: number | string | null;
  StatusProcedimento?: string | null;
}

interface BlocoProps {
  dados: {
    TipoEncontro?: string | null;
    procedimentos: ProcedimentoItem[];
  };
  handleAbreModalConsulta: (
    e: React.MouseEvent<HTMLButtonElement>,
    identifier: string,
  ) => void;
}

export const BlocoConsultas: FC<BlocoProps> = ({
  dados,
  handleAbreModalConsulta,
}) => {
  console.log(dados);
  const { openModal } = useModal();
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const procedimentosFiltrados = useMemo(() => {
    if (!termoPesquisa) return dados?.procedimentos || [];
    const termo = termoPesquisa.toLowerCase();
    return (dados?.procedimentos || []).filter((p) => {
      return (
        p.nome_paciente?.toLowerCase().includes(termo) ||
        p.medico?.toLowerCase().includes(termo) ||
        p.convenio?.toLowerCase().includes(termo) ||
        p.unidade?.toLowerCase().includes(termo)
      );
    });
  }, [dados?.procedimentos, termoPesquisa]);

  const estagioLabel = useMemo(
    () => dados?.TipoEncontro || "Estágio Desconhecido",
    [dados?.TipoEncontro],
  );

  const onEditar = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, identifier: string) => {
      handleAbreModalConsulta(e, identifier);
    },
    [handleAbreModalConsulta],
  );

  const onExcluir = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, item: ProcedimentoItem) => {
      e.preventDefault();
      const modalContent = <ExcluirConsulta DadosSelecionados={item} />;
      openModal(modalContent, "Excluir Consulta", "Excluir dados da consulta");
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
      function RetornoIdade(idade: Date | string): React.ReactNode {
        if (!idade) return null;

        const nascimento = new Date(idade);
        if (isNaN(nascimento.getTime())) return null;

        const hoje = new Date();

        let anos = hoje.getFullYear() - nascimento.getFullYear();
        const jaFezAniversarioEsteAno =
          hoje.getMonth() > nascimento.getMonth() ||
          (hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() >= nascimento.getDate());
        if (!jaFezAniversarioEsteAno) anos--;

        let diffMeses = hoje.getMonth() - nascimento.getMonth();
        if (hoje.getDate() < nascimento.getDate()) diffMeses--;
        const meses = ((diffMeses % 12) + 12) % 12;

        let dias: number;
        if (hoje.getDate() >= nascimento.getDate()) {
          dias = hoje.getDate() - nascimento.getDate();
        } else {
          const diasMesAnterior = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            0,
          ).getDate();
          dias = hoje.getDate() + diasMesAnterior - nascimento.getDate();
        }

        return (
          <span>
            {" "}
            - {anos} anos {meses} meses {dias} dias
          </span>
        );
      }

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
              <Grid
                container
                alignItems={"center"}
                justifyContent={"flex-end"}
                size={{ xs: 12, md: 12 }}
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
                <Label htmlFor="">
                  Paciente{" "}
                  {item?.data_nascimento
                    ? RetornoIdade(item?.data_nascimento)
                    : "sem Data de Nascimento"}
                </Label>
                <H2>
                  <CutText
                    value={item?.nome_paciente || "Sem Nome Cadastrado"}
                    props={[]}
                    contagem={24}
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
                        value={item?.tipo_encontro || "Sem Nome Cadastrado"}
                        contagem={22}
                      />
                    </strong>
                  </Typography>
                  <Typography variant="caption">
                    {item?.data_consulta
                      ? new Date(item?.data_consulta).toLocaleString("pt-BR")
                      : "sem Data de consulta"}
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
                      value={item?.medico || "Médico Não Identificado"}
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
                    <strong>Local</strong>
                  </Label>
                  <Typography variant="caption">
                    <CutText
                      value={item?.unidade || "Local Não Identificado"}
                      contagem={27}
                      props={[]}
                      position={undefined}
                      cont={0}
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
                      value={item?.convenio || "Convênio Não Identificado"}
                      contagem={27}
                      props={[]}
                      position={undefined}
                      cont={0}
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
                    <strong>Valor a Receber</strong>
                  </Label>
                  <Typography variant="caption">
                    <CutText
                      value={
                        currency(item?.valor_receber || 0) ||
                        "Valor Não Identificado"
                      }
                      contagem={27}
                      props={[]}
                      position={undefined}
                      cont={0}
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
                    <strong>Valor Recebido</strong>
                  </Label>
                  <Typography variant="caption">
                    <CutText
                      value={
                        currency(item?.valor_recebido || 0) ||
                        "Valor Não Identificado"
                      }
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
                startIcon={<EditIcon fontSize="inherit" />}
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
        minWidth: "100%",
        maxWidth: "100%",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Pesquisar..."
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          style: { backgroundColor: "#fff" },
        }}
        sx={{ mb: 1 }}
      />
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
        {procedimentosFiltrados.map((itemP: ProcedimentoItem) => (
          <ProcedimentoRow
            item={itemP}
            onEditar={onEditar}
            onExcluir={onExcluir}
          />
        ))}
      </GridCustom>
    </Grid>
  );
};
