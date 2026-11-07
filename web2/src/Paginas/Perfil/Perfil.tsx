/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { type FC, useRef, useState } from "react";

import { Container } from "./Styles";
import { setItem } from "@/helpers/armazenamento";

import { useQuery } from "react-query";
import Api from "./API/Perfil";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Box,
  Stack,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, CalendarToday, TrendingDown } from "@mui/icons-material";
import { Titulos } from "@/Componentes/Titulos";
import { formatPhone } from "@/helpers/format/Masks";

import { useModal } from "@/Autenticacao/ModalContext";

import { EditarPerfil } from "./EditarPerfil";
import { AlterarSenha } from "./AlterarSenha";
import { ResetGeral } from "./ResetGeral";
import { Creditos } from "./Componentes/Creditos";


// Histórico mockado de gastos
const historicoGastos = [
  // { data: "2024-03-10", creditos: 25 },
];

export const Perfil: FC = () => {
  const { openModal } = useModal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ListaPerfil = useQuery(
    ["dadosListaPerfil"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetPerfil();
      setItem("dados_users", JSON.stringify(response));
      return response;
    },
    { keepPreviousData: true, staleTime: Infinity },
  );

  const isFetching = ListaPerfil?.isLoading;
  const hasContent = ListaPerfil.data ?? [];

  const PaymentSkeleton = () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );

  const handleOpenEditar = (arquivo: ArquivoData) => {
    openModal(
      <EditarPerfil DadosSelecionados={arquivo} />,
      "Editar Perfil",
      "Confirme as alterações",
    );
  };
  const handleOpenAlterarSenha = (arquivo: ArquivoData) => {
    openModal(
      <AlterarSenha DadosSelecionados={arquivo} />,
      "Alterar Senha",
      "Confirme as alterações",
      "500px",
    );
  };
  const handleOpenResetGeral = (arquivo: ArquivoData) => {
    const alturaModal = isMobile ? "420px" : "350px";
    openModal(
      <ResetGeral DadosSelecionados={arquivo} />,
      "Resetar Plataforma",
      "Confirme as alterações",
      "500px",
      alturaModal,
    );
  };

  return (
    <Container container size={{ sm: 12, xs: 12 }}>
      <Titulos titulo="Perfil" icone={undefined} />

      {isFetching && <PaymentSkeleton />}

      {isFetching && (
        <Grid
          container
          spacing={2}
          size={{ sm: 12, xs: 12 }}
          sx={{
            backgroundColor: "background.paper",
            mt: "20px",
            boxShadow: "1",
            p: "20px",
            borderRadius: "5px",
          }}
        >
          <Grid container size={{ sm: 12 }}>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Id</Typography>
              <Typography>{hasContent?.id}</Typography>
            </Grid>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Email</Typography>
              <Typography>{hasContent?.email}</Typography>
            </Grid>
          </Grid>
          <Grid container size={{ sm: 12 }}>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Nome Completo</Typography>
              <Typography>
                {hasContent?.full_name || "Sem nome Cadastrado"}
              </Typography>
            </Grid>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Regra</Typography>
              <Typography>
                {hasContent?.role || "Sem Regra Cadastrada"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container size={{ sm: 12 }}>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Telefone</Typography>
              <Typography>{formatPhone(hasContent?.phone)}</Typography>
            </Grid>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Documento</Typography>
              <Typography>
                {hasContent?.personal_document || "Não informado"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container size={{ sm: 12 }}>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">CRM</Typography>
              <Typography>
                {hasContent?.professional_document || "Não informado"}
              </Typography>
            </Grid>
            <Grid size={{ sm: 6 }}>
              <Typography variant="h6">Email Faturamento</Typography>
              <Typography>
                {hasContent?.billing_email || "Não informado"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container size={{ sm: 12 }}>
            <Grid size={{ sm: 12 }}>
              <Typography variant="h6">Clínicas</Typography>
              <Typography>
                {hasContent?.offices?.length
                  ? hasContent.offices.join(", ")
                  : "Nenhuma clínica"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}

      {!isFetching && (
        <Stack spacing={3} sx={{ pt: 1 }} width="100%">
          <Card>
            <CardHeader
              title={
                <Typography variant="h5" component="h2" gutterBottom>
                  Perfil do Usuário
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Informações da sua conta
                </Typography>
              }
            />
            <CardContent>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                gap={3}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Nome Completo
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {hasContent.full_name || "Sem nome Cadastrado"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {hasContent.email || "Sem email Cadastrado"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    ID do Usuário
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {hasContent.id || "Sem ID Cadastrado"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Regra
                  </Typography>
                  <Chip
                    label={hasContent.role || "Sem Regra Cadastrada"}
                    color="primary"
                  />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Telefone
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatPhone(hasContent.phone)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Documento
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {hasContent.personal_document || "Não informado"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    CRM
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {hasContent.professional_document || "Não informado"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Email Faturamento
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {hasContent.billing_email || "Não informado"}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: { md: "span 2" } }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Clínicas
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {hasContent.offices?.length > 0 ? (
                      hasContent.offices.map((office, index) => (
                        <Chip key={index} label={office} variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="body1" fontWeight={600}>
                        Nenhuma clínica
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Grid container>
                  <Grid container size={{ sm: 12 }} spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenEditar(hasContent)}
                    >
                      Editar Perfil
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenAlterarSenha(hasContent)}
                    >
                      Alterar Senha
                    </Button>
                    <Button
                      onClick={() => handleOpenResetGeral(hasContent)}
                      sx={{ color: "#f44336" }}
                    >
                      Resetar plataforma
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Card de Créditos */}
          <Creditos />

          {/* Card de Histórico de Gastos */}
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingDown color="warning" />
                  <Typography variant="h5" component="h2">
                    Histórico de Gastos
                  </Typography>
                </Box>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Consumo de créditos por dia
                </Typography>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                {historicoGastos.map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                    sx={{
                      bgcolor: "action.hover",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "action.selected",
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "primary.light",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TrendingDown color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {new Date(item.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Consumo diário
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h5" color="error" fontWeight="bold">
                        -{item.creditos}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        créditos
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Grid container size={{ xs: 12, sm: 12 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.5rem",
                color: "#999",
                textTransform: "uppercase",
              }}
            >
              versão frontend v {import.meta.env.VITE_VERSION}
            </Typography>
          </Grid>
        </Stack>
      )}
    </Container>
  );
};
