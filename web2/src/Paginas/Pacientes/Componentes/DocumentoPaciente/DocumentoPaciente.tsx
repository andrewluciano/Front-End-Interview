import { Box, Grid, Typography } from "@mui/material";
import { type FC } from "react";

// APIs
import Api from "../../API/Pacientes";

import { useQuery } from "react-query";

import LinearProgress from "@mui/material/LinearProgress";

export const DocumentoPaciente: FC = (props) => {
  //  const [DocumentosUpload, setDocumentosUpload] = useState([]);

  //     const EnvioDocumentosoUpload = (dados: File) => {
  //     setDocumentosUpload(dados);

  //   };

  const DadosDocumentosPacientes = useQuery(
    ["DadosDocumentosPacientes"],
    async () => {
      const apiInstance = await Api.create();

      const response = await apiInstance.GetDocumentosPacientes(
        props?.DadosSelecionados?.identifier,
      );
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = DadosDocumentosPacientes.isLoading;
  const hasContent = DadosDocumentosPacientes?.data?.content ?? [];

  const PaymentSkeleton = () => (
    <Grid container size={12} sx={{ height: "180" }}>
      <Box sx={{ width: "100%" }} className="Loading">
        <LinearProgress />
      </Box>
    </Grid>
  );

  return (
    <>
      {!isFetching && hasContent.length > 0 && (
        <Grid
          container
          spacing={2}
          sx={{ padding: "10px", width: "100% !important" }}
          size={{ sm: 12 }}
        >
          <Grid size={{ sm: 12 }}>
            <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
              {hasContent.map((item) => {
                return (
                  <tr>
                    <td style={{ width: "50%" }}>{item?.file_name}</td>
                    <td style={{ width: "50%" }}>{item?.file_type}</td>
                  </tr>
                );
              })}
            </table>
          </Grid>
        </Grid>
      )}
      {!isFetching && hasContent.length === 0 && (
        <Grid
          container
          spacing={2}
          sx={{ padding: "10px", width: "100% !important" }}
          size={{ sm: 12 }}
        >
          <Grid size={{ sm: 12 }}>
            <Typography>Nenhum documento cadastrado</Typography>
          </Grid>
        </Grid>
      )}
      {isFetching && <PaymentSkeleton />}
    </>
  );
};
