import { FC, useState, useRef, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  Button,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import InfoIcon from "@mui/icons-material/Info";
import { useModal } from "@/Autenticacao/ModalContext";
import TiposArquivos from "./TiposArquivos.json";

import { useMutation, useQuery, useQueryClient } from "react-query";
import Api from "@/Paginas/GerenciadorArquivos/API/GestaoArquivos";

import { IUploadPayload } from "@/Paginas/GerenciadorArquivos/API/Interfaces";
import { useSearchParams } from "react-router-dom";
import { CutText } from "../CutText";

interface ArquivoFila {
  id: string;
  file: File;
  nome: string;
  tamanho: string;
  tipo: string;
  status: "aguardando" | "processando" | "enviado" | "erro";
  url?: string;
  tipoSelecionado: string;
}

export const ModalUploadArquivos: FC<{ tipo: string }> = ({ tipo }) => {
  const [searchParams] = useSearchParams();

  const [tipoArquivo, setTipoArquivo] = useState(tipo);
  const { closeModal } = useModal();
  const [arquivosFila, setArquivosFila] = useState<ArquivoFila[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
    autoHideDuration?: number | null;
  }>({
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: 6000,
  });

  const dadosListaTiposArquivos = useQuery(
    ["ListaTiposArquivos"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetTiposArquivos();
      return response;
    },
    { keepPreviousData: false },
  );

  const isFetching = dadosListaTiposArquivos?.isLoading;
  const hasContent = dadosListaTiposArquivos?.data?.content;

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
    if (
      snackbar.message.startsWith(
        "Os uploads dos seus arquivos foram concluídos com sucesso!",
      )
    ) {
      closeModal();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: ArquivoFila[] = Array.from(event.target.files).map(
        (file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          nome: file?.name ?? "",
          tamanho: formatFileSize(file?.size ?? 0),
          tipo: file?.type?.includes("pdf") ? "pdf" : "image",
          tipoSelecionado:
            tipoArquivo === "UploadAgendamento"
              ? "EXTRATO_AGENDAMENTO"
              : tipoArquivo === "UploadPagamento"
                ? "EXTRATO_PAGAMENTO"
                : "",
          status: "aguardando",
        }),
      );
      setArquivosFila((prev) => [...prev, ...newFiles]);

      // Reset input value to allow selecting the same file again
      event.target.value = "";
    }
  };

  const handleTipoSelecionadoChange = (id: string, novoTipo: string) => {
    setArquivosFila((prev) =>
      prev.map((arq) =>
        arq.id === id ? { ...arq, tipoSelecionado: novoTipo } : arq,
      ),
    );
  };

  const handleRemoveFile = (id: string) => {
    setArquivosFila((prev) => prev.filter((arq) => arq.id !== id));
  };

  const handleUpload = async (id: string, showSnackbar = true) => {
    const arquivo = arquivosFila.find((a) => a.id === id);
    if (!arquivo) return;

    setArquivosFila((prev) =>
      prev.map((arq) =>
        arq.id === id ? { ...arq, status: "processando" } : arq,
      ),
    );

    const payload: IUploadPayload = {
      nome: arquivo.nome,
      creditos: 126,
      tipo: arquivo.tipoSelecionado,
      tamanho: arquivo.tamanho,
      dataUpload: new Date(),
      status: "pendente",
      file: arquivo.file,
    };

    try {
      const response = await AcaoUploadFile(payload);

      if (!response?.is_error) {
        if (showSnackbar) {
          setSnackbar({
            open: true,
            message: `Arquivo ${arquivo.nome} enviado com sucesso!`,
            severity: "success",
            autoHideDuration: 6000,
          });
        }
        setArquivosFila((prev) =>
          prev.map((arq) =>
            arq.id === id
              ? {
                  ...arq,
                  status: "enviado",
                  url: URL.createObjectURL(arquivo.file),
                }
              : arq,
          ),
        );
      } else {
        const errorMsg =
          response?.message ||
          `Erro ao enviar ${arquivo.nome}: Código ${response?.statusCode || "desconhecido"}`;

        if (showSnackbar) {
          setSnackbar({
            open: true,
            message: errorMsg,
            severity: "error",
            autoHideDuration: 6000,
          });
        }

        setArquivosFila((prev) =>
          prev.map((arq) => (arq.id === id ? { ...arq, status: "erro" } : arq)),
        );
      }
    } catch (error) {
      if (showSnackbar) {
        setSnackbar({
          open: true,
          message: `Erro de conexão ao enviar ${arquivo.nome}`,
          severity: "error",
          autoHideDuration: 6000,
        });
      }
      setArquivosFila((prev) =>
        prev.map((arq) => (arq.id === id ? { ...arq, status: "erro" } : arq)),
      );
    }
  };

  const handleViewFile = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleUploadAll = async () => {
    const promises = arquivosFila
      .filter((arq) => arq.status === "aguardando")
      .map((arq) => handleUpload(arq.id, false));

    await Promise.all(promises);

    setSnackbar({
      open: true,
      message:
        "Os uploads foram iniciados com sucesso! Para visualizar o status detalhado de cada um, realizar a exclusão de arquivos indesejados ou organizar suas pastas, acesse agora a página Gerenciador de Arquivos disponível no menu do sistema.",
      severity: "success",
      autoHideDuration: null,
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const queryClient = useQueryClient();

  const { mutateAsync: AcaoUploadFile } = useMutation(
    async (dados: IUploadPayload) => {
      const apiInstance = await Api.create();
      const response = await apiInstance.PostArquivos(dados);

      if (!response?.is_error) {
        queryClient.invalidateQueries();
      }
      return response;
    },
  );

  return (
    <Box>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box sx={{ p: 0, maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "#333" }}
              >
                Selecionar Arquivos
              </Typography>
              <Box
                onClick={triggerFileInput}
                sx={{
                  border: "1px dashed #ccc",
                  borderRadius: 1,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "80px",
                  color: "#aaa",
                  cursor: "pointer",
                  bgcolor: "#f9f9f9",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <FileUploadOutlinedIcon
                  sx={{ fontSize: 40, mb: 1, color: "#ccc" }}
                />
                <Typography variant="body2">
                  Clique para selecionar arquivos do computador
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
          Arquivos na Fila
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "350px",
            overflowY: "auto",
          }}
        >
          {arquivosFila.map((arq) => (
            <Grid
              container
              key={arq.id}
              sx={{
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Grid
                container
                size={{ sm: 4.5, xs: 12 }}
                sx={{
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {arq.tipo === "pdf" ? (
                  <PictureAsPdfIcon sx={{ fontSize: 40 }} />
                ) : (
                  <ImageIcon sx={{ fontSize: 40 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", wordBreak: "break-word" }}
                  >
                    <CutText
                      value={arq.nome || "Sem Nome Cadastrado"}
                      contagem={28}
                      position={undefined}
                      cont={0}
                      props={[]}
                    />
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {arq.tamanho} - {arq.tipo.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                container
                size={{ sm: 5, xs: 12 }}
                sx={{
                  alignItems: "center",
                }}
              >
                {isFetching && <LinearProgress />}
                {!isFetching && (
                  <>
                    <Select
                      fullWidth
                      size="small"
                      value={arq.tipoSelecionado}
                      disabled={
                        tipoArquivo === "UploadAgendamento" ||
                        tipoArquivo === "UploadPagamento" ||
                        arq.status !== "aguardando"
                      }
                      onChange={(e) =>
                        handleTipoSelecionadoChange(arq.id, e.target.value)
                      }
                      sx={{
                        bgcolor: "#fff",
                        height: "35px",
                        fontSize: "0.85rem",
                        maxWidth: "88%",
                        minWidth: "88%",
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      {hasContent.map((item) => (
                        <MenuItem key={item.code} value={item.code}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <Tooltip
                      title={
                        hasContent.find((t) => t.code === arq.tipoSelecionado)
                          ?.description ||
                        "Selecione um tipo para ver a descrição"
                      }
                    >
                      <InfoIcon
                        color="action"
                        sx={{ ml: 1, cursor: "pointer" }}
                      />
                    </Tooltip>
                  </>
                )}
              </Grid>

              <Grid
                container
                size={{ sm: 2, xs: 12 }}
                sx={{
                  alignItems: "center",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  gap: 2,
                }}
              >
                {arq.status === "enviado" ? (
                  <Alert
                    severity="success"
                    sx={{
                      py: 0,
                      px: 2,
                      alignItems: "center",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Enviado
                  </Alert>
                ) : arq.status === "processando" ? (
                  <Alert
                    severity="info"
                    sx={{
                      py: 0,
                      px: 2,
                      alignItems: "center",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Processando...
                  </Alert>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<FileUploadOutlinedIcon />}
                    onClick={() => handleUpload(arq.id, true)}
                    disabled={
                      arq.status !== "aguardando" || arq.tipoSelecionado === ""
                    }
                    sx={{
                      bgcolor: "#e0e0e0",
                      color: "#555",
                      textTransform: "none",
                      boxShadow: "none",
                      fontWeight: 500,
                      display: "none",
                      minWidth: "100px",
                      flex: { xs: 1, sm: "initial" },
                      "&:hover": { bgcolor: "#d0d0d0", boxShadow: "none" },
                    }}
                  >
                    Upload
                  </Button>
                )}

                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <IconButton
                    size="small"
                    sx={{ color: "#555" }}
                    onClick={() => handleViewFile(arq.url)}
                    disabled={arq.status !== "enviado"}
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#555" }}
                    onClick={() => handleRemoveFile(arq.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
          {arquivosFila.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ py: 4 }}
            >
              Nenhum arquivo selecionado.
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ pt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={closeModal}
          sx={{
            color: "#333",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleUploadAll}
          disabled={
            arquivosFila.length === 0 ||
            arquivosFila.every((a) => a.status === "enviado") ||
            arquivosFila.some(
              (a) => a.tipoSelecionado === "" && a.status === "aguardando",
            )
          }
          sx={{
            bgcolor: "#00c853",
            color: "#fff",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1,
            fontSize: "1rem",
            boxShadow: "none",
            borderRadius: 1,
            "&:hover": { bgcolor: "#00a040", boxShadow: "none" },
          }}
        >
          Enviar Tudo
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
