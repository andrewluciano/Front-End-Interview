import { Alert, AlertTitle, Box, Grid } from "@mui/material";
import { type FC } from "react";

import Api from "../../API/Procedimentos";
import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

import { date } from "@/helpers/format";

import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface EscolhaProps {
  Close: () => void;
  identifier: string;
  Documentos: [];
  OpenManual: () => void;
  OpenVivIA: () => void;
}

export const BlocoDocumentos: FC<EscolhaProps> = ({ identifier }) => {
  const IconType = (type: string) => {
    if (type === "image/jpeg") {
      return <ImageIcon />;
    }
    if (type === "application/pdf") {
      return <PictureAsPdfIcon />;
    }
    return type;
  };

  const dadosListaUploads = useQuery(
    ["ListaUploadsByProcedure", identifier],
    async () => {
      const apiInstance = await Api.create();
      const response = await apiInstance.GetProcedimentosArquivos(identifier);
      return response;
    },
    { keepPreviousData: true, enabled: !!identifier },
  );

  const isFetching = dadosListaUploads?.isLoading;
  const hasContent = dadosListaUploads?.data?.content ?? [];

  console.log("hasContent", hasContent);

  const PaymentSkeleton = () => (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </>
  );

  return (
    <>
      <Grid container size={{ sm: 12 }} sx={{ p: 1 }}>
        <Grid container spacing={2} size={{ sm: 12, xs: 12 }}>
          {isFetching && <PaymentSkeleton />}
          {!isFetching && hasContent.length === 0 && (
            <Alert severity="info" sx={{ width: "100%" }}>
              <AlertTitle>Sem Documentos</AlertTitle>
              Nenhum documento encontrado.
            </Alert>
          )}
          {!isFetching &&
            hasContent.length >= 1 &&
            hasContent.map((item, index) => (
              <Alert
                icon={IconType(item?.file_type)}
                severity="warning"
                sx={{ width: "100%", cursor: "pointer" }}
                key={index}
                onClick={() =>
                  window.open(
                    `https://app.faturaviva.com/${item?.file_path}`,
                    "_blank",
                  )
                }
              >
                <AlertTitle> {`Arquivo ${index + 1}`} </AlertTitle>
                {item.file_name} - Upload:{" "}
                {date(item?.created_at?.substring(0, 10))}
              </Alert>
            ))}
        </Grid>
      </Grid>
    </>
  );
};
