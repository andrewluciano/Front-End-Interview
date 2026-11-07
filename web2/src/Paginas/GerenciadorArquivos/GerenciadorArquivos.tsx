import { FC, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Chip,
  Grid,
  Stack,
  Tooltip,
} from "@mui/material";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CachedIcon from "@mui/icons-material/Cached";

import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { InfoArquivos } from "./InfoArquivos/InfoArquivos";
import { ModalUploadArquivos } from "../../Componentes/ModalUploadArquivos/ModalUploadArquivos";
import { ExcluirArquivo } from "./ExcluirArquivo";
import { ReprocessarArquivo } from "./ReprocessarArquivo";

import { useModal } from "@/Autenticacao/ModalContext";
import { theme } from "@/stitches.config";
import { Titulos } from "@/Componentes/Titulos";

import LinearProgress from "@mui/material/LinearProgress";

import { CutText } from "@/Componentes/CutText";
import ImgSemResultados from "@/assets/imagens/undraw_empty_4zx0.svg";
import { dateTime } from "@/helpers/format";
import { useQuery } from "react-query";
import Api from "./API/GestaoArquivos";

interface ArquivoData {
  id: string;
  nome: string;
  creditos: number;
  tipo: string;
  dataUpload: string;
  status: "Em Processamento" | "Concluido" | "Erro";
}

export const GerenciadorArquivos: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArquivo, setSelectedArquivo] = useState<ArquivoData | null>(
    null,
  );
  const { openModal } = useModal();

  const PaymentSkeleton = () => (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{
        height: "80px",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <Grid size={{ sm: 3, xs: 12 }} sx={{ padding: "0px 10px" }}>
        <LinearProgress />
      </Grid>
    </Grid>
  );

  const ListaArquivos = useQuery(
    ["ListaArquivos"],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetArquivos();
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = ListaArquivos.isLoading;

  const hasContent = ListaArquivos?.data?.content ?? []; // Content?.content //

  const handleOpenInfo = (arquivo: ArquivoData) => {
    setSelectedArquivo(arquivo);
    setDrawerOpen(true);
  };

  const handleCloseInfo = () => {
    setDrawerOpen(false);
    setSelectedArquivo(null);
  };

  const handleOpenUploadModal = () => {
    openModal(
      <ModalUploadArquivos />,
      "Upload de Arquivos",
      "Selecione os arquivos para upload",
    );
  };
  const handleOpenDelete = (arquivo: ArquivoData) => {
    openModal(
      <ExcluirArquivo DadosSelecionados={arquivo} />,
      "Exlusão de Arquivos",
      "Confirme a arquivo para excluir",
    );
  };

  const handleOpenReprocessando = (arquivo: ArquivoData) => {
    openModal(
      <ReprocessarArquivo DadosSelecionados={arquivo} />,
      "Reprocessamento de Arquivos",
      "Confirme a arquivo para reprocessar",
    );
  };

  const filteredArquivos = hasContent.filter((arquivo: ArquivoData) => {
    const term = searchTerm.toLowerCase();
    return (
      (arquivo.nome?.toLowerCase() || "").includes(term) ||
      (arquivo.tipo?.toLowerCase() || "").includes(term) ||
      (dateTime(arquivo.dataUpload)?.toLowerCase() || "").includes(term) ||
      (arquivo.status?.toLowerCase() || "").includes(term) ||
      (arquivo.creditos?.toString() || "").includes(term)
    );
  });

  return (
    <Box sx={{ width: "100%" }}>
      <InfoArquivos
        open={drawerOpen}
        onClose={handleCloseInfo}
        arquivo={selectedArquivo}
      />

      <Titulos titulo="Gestão de Arquivos" icone={undefined} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Pesquisar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "#fff",

            width: { xs: "4", sm: "400px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleOpenUploadModal}
          sx={{
            backgroundColor: theme.colors.primaryColor,
            color: "#fff",
            textTransform: "none",
            fontWeight: "normal",
            padding: "8px 24px",
            "&:hover": {
              backgroundColor: theme.colors.secondaryColor,
            },
          }}
        >
          Upload de Novo Arquivo
        </Button>
      </Box>

      {/* Cabeçalho da Lista */}
      <Grid
        container
        sx={{
          px: 2,
          mb: 1,
          color: "#666",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <Grid container size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2">Arquivo</Typography>
        </Grid>
        <Grid container size={{ xs: 12, sm: 2 }}>
          <Typography variant="body2">Tipo do Arquivo</Typography>
        </Grid>
        <Grid container size={{ xs: 12, sm: 1.5 }}>
          <Typography variant="body2">Dt Upload</Typography>
        </Grid>
        <Grid container size={{ xs: 12, sm: 1.5 }}>
          <Typography variant="body2">Status</Typography>
        </Grid>
        <Grid container size={{ xs: 12, sm: 2 }}>
          {/* Espaço para ações */}
        </Grid>
      </Grid>

      {isFetching && <PaymentSkeleton />}
      {!isFetching && filteredArquivos.length > 0 && (
        <Stack spacing={1}>
          {filteredArquivos.map((arquivo, i) => (
            <Paper
              key={i}
              elevation={1}
              sx={{
                py: 1.5,
                px: 1,
                display: "flex",
                alignItems: "center",
                borderRadius: 0,
              }}
            >
              <Grid container alignItems="center" spacing={0} size={12}>
                {/* Coluna Arquivo */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ mb: { xs: 2, sm: 0 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      pl: 1,
                    }}
                  >
                    <PictureAsPdfIcon sx={{ fontSize: 30 }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        <CutText
                          value={arquivo?.nome || "Sem Nome Cadastrado"}
                          contagem={30}
                          position={undefined}
                          cont={0}
                          props={[]}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Coluna Tipo */}
                <Grid size={{ xs: 6, sm: 2 }} sx={{ mb: { xs: 1, sm: 0 } }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: { xs: "block", sm: "none" },
                      fontWeight: "bold",
                    }}
                  >
                    Tipo
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: `${theme.fontSizes[14]} !important` }}
                  >
                    <CutText
                      value={arquivo?.tipo || "-"}
                      contagem={19}
                      position={undefined}
                      cont={0}
                      props={[]}
                    />
                  </Typography>
                </Grid>

                {/* Coluna Data */}
                <Grid
                  size={{ xs: 6, sm: 1.5 }}
                  sx={{
                    mb: { xs: 1, sm: 0 },
                    textAlign: { xs: "right", sm: "left" },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: { xs: "block", sm: "none" },
                      fontWeight: "bold",
                    }}
                  >
                    Dt Upload
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: `${theme.fontSizes[14]} !important` }}
                  >
                    {dateTime(arquivo.dataUpload)}
                  </Typography>
                </Grid>

                {/* Coluna Status */}
                <Grid size={{ xs: 12, sm: 1.8 }} sx={{ mb: { xs: 2, sm: 0 } }}>
                  <Tooltip title={arquivo.status_message || ""}>
                    <Chip
                      label={arquivo.status}
                      // variant="outlined"
                      size="small"
                      color={arquivo.status_level ?? "default"}
                      icon={
                        arquivo.status_level === "warning" ? (
                          <CircularProgress
                            size={14}
                            color="inherit"
                            sx={{ width: 14, height: 14 }}
                          />
                        ) : undefined
                      }
                      sx={{
                        // borderColor: "#ffd740", // Amarelo
                        // color: "#fbc02d",
                        // backgroundColor: "#fff9c4",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        width: "100%",
                        maxWidth: { xs: "none", sm: "130px" },
                        padding: "6px 7px",
                        fontSize: "0.65rem",
                      }}
                    />
                  </Tooltip>
                </Grid>

                {/* Coluna Ações */}
                <Grid size={{ xs: 12, sm: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: { xs: "space-between", sm: "flex-end" },
                    }}
                  >
                    <Button
                      variant="contained"
                      color="inherit"
                      size="small"
                      startIcon={<InfoOutlinedIcon />}
                      onClick={() => handleOpenInfo(arquivo)}
                      fullWidth
                      sx={{
                        backgroundColor: "#e0e0e0",
                        color: "#333",
                        textTransform: "none",
                        boxShadow: "none",
                        fontSize: `${theme.fontSizes[12]} !important`,
                        fontWeight: "normal",
                        px: "40px",
                        "&:hover": {
                          backgroundColor: "#d5d5d5",
                        },
                        maxWidth: { sm: "auto" },
                      }}
                    >
                      Informações
                    </Button>

                    <Button
                      disabled={arquivo.status_level === "success"}
                      sx={{ minWidth: "initial", p: 0 }}
                      onClick={() => handleOpenReprocessando(arquivo)}
                    >
                      <CachedIcon />
                    </Button>

                    <Button
                      onClick={() => handleOpenDelete(arquivo)}
                      sx={{ minWidth: "initial", p: 0 }}
                    >
                      <DeleteForeverRoundedIcon />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      )}

      {!isFetching &&
        hasContent.length > 0 &&
        filteredArquivos.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 4, color: "#666" }}>
            <Typography variant="body1">
              Nenhum resultado encontrado para "{searchTerm}"
            </Typography>
          </Box>
        )}

      {!isFetching && hasContent.length <= 0 && (
        <Grid
          container
          sx={{}}
          size={{ xs: 12, sm: 12 }}
          justifyContent="center"
        >
          <Grid
            container
            sx={{
              backgroundColor: "background.paper",
              p: 2,
              borderRadius: "5px",
              m: 2,
              boxShadow: "1",
            }}
            size={{ xs: 12, sm: 6 }}
            justifyContent="center"
          >
            <Grid
              container
              size={{ xs: 12, sm: 7 }}
              sx={{ p: 2 }}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#333",
                  fontSize: `${theme.fontSizes[18]} !important`,
                  padding: "0",
                }}
              >
                Sem Arquivos Carregados
              </Typography>
              <Typography variant="caption" sx={{ color: "#333", pb: "10px" }}>
                Faça o upload de novo arquivo!
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenUploadModal}
                size="small"
                sx={{
                  backgroundColor: theme.colors.primaryColor,
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: "normal",
                  // padding: "8px 24px",
                  fontSize: "0.75rem",
                  "&:hover": {
                    backgroundColor: theme.colors.secondaryColor,
                  },
                }}
              >
                Upload de Novo Arquivo
              </Button>
            </Grid>
            <Grid container size={{ xs: 12, sm: 5 }} sx={{ p: 2 }}>
              <img
                src={ImgSemResultados}
                alt="Sem Resultados"
                style={{ height: "150px" }}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
