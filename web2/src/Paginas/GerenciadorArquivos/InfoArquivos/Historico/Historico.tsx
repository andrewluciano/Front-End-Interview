import { FC, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  Chip,
} from "@mui/material";
import { dateTime } from "@/helpers/format";

import { useQuery } from "react-query";
import Api from "../../API/GestaoArquivos";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ArquivoData {
  id: string;
  identifier: string;
  nome: string;
  creditos: number;
  tipo: string;
  dataUpload: string;
  status: "Em Processamento" | "Concluido" | "Erro";
  pendencies: [];
}

interface InfoArquivosProps {
  arquivo: ArquivoData | null;
}

export const Historico: FC<InfoArquivosProps> = ({
  arquivo,
}: {
  arquivo: Arquivo;
}) => {
  const identifier = arquivo?.identifier || "";

  // Inicio de Historico do Arquivo
  const historicoArquivosQuery = useQuery(
    ["HistoricoArquivos", identifier],
    async () => {
      if (!identifier) return null;
      const apiInstance = await Api.create();
      const response = await apiInstance.GetHistoricoArquivo(identifier);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: open && !!identifier,
    },
  );

  const isFetchingHistorico = historicoArquivosQuery.isLoading;
  const hasContentHistorico = historicoArquivosQuery?.data?.content ?? []; // Content?.content //
  // Fim de Historico do Arquivo

  return (
    <Grid container size={{ xs: 12 }} sx={{ alignItems: "center", mt: 2 }}>
      <Grid container size={{ xs: 12 }} sx={{ alignItems: "center" }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontWeight: "bold", color: "#333" }}
        >
          Historico do Arquivo
        </Typography>
      </Grid>

      <Paper
        variant="outlined"
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "none",
          p: 0,
          width: "100%",
          // display:'none'
        }}
      >
        <List dense disablePadding>
          {isFetchingHistorico && (
            <Typography
              variant="body2"
              sx={{ color: "#999", fontWeight: 400, mt: 2 }}
            >
              Carregando Historico...
            </Typography>
          )}
          {!isFetchingHistorico && hasContentHistorico.length === 0 && (
            <Typography
              variant="body2"
              sx={{ color: "#999", fontWeight: 400, mt: 2 }}
            >
              Sem Historico Encontrado
            </Typography>
          )}
          {!isFetchingHistorico &&
            hasContentHistorico.length > 0 &&
            hasContentHistorico.map((item, index) => (
              //   <ListItem key={item.id}>
              //     <Chip
              //       variant="outlined"
              //       sx={{ mr: 1 }}
              //       label={item.status}
              //       color={item.business_status.status_level}
              //     />
              //   </ListItem>
              <ListItem
                key={item.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mt: 1,
                  p: 1.5,
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  width: "99%",
                }}
              >
                <Typography
                  className="roboto-mono"
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    minWidth: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.business_status.status_level === "warning" ? (
                    <WarningIcon
                      sx={{ width: "20px", mr: 1, color: "#bea300" }}
                    />
                  ) : item.business_status.status_level === "success" ? (
                    <CheckCircleIcon
                      sx={{ width: "20px", mr: 1, color: "green" }}
                    />
                  ) : (
                    <ErrorIcon
                      sx={{ width: "20px", mr: 1, color: "#af1600" }}
                    />
                  )}
                  {item.status}
                </Typography>
                <Typography
                  className="roboto-mono"
                  variant="caption"
                  sx={{ boxSizing: "border-box", minWidth: "100%" }}
                >
                  {item.status_message} <br /> {dateTime(item.created_at)}
                </Typography>
              </ListItem>
            ))}
        </List>
      </Paper>
    </Grid>
  );
};
