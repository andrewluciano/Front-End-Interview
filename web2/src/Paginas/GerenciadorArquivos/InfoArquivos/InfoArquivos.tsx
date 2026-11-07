import { FC, useState } from "react";
import { Historico } from "./Historico/Historico";
import {
  Drawer,
  IconButton,
  Grid,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Chip,
  Button,
  Divider,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

import { baseURL } from "@/APIS/BaseApis";

import { dateTime } from "@/helpers/format";
import { formatFileSize } from "@/helpers/format/Files";
import { useMutation, useQuery } from "react-query";
import Api from "../API/GestaoArquivos";

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
  open: boolean;
  onClose: () => void;
  arquivo: ArquivoData | null;
}

export const InfoArquivos: FC<InfoArquivosProps> = ({
  open,
  onClose,
  arquivo,
}) => {
  const navigate = useNavigate();
  const identifier = arquivo?.identifier || "";

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // inicio Informações do Arquivo
  const infoArquivosQuery = useQuery(
    ["InfoArquivos", identifier],
    async () => {
      if (!identifier) return null;
      const apiInstance = await Api.create();
      const response = await apiInstance.GetArquivosEspecificos(identifier);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: open && !!identifier,
    },
  );

  const isFetchingArquivo = infoArquivosQuery.isLoading;
  const hasContentArquivo = infoArquivosQuery?.data?.content ?? []; // Content?.content //
  // Fim de Informações do Arquivo

  const { mutate: AbrirArquivo } = useMutation(["AbrirArquivo"], async () => {
    setSnackbar({
      open: true,
      message: "Carregando Arquivo...",
      severity: "info",
    });

    const apiInstance = await Api.create();
    const response = await apiInstance.GetArquivosEspecificos(identifier);

    if (!response?.is_error) {
      setSnackbar((prev) => ({ ...prev, open: false }));

      window.open(
        baseURL + "/" + response?.content[0].file_path || "",
        "_blank",
      );
      return response;
    }
    return null;
  });

  if (!arquivo) return null;

  const PaymentSkeleton = () => (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{
        height: "100%",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <Grid size={{ sm: 6, xs: 12 }} sx={{ padding: "0px 10px" }}>
        <LinearProgress />
      </Grid>
    </Grid>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={800}
      PaperProps={{
        sx: { width: { xs: "85%", sm: 450 }, p: 4 },
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Informações do Arquivo
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {isFetchingArquivo && <PaymentSkeleton />}
      {!isFetchingArquivo && hasContentArquivo.length > 0 && (
        <Grid
          container
          size={{ sm: 12, xs: 12 }}
          sx={{
            alignItems: "flex-start",
            alignContent: "flex-start",
            maxHeight: "87vh",
            height: "87vh",
            overflowX: "auto",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Arquivo
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {hasContentArquivo[0].nome}
              </Typography>
              <IconButton size="small">
                <OpenInNewIcon
                  fontSize="small"
                  onClick={() => AbrirArquivo(hasContentArquivo[0].identifier)}
                />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Data upload
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {/* Usando data do mock ou formatando se necessário */}
                {hasContentArquivo[0].dataUpload
                  ? dateTime(hasContentArquivo[0].dataUpload)
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Tamanho do Arquivo
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {hasContentArquivo[0].file_size
                  ? formatFileSize(hasContentArquivo[0].file_size)
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 7 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Tipo de Arquivo
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {hasContentArquivo[0].tipo}
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Uso de Créditos
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {hasContentArquivo[0].creditos}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ width: "100%", height: "30px", display: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <WarningAmberIcon color="warning" fontSize="small" />
              <Typography variant="body2">
                {hasContentArquivo[0].pendencies.length} pendências
              </Typography>
            </Box>

            <Box sx={{ display: "none", alignItems: "center", gap: 1 }}>
              <CheckCircleOutlineIcon color="success" fontSize="small" />
              <Typography variant="body2">
                {hasContentArquivo[0].source_content.length} uploads ok
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 5,
              display: "none",
              flexDirection: "column",
              flex: 1,
              overflow: "hidden",
              width: "100%",
              border: "1px solid transparent",
            }}
          >
            <Grid container size={{ xs: 12 }} sx={{ alignItems: "center" }}>
              <Grid container size={{ xs: 5 }} sx={{ alignItems: "center" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0, fontWeight: "bold", color: "#333" }}
                >
                  Pendências Encontradas
                </Typography>
              </Grid>
              <Grid
                container
                size={{ xs: 5 }}
                sx={{
                  position: "relative",
                  top: "2px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      `/Dashboard-Medico?Atendimento=${hasContentArquivo[0].generated_encounters}`,
                    )
                  }
                  endIcon={
                    <OpenInNewIcon sx={{ fontSize: "0.9rem !important" }} />
                  }
                  sx={{
                    fontSize: "0.7rem",
                    textTransform: "none",
                  }}
                >
                  Abrir Encontro
                </Button>
              </Grid>
            </Grid>
            <Paper
              variant="outlined"
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "none",
                p: 0,
                // display:'none'
              }}
            >
              <List dense disablePadding>
                {hasContentArquivo[0].pendencies.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#333", fontWeight: 500 }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < hasContentArquivo[0].pendencies.length - 1 && (
                      <Divider component="li" />
                    )}
                  </Box>
                ))}

                {hasContentArquivo[0].pendencies.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#999", fontWeight: 400, mt: 2 }}
                  >
                    Sem Pendências Encontradas
                  </Typography>
                )}
              </List>
            </Paper>
          </Box>

          <Historico arquivo={arquivo} />
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};
