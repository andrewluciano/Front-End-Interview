/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC } from "react";
import { useQuery } from "react-query";
import Api from "../API/Destaques";

import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";

import AddIcon from "@mui/icons-material/Add";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Container, GridCustom } from "./Styles";
import { Button } from "@mui/material";
import { CardsProcedimentos } from "../Componentes/CardsProcedimentos";
// import { BarraProgresso } from "@/Componentes/BarraProgresso";

export const Destaques: FC = () => {
  const dadosDestaquesHome = useQuery(
    ["listaDestaquesHome"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetDestaques();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = dadosDestaquesHome?.isLoading;
  const hasContent = dadosDestaquesHome?.data?.content ?? [];

  // const ProcedimentosDashboard = useQuery(
  //   ["ProcedimentosDashboard"],
  //   async () => {
  //       const apiInstance = await Api.create();

  // const response = await apiInstance.GetProcedimentosDashboard();
  //     return response;
  //   },
  //   { keepPreviousData: true },
  // );

  // const isFetchingProcedimentosDashboard = ProcedimentosDashboard?.isLoading;
  // const hasContentProcedimentosDashboard = ProcedimentosDashboard?.data ?? [];

  const MedicosDashboard = useQuery(
    ["MedicosDashboard"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetMedicosDashboard();
      return response;
    },
    { keepPreviousData: true },
  );
  const PacientesDashboard = useQuery(
    ["PacientesDashboard"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetPacientesDashboard();
      return response;
    },
    { keepPreviousData: true },
  );

  const PaymentSkeleton = () => (
    <Grid container size={12} sx={{ height: "80" }}>
      <Grid size={3} className="Loading">
        <LinearProgress />
      </Grid>
      <Grid size={3} className="Loading">
        <LinearProgress />
      </Grid>
      <Grid size={3} className="Loading">
        <LinearProgress />
      </Grid>
      <Grid size={3} className="Loading">
        <LinearProgress />
      </Grid>
    </Grid>
  );

  return (
    <>
      <GridCustom sx={{ gap: "10px" }} container size={{ sm: 12 }}>
        <Typography variant="h6" sx={{ padding: "10px 0 0 0" }}>
          Procedimentos
        </Typography>

        <Grid
          container
          sx={{ flexGrow: 1, width: "100%", gap: "10px", display: "none" }}
          size={{ sm: 12, xs: 12 }}
        >
          <CardsProcedimentos title="Solicitadas" value={6} />
          <CardsProcedimentos title="Autorizadas" value={6} />
          <CardsProcedimentos title="Pendentes" value={6} />
          <CardsProcedimentos title="Agendadas" value={6} />
        </Grid>

        <Grid
          container
          sx={{ flexGrow: 1, width: "100%", gap: "10px" }}
          size={{ sm: 12, xs: 12 }}
        >
          <Grid
            className="aaa"
            container
            size={{ sm: 5, xs: 0 }}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Grid
              padding={1.5}
              size={{ sm: 6.5, xs: 12 }}
              sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Typography variant="h6" component="h6">
                Novo Procedimento
              </Typography>
              <Typography variant="caption" component="p">
                Você pode adicionar um procedimento, utilizando nossa IA ou
                manualmente
              </Typography>
            </Grid>
            <Grid
              size={{ sm: 5.5 }}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1rem",
                textAlign: "center",
              }}
            >
              {/* <img src={DestaqueUpload} width="90px" alt="" /> */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="procedimentos?AdicionaProcedimentoVivIA=true"
              >
                Novo Procedimento
              </Button>
              <br />
              <Typography
                component={"a"}
                href="procedimentos?AdicionaProcedimento=true"
                variant="caption"
              >
                Subir Procedimento Manualmente
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            sx={{ flexDirection: "row" }}
            size={{ sm: 3.39, xs: 5.82 }}
            className="aaa"
          >
            <Grid
              size={{ sm: 6.5, xs: 12 }}
              sx={{
                alignItems: "flex-start",
                justifyContent: "center",
                lineHeight: "1rem",
                padding: "0 10px 0 10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="caption" component="h3">
                Pacientes Cadastrados
              </Typography>
              <Typography variant="h4" component="h2">
                <strong>{PacientesDashboard?.data?.content[0].value}</strong>
              </Typography>
            </Grid>
            <Grid
              size={{ sm: 5.5, xs: 0 }}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1rem",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="pacientes?NovoPaciente"
                sx={{ fontSize: "0.7rem" }}
              >
                Novo Paciente
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            sx={{ flexDirection: "row" }}
            size={{ sm: 3.39, xs: 5.82 }}
            className="aaa"
          >
            <Grid
              size={{ sm: 7, xs: 12 }}
              sx={{
                alignItems: "flex-start",
                justifyContent: "center",
                lineHeight: "1rem",
                padding: "0 10px 0 10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="caption" component="h3">
                Médicos Cadastrados
              </Typography>
              <Typography variant="h4" component="h2">
                <strong>{MedicosDashboard?.data?.content[0].value}</strong>
              </Typography>
            </Grid>
            <Grid
              size={{ sm: 5, xs: 0 }}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1rem",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="medicos?NovoMedico"
                sx={{ fontSize: "0.7rem" }}
              >
                Novo Médico
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </GridCustom>

      <Typography variant="h6" sx={{ width: "100%", padding: "10px 0 0 0" }}>
        Status
      </Typography>
      <Container
        sx={{ width: "100%", overflowX: "auto" }}
        size={{ xs: 12, sm: 12 }}
      >
        <Grid
          container
          sx={{
            overflowX: "auto",
            flexDirection: "row",
            flexGrow: 1,
            flexWrap: "nowrap",
          }}
        >
          {isFetching && <PaymentSkeleton />}
          {!isFetching && (
            <>
              {hasContent.length > 0 &&
                hasContent?.map((item: any) => {
                  if (item?.type === "Status")
                    // {hasContent.length > 0 && hasContent?.map(([key, valor]: any) => {
                    return (
                      <Card className="BlocoDestaque">
                        <CardContent>
                          <Typography variant="h3" component="h3">
                            {item.label === "Total de Requisições"
                              ? "Requisições"
                              : item.label}
                          </Typography>
                          <Typography variant="h2" component="h2">
                            {item.value}
                          </Typography>
                          {/* <p>últimos 7 dias</p> */}
                        </CardContent>
                      </Card>
                    );
                })}

              {hasContent.length === 0 && (
                <Card className="BlocoDestaque" sx={{ padding: "10px" }}>
                  <Typography variant="h2" component="h2">
                    sem valor
                  </Typography>
                </Card>
              )}
            </>
          )}
        </Grid>
      </Container>

      <Typography variant="h6" sx={{ padding: "10px 0 0 0" }}>
        Estágios
      </Typography>

      <Container
        sx={{ width: "100%", overflowX: "auto" }}
        size={{ xs: 12, sm: 12 }}
      >
        <Grid
          container
          sx={{
            overflowX: "auto",
            flexDirection: "row",
            flexGrow: 1,
            flexWrap: "nowrap",
          }}
        >
          {isFetching && <PaymentSkeleton />}
          {!isFetching && (
            <>
              {hasContent.length > 0 &&
                hasContent?.map((item: any) => {
                  if (item?.type === "Estágio")
                    // {hasContent.length > 0 && hasContent?.map(([key, valor]: any) => {
                    return (
                      <Card className="BlocoDestaque Estagios">
                        <CardContent>
                          <Typography variant="h3" component="h3">
                            {item.label}
                          </Typography>
                          <Typography variant="h2" component="h2">
                            {item.value}
                          </Typography>
                          {/* <p>últimos 7 dias</p> */}
                        </CardContent>
                      </Card>
                    );
                })}

              {hasContent.length === 0 && (
                <Card className="BlocoDestaque" sx={{ padding: "10px" }}>
                  <Typography variant="h2" component="h2">
                    sem valor
                  </Typography>
                </Card>
              )}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};
// function fechaModais(): void {
//   throw new Error("Function not implemented.");
// }
