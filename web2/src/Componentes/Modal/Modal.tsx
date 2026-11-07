import { type FC, type ReactNode } from "react";
import { BoxCustom, ModalCustom, CustomConteudoModal } from "./Styles";
import Typography from "@mui/material/Typography";
import { BotaoFechar } from "@/Componentes/BotaoPadrao";
import { Grid } from "@mui/material";

import { useModal } from "@/Autenticacao/ModalContext";

interface IMyProps {
  Close: () => void;
  Abre: boolean;
  Fecha: () => void;
  OpenModal: boolean;
  LarguraModal: string;
  AlturaModal: string;
  TituloModal: string;
  SubTituloModal: string | undefined;
  IconeTipo: string;
  abreModal: boolean;
  altura: string;
  Conteudo: ReactNode;
}

export const ModalDefault: FC<IMyProps> = () => {
  const {
    isModalOpen,
    closeModal,
    modalContent,
    TituloModal,
    SubTituloModal,
    LarguraModal,
    AlturaModal,
  } = useModal();

  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: LarguraModal || "80vw",
    height: AlturaModal || "auto",
    maxHeight: "90vh",
    maxWidth: "1080px",
    bgcolor: "background.paper",
    // border: "1px solid #000",
    boxShadow: 24,
    borderRadius: "5px",
    p: 4,
    gap: "20px",
    zIndex: "999999",
  };

  if (!isModalOpen) return null;

  const handleClose = () => {
    // props.Close();
    // setOpen(false);
    closeModal();
  };

  return (
    <div>
      <ModalCustom
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxCustom sx={style}>
          <Grid container size={{ sm: 12, xs: 12 }} sx={{ width: "100%" }}>
            <Grid size={{ xs: 11, sm: 11 }} sx={{ padding: "0 10px" }}>
              {TituloModal && (
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontSize: { xs: "1.3rem", sm: "1.875rem" },
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {TituloModal}
                </Typography>
              )}

              {SubTituloModal && (
                <Typography
                  variant="subtitle2"
                  component="h6"
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: "normal",
                    color: "#333",
                  }}
                >
                  {SubTituloModal}
                </Typography>
              )}
            </Grid>
            <Grid
              size={{ xs: 1, sm: 1 }}
              style={{ display: "flex" }}
              justifyContent={"flex-end"}
            >
              <BotaoFechar
                click={handleClose}
                titulo={""}
                link={""}
                tamanho={""}
                tipo={""}
                icone={""}
                disabled={false}
              />
            </Grid>
          </Grid>
          <CustomConteudoModal>{modalContent}</CustomConteudoModal>
        </BoxCustom>
      </ModalCustom>
    </div>
  );
};
