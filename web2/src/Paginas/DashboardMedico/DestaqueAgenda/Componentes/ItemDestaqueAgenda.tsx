import { useState, type Dispatch, type SetStateAction } from "react";
import { theme } from "@/stitches.config";

import { motion, useAnimation } from "framer-motion";

import { Chip, Button, Typography, Tooltip, Grid, Box } from "@mui/material";

import { PaperCustom } from "../Styles";
import { CutText } from "@/Componentes/CutText";

import { useModal } from "@/Autenticacao/ModalContext";
import { ExcluirConsulta } from "@/Paginas/Consultas/ExcluirConsulta";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useNavigate } from "react-router-dom";

import { dateSimple, currency, JustTime } from "@/helpers/format";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pendente":
      return {
        backgroundColor: "#FFF9C4",
        color: "#FBC02D",
        borderColor: "#FFF59D",
      };
    case "Pago":
      return {
        backgroundColor: "#E8F5E9",
        color: "#43A047",
        borderColor: "#C8E6C9",
      };
    case "Cancelado":
      return {
        backgroundColor: "#FFEBEE",
        color: "#E53935",
        borderColor: "#FFCDD2",
      };
    case "Agendado":
      return {
        backgroundColor: "#E3F2FD",
        color: "#1E88E5",
        borderColor: "#BBDEFB",
      };
    default:
      return {
        backgroundColor: "#F5F5F5",
        color: "#757575",
        borderColor: "#E0E0E0",
      };
  }
};

type ItemDestaqueAgendaProps = {
  item: DadosConsulta;
  selectedIdentifiers: string[];
  setSelectedIdentifiers: Dispatch<SetStateAction<string[]>>;
};

export const ItemDestaqueAgenda = ({
  item,
  selectedIdentifiers,
  setSelectedIdentifiers,
}: ItemDestaqueAgendaProps) => {
  const actionsWidth = 120;
  const navigate = useNavigate();
  const dragAnimation = useAnimation();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const { openModal, closeModal } = useModal();
  const handleOpenDelete = (item) => {
    openModal(
      <ExcluirConsulta DadosSelecionados={item} closeModal={closeModal} />,
      "Exlusão de Arquivos",
      "Confirme a arquivo para excluir",
    );
  };

  // console.log('selectedIdentifiers',selectedIdentifiers)
  const identifier = String(item?.Identifier ?? "");
  void setSelectedIdentifiers;

  const setActionsOpen = (open: boolean) => {
    dragAnimation.start({
      x: open ? -actionsWidth : 0,
      transition: { type: "spring", stiffness: 700, damping: 45 },
    });
    setIsActionsOpen(open);
  };

  return (
    <Grid container size={{ sm: 12, xs: 12 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          // mb: 1,
          borderRadius: 0,
          width: "100%",
          pr: "44.5px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "#999",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            pr: 2,
            borderRadius: "5px 0 0 5px",
            width: "40px",
            height:'97%',
            top:'2px',
            left: "99.5%",
            transform: "translateX(-200%)",
            cursor: "pointer",
          }}
          onClick={(event) => {
            event.stopPropagation();
            setActionsOpen(false);
            navigate(`?Atendimento=${item.Identifier}`, {
              replace: true,
            });
          }}
        >
          <EditIcon sx={{ color: "white" }} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            pr: 2,
            borderRadius: "0 5px 5px 0",
            width: "40px",
            height:'97%',
            top:'2px',
            left: "99.5%",
            transform: "translateX(-100%)",
            cursor: "pointer",
          }}
          onClick={(event) => {
            event.stopPropagation();
            setActionsOpen(false);
            handleOpenDelete(item);
          }}
        >
          <DeleteIcon sx={{ color: "white" }} />
        </Box>
        <motion.div
          animate={dragAnimation}
          style={{ zIndex: 1, width: "99.6%", position: "relative", padding:'2px'}}
        >
          <PaperCustom
            key={item.id}
            sx={{boxShadow:1}}
            style={{
              backgroundColor: theme.colors.PaperColor.value,
              outline: selectedIdentifiers.includes(identifier)
                ? "2px solid #43A047"
                : undefined,
              outlineOffset: "-2px",
            }}
            onClick={() => {
              setActionsOpen(!isActionsOpen);
              // if (dragBlockClickRef.current) return;
              // if (!identifier) return;
              // setSelectedIdentifiers((prev) =>
              //   prev.includes(identifier)
              //     ? prev.filter((id) => id !== identifier)
              //     : [...prev, identifier],
              // );
            }}
          >
            <Grid container alignItems="center" spacing={"6px"}>
              <Grid size={{ xs: 8, md: 8 }} sx={{ p: "0px !important" }}>
                <Typography
                  variant="subtitle2"
                  component={"h5"}
                  sx={{
                    textTransform: "uppercase",
                    m: 0,
                    fontWeight: "normal",
                    color: "#666",
                  }}
                >
                  {/* <CutText value={item.Paciente} contagem={23} /> */}
                  {item.Tipo  || "Tipo Não Informado"}
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 4, md: 4 }}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Chip
                  label={item.Status}
                  size="small"
                  sx={{
                    fontWeight: "normal",
                    fontSize: `theme.fontSizes[10] !important`,
                    px: 1,
                    backgroundColor: getStatusColor(item.Status),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography
                  variant="h2"
                  fontWeight={"bold"}
                  component={"h2"}
                  sx={{ textTransform: "capitalize", alignContent: "center" }}
                >
                  <CutText value={item.Procedimento || "N/A"} contagem={68} />
                </Typography>
              </Grid>
              <Grid
                container
                sx={{ alignItems: "center" }}
                size={{ xs: 12, sm: 12 }}
              >
                <CalendarTodayIcon
                  sx={{
                    width: "14px",
                    height: "14px",
                    color: "#444",
                  }}
                />
                <Typography
                  variant="caption"
                  component="h4"
                  sx={{
                    color: "#444",
                  }}
                  display="block"
                >
                  {item?.DataProcedimento
                    ? dateSimple(item?.DataProcedimento)
                    : "00/00/0000"}
                  {/* {item?.dataPagamento ? dateTime(item?.dataPagamento) : "N/A"} */}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.6rem", display: "none" }}
                >
                  ●
                </Typography>
                <AccessTimeIcon
                  sx={{
                    width: "14px",
                    height: "14px",
                    color: "#444",
                    display: "none",
                  }}
                />
                <Typography
                  variant="caption"
                  component="h4"
                  sx={{
                    color: "#444",
                    display: "none",
                  }}
                  display="block"
                >
                  {item?.DataProcedimento
                    ? JustTime(item?.DataProcedimento)
                    : "00:00"}
                  {/* {item?.dataPagamento ? dateTime(item?.dataPagamento) : "N/A"} */}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
                  ●
                </Typography>
                <AttachMoneyIcon
                  sx={{
                    width: "14px",
                    height: "14px",
                    color: "#444",
                  }}
                />
                <Typography
                  variant="caption"
                  component="h4"
                  sx={{
                    color: "#444",
                  }}
                  display="block"
                >
                  {item.Valor_Cobrado ? currency(item.Valor_Cobrado) : "0,00"}
                  {/* {item?.dataPagamento ? dateTime(item?.dataPagamento) : "N/A"} */}
                </Typography>
              </Grid>
              <Grid sx={{ display: "none" }} size={{ xs: 12, md: 1.7 }}>
                <Typography variant="subtitle2">
                  {item.Valor_Cobrado ? currency(item.Valor_Cobrado) : "-"}
                </Typography>
              </Grid>
              <Grid sx={{ display: "none" }} size={{ xs: 12, md: 1.7 }}>
                <Tooltip title={item.Delta}>
                  <Typography variant="subtitle2">
                    {item.Valor_Pago ? currency(item.Valor_Pago) : "-"}
                  </Typography>
                </Tooltip>

                {/* <Typography variant="caption" color="text.secondary" display="block">
                                      {item?.dataPagamento ? dateTime(item?.dataPagamento) : "N/A"}
                                      </Typography> */}
              </Grid>
              <Grid
                container
                size={{ xs: 12, md: 12 }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.865rem", color: "#666666" }}
                >
                  <CutText value={item.Paciente || "-"} contagem={35} />
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 4, md: 4 }}
                sx={{
                  // display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  display: "none",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.865rem", color: "#666666" }}
                >
                  {/* {item?.Idade || "0 idade"} */}
                </Typography>
              </Grid>
              {item?.Local && (
                <Grid
                  size={{ xs: 8, md: 8 }}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <PlaceOutlinedIcon
                    sx={{
                      width: "15px",
                      height: "15px",
                      color: "#444",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.75rem", color: "#444444" }}
                  >
                    {item?.Local || "Nome do Hospital"}
                  </Typography>
                </Grid>
              )}

              <Grid
                container
                size={{ xs: 12, md: 2.5 }}
                sx={{ display: "none" }}
              >
                <Tooltip title="Editar">
                  <Button
                    variant="contained"
                    // color="success"
                    size="small"
                    onClick={() =>
                      navigate(`?Atendimento=${item.Identifier}`, {
                        replace: true,
                      })
                    }
                    sx={{
                      // width:'30px',
                      minWidth: "initial",
                      px: 1.5,
                      fontSize: "0.75rem",
                      backgroundColor: theme.colors.primaryColor,
                      "&:hover": {
                        backgroundColor: theme.colors.secondaryColor,
                      },
                    }}
                  >
                    <EditIcon />
                    &nbsp; Editar
                  </Button>
                </Tooltip>
                <Tooltip title="Apagar">
                  <Button
                    color="error"
                    size="small"
                    sx={{
                      // width:'30px',
                      minWidth: "initial",
                      px: 1.5,
                      fontSize: "0.75rem",
                      backgroundColor: theme.colors.primaryColor,
                      "&:hover": {
                        backgroundColor: theme.colors.secondaryColor,
                      },
                    }}
                    onClick={() => handleOpenDelete(item)}
                  >
                    <DeleteForeverRoundedIcon />
                    &nbsp; Remover
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </PaperCustom>
        </motion.div>
      </Box>
    </Grid>
  );
};
