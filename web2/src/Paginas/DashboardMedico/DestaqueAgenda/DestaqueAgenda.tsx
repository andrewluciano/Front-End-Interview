import { type FC, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { ItemDestaqueAgenda } from "./Componentes/";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import ImgSemResultados from "@/assets/imagens/undraw_empty_4zx0.svg";
import LinearProgress from "@mui/material/LinearProgress";

import { Box, TextField, InputAdornment, Popover, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { theme } from "@/stitches.config";

import { useQuery } from "react-query";
import Api from "../API/Home";
import { SelectTipos } from "./Componentes/SelectTipos";
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export const DestaqueAgenda: FC = () => {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [Tipo, setSelectedTipo] = useState();
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>([]);

  const ListaHome = useQuery(
    ["ListaHome"],
    async () => {
      const payload = { Tipo };
      const apiInstance = await Api.create();
      const response = await apiInstance.GetListaHome(payload);
      return response;
    },
    { keepPreviousData: true },
  );

  const isFetching = ListaHome.isLoading;

  const hasContentLIstaHome = ListaHome?.data?.content ?? []; // Content?.content //

  // Filter Logic
  const filteredData = hasContentLIstaHome.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const PaymentSkeleton = () => (
    <Grid
      container
      size={{ sm: 12 }}
      sx={{ height: "180px", alignContent: "center", justifyContent: "center" }}
    >
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </Grid>
  );

  const [anchorElAdicionar, setAnchorElAdicionar] = useState(null);

  const handleClickAdicionar = (event) => {
    setAnchorElAdicionar(event.currentTarget);
  };

  const handleCloseAdicionar = () => {
    setAnchorElAdicionar(null);
  };
  const openAdicionar = Boolean(anchorElAdicionar);
  const id = openAdicionar ? "simple-popover" : undefined;

  const [anchorElOpcoes, setAnchorElOpcoes] = useState(null);

  const handleClickOpcoes = (event) => {
    setAnchorElOpcoes(event.currentTarget);
  };

  const handleCloseOpcoes = () => {
    setAnchorElOpcoes(null);
  };
  const openOpcoes = Boolean(anchorElOpcoes);
  const idOpcoes = openOpcoes ? "simple-popover" : undefined;

  const handleChangeTipo = (event) => {
    const value =
      event.target.value === "todos" ? undefined : event.target.value;
    setSelectedTipo(value);
  };

  const { refetch } = ListaHome;

  useEffect(() => {
    refetch();
  }, [Tipo, refetch]);

  return (
    <>
      <Grid
        container
        size={{ md: 12, xs: 12 }}
        sx={{
          overflowX: "auto",
          flexDirection: "column",
          flexGrow: "2",
          flexWrap: "nowrap",
          gap: "0px",
          borderRadius: "0px",
        }}
      >
        <Grid container sx={{display: "none"}}  size={{ sm: 12, xs: 12 }} spacing={0.5}>
          <Grid container size={{ sm: 6.1, xs: 5.7 }}>
            <SelectTipos change={handleChangeTipo} />
          </Grid>
          <Grid container size={{ sm: 5, xs: 4 }}>
            <Button
              variant="outlined"
              startIcon={
                <CalendarTodayIcon sx={{ width: "14px", height: "14px" }} />
              }
              sx={{
                borderRadius: "4px",
                boxShadow: "1",
                border: "none",
                backgroundColor: "#fff",
                lineHeight: "0",
                justifyContent: "flex-start",
                color: "#333",
                width: "100%",
              }}
            >
              Semana
            </Button>
          </Grid>
          <Grid container size={{ sm: 0.7, xs: 2.12 }}>
            <Button
              size={"small"}
              sx={{
                height: "55px",
                width: "50px !important",
                fontSize: "2rem",
                lineHeight: "1rem",
                borderRadius: "4px",
                boxShadow: "1",
                fontWeight: "bold",
                backgroundColor: `${theme.colors.primaryColor} !important`,
              }}
              aria-describedby={id}
              onClick={handleClickAdicionar}
            >
              <AddIcon sx={{ color: "#fff", width: "30px", height: "30px" }} />
            </Button>
            <Popover
              id={id}
              open={openAdicionar}
              anchorEl={anchorElAdicionar}
              onClose={handleCloseAdicionar}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                borderRadius: "4px",
                boxShadow: "1",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  borderRadius: "4px",
                  boxShadow: "1",
                  py: "10px",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#333",
                  width: "100%",
                  textAlign: "left",
                  justifyContent: "flex-end",
                }}
                variant="outlined"
                onClick={() =>
                  navigate("?AdicionarAtendimentoUpload", { replace: true })
                }
              >
                Upload de Arquivo
              </Button>
              <Button
                sx={{
                  display: "flex",
                  borderRadius: "4px",
                  boxShadow: "1",
                  py: "10px",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#333",
                  width: "100%",
                  textAlign: "left",
                  justifyContent: "flex-end",
                }}
                variant="outlined"
                onClick={() =>
                  navigate("?AdicionarAtendimentoManual", { replace: true })
                }
              >
                Procedimento Manual
              </Button>
            </Popover>
          </Grid>
          <Grid container size={{ sm: 2.12, xs: 1 }}>
            <Button
              size={"small"}
              sx={{
                height: "55px",
                width: { sm: "55px", xs: "25px" },
                maxWidth: "55px !important",
                minWidth: "initial !important",
                padding: "0px 0px 0px 0px !important",
                fontWeight: "bold",
                boxShadow: "1",
                backgroundColor: "#dfdfdf",
                display: "none",
              }}
              aria-describedby={idOpcoes}
              onClick={handleClickOpcoes}
            >
              <MoreVertIcon
                sx={{
                  color: "#333",
                  width: "25px",
                  height: "35px",
                  margin: "0",
                }}
              />
            </Button>
            <Popover
              id={idOpcoes}
              open={openOpcoes}
              anchorEl={anchorElOpcoes}
              onClose={handleCloseOpcoes}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                borderRadius: "4px",
                boxShadow: "1",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  borderRadius: "4px",
                  boxShadow: "1",
                  py: "10px",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#333",
                  width: "100%",
                  textAlign: "left",
                  justifyContent: "flex-end",
                }}
                variant="outlined"
                onClick={() =>
                  navigate("?AdicionarAtendimentoUpload", { replace: true })
                }
              >
                Excluir Tudo
              </Button>
              <Button
                sx={{
                  display: "flex",
                  borderRadius: "4px",
                  boxShadow: "1",
                  py: "10px",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#333",
                  width: "100%",
                  textAlign: "left",
                  justifyContent: "flex-end",
                }}
                variant="outlined"
                onClick={() =>
                  navigate("?AdicionarAtendimentoManual", { replace: true })
                }
              >
                Excluir Selecionados
              </Button>
            </Popover>
          </Grid>
        </Grid>



        <Grid container size={{ xs: 12, sm: 12 }} spacing={1.2}>
          <PendingActionsIcon size={26} weight="fill" />
          <Typography variant="h6">Pendentes</Typography>
        </Grid>

        {isFetching && <PaymentSkeleton />}
        {!isFetching && (
          <Grid
            size={{ xs: 12, sm: 12 }}
            sx={{ overflowX: "auto", pb: 1, pt: 1 }}
          >
            <Grid
              container
              size={{ xs: 12, sm: 12 }}
              spacing={1}
              // sx={{ boxSizing: "border-box", pb: 1 }}
            >
              <Grid container size={{ xs: 12, sm: 6 }} sx={{ display: "none" }}>
                <TextField
                  placeholder="Pesquisar"
                  variant="outlined"
                  value={searchTerm}
                  size="small"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    mb: 0,
                    backgroundColor: "#fff",
                    p: 0,
                    width: "100%",
                    borderRadius: "5px",
                    fontSize: `${theme.fontSizes[14]} !important`,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* <Grid
                container
                size={{ xs: 12, sm: 6 }}
                justifyContent={"flex-end"}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Button
                  variant="contained"
                  sx={{ px: 3, py: 2.4, height: "30px" }}
                  onClick={() => navigate("?AdicionarAtendimentoManual")}
                  size="small"
                >
                  Adicionar novo Procedimento Manual
                </Button>
              </Grid> */}
            </Grid>

            {/* Header */}
            <Grid container sx={{ px: 1, display: { xs: "none", md: "none" } }}>
              <Grid size={{ xs: 2.9 }}>
                <Typography variant="caption" color="text.secondary">
                  Paciente
                </Typography>
              </Grid>
              <Grid size={{ xs: 1.6 }}>
                <Typography variant="caption" color="text.secondary">
                  Procedimento
                </Typography>
              </Grid>
              <Grid size={{ xs: 1.7 }}>
                <Typography variant="caption" color="text.secondary">
                  Valor Cobrado
                </Typography>
              </Grid>
              <Grid size={{ xs: 1.7 }}>
                <Typography variant="caption" color="text.secondary">
                  Valor Pago
                </Typography>
              </Grid>
              <Grid size={{ xs: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
              </Grid>
            </Grid>

            {/* List */}
            <Grid
              container
              size={{ xs: 12 }}
              sx={{
                overflowX: { xs: "visible", sm: "auto" },
                maxHeight: { xs: "none", sm: "calc(100vh - 382px)" },
                padding: "0 3px",
              }}
            >
              <Grid container spacing={"10px"} size={{ xs: 12, sm: 12 }}>
                {filteredData.length > 0 &&
                  filteredData.map((item) => (
                    <ItemDestaqueAgenda
                      key={item.id}
                      item={item}
                      selectedIdentifiers={selectedIdentifiers}
                      setSelectedIdentifiers={setSelectedIdentifiers}
                    />
                  ))}

                {filteredData.length <= 0 && (
                  <Grid
                    container
                    size={{ xs: 12, sm: 12 }}
                    justifyContent="center"
                  >
                    <Grid
                      container
                      sx={{
                        backgroundColor: "background.paper",
                        p: 2,
                        borderRadius: "4px",
                        boxShadow: "1",
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
                        justifyContent="center"
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#333",
                            fontSize: `${theme.fontSizes[20]} !important`,
                          }}
                        >
                          Sem Dados Encontrados
                        </Typography>
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
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};
