import React from "react";
import { Typography, Grid, Box, Chip, Stack, Divider } from "@mui/material";

// 1. Definição do Tipo de Dados
interface ProcedimentoData {
  nomePaciente: string;
  dataNascimento: string; // Pode ser Date ou string no formato YYYY-MM-DD
  sexo: "M" | "F" | "Outro";
  particular: boolean;
  convenio?: string; // Opcional, só usado se particular for true
  plano?: string; // Opcional
  numeroCarteirinha?: string; // Opcional
  nomeProcedimento: string;
  dataHoraProcedimento: string; // Ex: "2025-10-10 14:30"
  hospital: string;
  hospitalEndereco: string;
  equipe: string;
  pago: boolean; // Usado para casos não-particulares
}

// 2. Componente de Exibição
interface InformacoesProcedimentoProps {
  data: ProcedimentoData;
}

const data = {
  nomePaciente: "Jose de Alencar",
  dataNascimento: "12/12/1976",
  sexo: "Masculino",
  particular: false,
  convenio: "Unimed",
  plano: "Plano Empresarial 2211",
  numeroCarteirinha: "112211224311223122",
  nomeProcedimento: "Refrativa a Laser LASIK",
  dataHoraProcedimento: new Date().toLocaleString(),
  hospital: "Hospital Edmundo Vasconcelos",
  hospitalEndereco:
    "R. Borges Lagoa, 1450 - Vila Clementino, São Paulo - SP, 04038-905",
  equipe: "Equipe Hospitalar",
  pago: "",
};

export const InfoProcedimentos: React.FC<InformacoesProcedimentoProps> = () => {
  // Função auxiliar para formatar Label e Valor
  const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: "uppercase" }}
      >
        {label}:
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ ml: 1, wordBreak: "break-word" }}
        fontWeight={"bold"}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 1.2 }}>
      <Grid
        container
        size={{ sm: 12, md: 12, xs: 12 }}
        spacing={3}
        flexDirection={"column"}
      >
        {/* --- Informações do Procedimento --- */}
        <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ sm: 12 }}>
            <Typography variant="h6" gutterBottom>
              Procedimento
            </Typography>
          </Grid>
          <Grid container size={{ xs: 12, sm: 6, md: 6 }}>
            <InfoItem label="Nome" value={data.nomeProcedimento} />
          </Grid>
          <Grid container size={{ xs: 12, sm: 6, md: 6 }}>
            <InfoItem label="Data e Hora" value={data.dataHoraProcedimento} />
          </Grid>
          <Grid container size={{ xs: 12, sm: 6, md: 6 }}>
            <InfoItem
              label="Hospital"
              value={
                <>
                  {data.hospital}
                  <br />
                  {data.hospitalEndereco}
                </>
              }
            />
          </Grid>
          <Grid container size={{ xs: 12, sm: 6, md: 6 }}>
            <InfoItem label="Equipe" value={data.equipe} />
          </Grid>
        </Grid>

        <Divider />

        {/* --- Informações do Paciente --- */}
        <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ sm: 12 }}>
            <Typography variant="h6" gutterBottom>
              Paciente
            </Typography>
          </Grid>
          <Grid container size={{ xs: 12, sm: 4, md: 4 }}>
            <InfoItem label="Nome" value={data.nomePaciente} />
          </Grid>
          <Grid container size={{ xs: 12, sm: 4, md: 4 }}>
            <InfoItem label="Data Nasc." value={data.dataNascimento} />
          </Grid>
          <Grid container size={{ xs: 12, sm: 4, md: 4 }}>
            <InfoItem label="Sexo" value={data.sexo} />
          </Grid>
        </Grid>

        <Divider />

        {/* --- Informações de Pagamento/Convênio --- */}
        <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid size={{ sm: 12 }}>
              <Typography variant="h6" gutterBottom>
                Pagamento
              </Typography>
            </Grid>
            <Grid
              container
              size={{ xs: 12, sm: 4, md: 4 }}
              sx={{ display: "none" }}
            >
              <InfoItem
                label="Tipo"
                value={
                  <Chip
                    label={data.particular ? "Particular" : "Convênio/Público"}
                    color={data.particular ? "primary" : "default"}
                    variant="outlined"
                  />
                }
              />
            </Grid>
            {data.particular ? (
              // Se Particular for TRUE, mostra o status de pagamento
              <Grid container size={{ xs: 12, sm: 4, md: 4 }}>
                <InfoItem
                  label="Status Pagamento"
                  value={
                    <Chip
                      label={data.pago ? "PAGO" : "PENDENTE"}
                      color={data.pago ? "success" : "error"}
                      size="small"
                    />
                  }
                />
              </Grid>
            ) : (
              // Se NÃO for particular, mostra detalhes do convênio
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Grid container>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <InfoItem label="Convênio" value={data.convenio || "N/A"} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <InfoItem label="Plano" value={data.plano || "N/A"} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <InfoItem
                      label="Nº Carteirinha"
                      value={data.numeroCarteirinha || "N/A"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <InfoItem
                      label="Status Pagamento"
                      value={
                        <Chip
                          label={
                            data.pago
                              ? "COBERTO / PAGO"
                              : "A PAGAR PELO CONVÊNIO"
                          }
                          color={data.pago ? "success" : "warning"}
                          size="small"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

// 3. Exemplo de Uso (no seu App.tsx ou componente pai)

/*
const dadosExemploParticular: ProcedimentoData = {
  nomePaciente: 'Maria da Silva Sauro',
  dataNascimento: '1985-05-20',
  sexo: 'F',
  particular: true,
  nomeProcedimento: 'Ressonância Magnética do Crânio',
  dataHoraProcedimento: '2025-11-05 09:00',
  hospital: 'Hospital Central - Unidade A',
  pago: true,
};

const dadosExemploConvenio: ProcedimentoData = {
    nomePaciente: 'João Carlos Pereira',
    dataNascimento: '1992-08-15',
    sexo: 'M',
    particular: false,
    convenio: 'Saúde Mais',
    plano: 'Executivo',
    numeroCarteirinha: '1234567890',
    nomeProcedimento: 'Consulta Cardiológica de Rotina',
    dataHoraProcedimento: '2025-10-15 11:30',
    hospital: 'Clínica Bem Estar',
    pago: false,
  };


function App() {
  return (
    <div style={{ padding: '20px' }}>
      <InformacoesProcedimento data={dadosExemploConvenio} />

      <hr style={{ margin: '40px 0'}}/>

      <InformacoesProcedimento data={dadosExemploParticular} />
    </div>
  );
}
*/
