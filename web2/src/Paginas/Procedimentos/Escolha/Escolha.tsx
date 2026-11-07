import { Button, Divider, Grid, Typography } from "@mui/material";
import { type FC } from "react";
// import VivIA from "@/assets/imagens/VivIA.png?url";
// import { styled } from "@mui/material/styles";

// Icones
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AdicionarProcedimento } from "../AdicionarProcedimento";
import { ProcedimentosVivIA } from "@/Paginas/Procedimentos/ProcedimentosVivIA";

import { useModal } from "@/Autenticacao/ModalContext";

interface EscolhaProps {
  Close: () => void;
  OpenManual: () => void;
  OpenVivIA: () => void;
}
// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

export const Escolha: FC<EscolhaProps> = () => {
  const { openModal } = useModal();

  const handleOpenProductModalAdicionar = () => {
    const modalContent = <AdicionarProcedimento />;
    const TituloModal = "Novo Procedimento";
    const SubTituloModal = "Você pode escolher o modo de subir o procedimento";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleOpenProductModal = () => {
    const modalContent = <ProcedimentosVivIA />;
    const TituloModal = "Gerenciador de Arquivos";
    const SubTituloModal =
      "Verificamos aqui o andamento dos upload dos procedimentos";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  return (
    <Grid container size={{ md: 12 }} padding={"10px"} sx={{ gap: "20px" }}>
      <Grid>
        <Typography component={"p"}>
          Se você tiver em mãos o pedido médico pode subir esse arquivo e deixar
          nossa IA ler o conteudo, se não você pode digitar manualmente como os
          antigos Maias.
        </Typography>
      </Grid>
      <Grid container size={{ md: 12 }} padding={"10px"}>
        <Grid
          container
          size={{ md: 5.9, xs: 12 }}
          sx={{ display: "flex" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Grid size={{ md: 12 }} sx={{ textAlign: "center" }}>
            {/* <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button> */}

            <Button
              variant="contained"
              onClick={handleOpenProductModal}
              startIcon={<CloudUploadIcon />}
            >
              Subir Procedimento
            </Button>
          </Grid>

          <Grid size={{ md: 12 }} sx={{ textAlign: "center" }}>
            <Typography component={"p"}>
              Subir Procedimento com Guia Médica
            </Typography>
          </Grid>
        </Grid>
        <Grid
          size={{ md: 0.2, xs: 12 }}
          sx={{ display: "flex" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Divider orientation="vertical" sx={{ height: "100%" }} flexItem />
        </Grid>
        <Grid
          size={{ md: 5.9, xs: 12 }}
          sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Button variant="contained" onClick={handleOpenProductModalAdicionar}>
            &nbsp; Novo Procedimento Manual &nbsp;
          </Button>
          <Typography component={"p"}>
            Suba manualmente o procedimento
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
