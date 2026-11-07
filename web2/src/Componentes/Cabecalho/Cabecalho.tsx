/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import FingerprintIcon from "@mui/icons-material/Fingerprint";
import LogoutIcon from "@mui/icons-material/Logout";
import { getItem } from "@/helpers/armazenamento";
import {
  Badge,
  Button,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";

import HandshakeIcon from "@mui/icons-material/Handshake";

import Logo2 from "@/assets/imagens/Logo/logo-fatura-viva.svg?url";

import { MenuCabec } from "./Componetes/MenuCabec";

import { Container } from "./Styles";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { Files } from "@phosphor-icons/react";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import { Pendencias } from "@/Componentes/Pendencias";

import { useModal } from "@/Autenticacao/ModalContext";
// import { ProcedimentosVivIA } from "@/Paginas/Procedimentos/ProcedimentosVivIA";
import { ModalUploadArquivos } from "@/Componentes/ModalUploadArquivos";
import { Escolha } from "@/Paginas/Procedimentos/Escolha";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { OnboardingForm } from "@/Paginas/OnBoarding/OnboardingForm";
import { useSearchParams } from "react-router-dom";
import { CreditosCabecalho } from "../CreditosCabecalho";
import { MenuAdicionar } from "./Componetes/MenuAdicionar";
import { AdicionarConsulta } from "@/Paginas/Consultas/AdicionarConsulta";
import { CutText } from "@/Componentes/CutText";

// import { dateTime } from "@/helpers/format";

// import { Link } from "react-router-dom";

interface CabecalhoProps {
  openMenu: boolean;
  toggleMenu: () => void;
}

export const Cabecalho: FC<CabecalhoProps> = ({ openMenu, toggleMenu }) => {
  const [value, setValue] = useState(0);
  const [pendencias, setpendencias] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dadosPendencias: unknown = [];
  // const dadosPendencias = useQuery(
  //   ["dadosPendencias"],
  //   async () => {
  //       const apiInstance = await Api.create();
  //       const response = await apiInstance.GetPendencias();
  //     return response;
  //   },
  //   { keepPreviousData: true, refetchInterval: 90 * 1000 },
  // );
  const isFetching = dadosPendencias?.isLoading || false;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !isFetching && setpendencias(dadosPendencias?.data?.length || 0);
  }, [dadosPendencias, isFetching]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    localStorage.setItem("menuOpen", event.currentTarget.toString());
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { openModal } = useModal();

  const handleOpenProductModal = () => {
    const modalContent = <ModalUploadArquivos />;
    const TituloModal = "Upload de Arquivos";
    const SubTituloModal = "Selecione os arquivos para upload";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleClickOnBoarding = () => {
    const modalContent = <OnboardingForm />;
    const TituloModal = "Complete seu Cadastro";
    const SubTituloModal = "Alguns dados básicos para começar";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleClickEscolha = () => {
    const modalContent = <Escolha />;
    const TituloModal = "Novo Procedimento";
    const SubTituloModal = "Você pode escolher o modo de subir o procedimento";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  const handleClicka = () => {
    const modalContent = <Pendencias />;
    const TituloModal = "Pendências";
    const SubTituloModal = "Itens pendentes e notificações";
    openModal(modalContent, TituloModal, SubTituloModal);
  };

  // Acoes e Itens de Modais
  const handleOpenProductModalAdicionar = () => {
    const modalContent = <AdicionarConsulta />;
    const TituloModal = "Novo Procedimento";
    const SubTituloModal = "Novo Procedimento Manual";
    openModal(modalContent, TituloModal, SubTituloModal);
  };
  const handleOpenProductModalAdicionarUpload = () => {
    openModal(
      <ModalUploadArquivos />,
      "Upload de Arquivos",
      "Selecione os arquivos para upload",
    );
  };

  const getDadosUsers = () => {
    return JSON.parse(getItem("dados_users") || "{}");
  };

  useEffect(() => {
    if (searchParams.has("onBoarding")) {
      handleClickOnBoarding();
    }
    if (searchParams.has("AdicionarAtendimentoManual")) {
      handleOpenProductModalAdicionar();
    }
    if (searchParams.has("AdicionarAtendimentoUpload")) {
      handleOpenProductModalAdicionarUpload();
    }
  }, [searchParams]);

  // Ações do Menu Adicionar
  const [openAdicionar, setOpenAdicionar] = useState(false);

  const handleClickOpenAdicionar = () => {
    setOpenAdicionar(true);
  };

  const handleCloseAdicionar = (value) => {
    setOpenAdicionar(false);
  };

  return (
    <Container>
      <Grid
        container
        size={{ sm: 12, xs: 12 }}
        sx={{
          height: "63px",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Grid
          size={{ sm: 0.7, xs: 1.5 }}
          direction={"row"}
          sx={{
            padding: "0",
            display: { md: "none", xs: "none" },
          }}
        >
          <Button
            onClick={toggleMenu}
            sx={{
              borderRadius: "0",
              maxWidth: "56px",
              height: "100%",
              flexWrap: "nowrap",
              padding: "2.8px 0px 2.8px 0px",
              display: { md: "flex", xs: "flex" },
            }}
            aria-controls={openMenu ? "menu" : undefined}
            aria-expanded={openMenu ? "true" : undefined}
            aria-haspopup="true"
          >
            <MenuRoundedIcon
              sx={{ position: "relative", margin: "0", left: "-3px" }}
            />
          </Button>
        </Grid>
        <Grid
          container
          size={{ sm: 1.8, xs: 10.5 }}
          sx={{
            justifyContent: { xs: "flex-start", sm: "center" },
            pl: "20px",
          }}
        >
          <img
            src={Logo2}
            alt=""
            onClick={() => navigate("/Dashboard-Medico")}
            width="120px"
            style={{ position: "relative", top: "1px", cursor: "pointer" }}
          />
        </Grid>

        <Grid
          size={{ sm: 7.6, xs: 4.5 }}
          sx={{ display: { md: "flex", xs: "none" }, }}
          direction={"row"}
        >
          <MenuCabec />
        </Grid>

        <Grid
          size={{ sm: 2.5, xs: 1.5 }}
          sx={{
            gap: "10px",
            flexDiretion: "row",
            justifyContent: "flex-end",
            textAlign: "center",
            alignItems: "center",
          }}
        >
            <Grid container size={{sm:12, xs:12}}>
              <Grid container size={{sm:10, xs:10}} sx={{px:1, lineHeight:'0px', display: { xs: "none", md: "flex" }}}>
                <Typography component="p" variant="body2" sx={{width:'100%', textAlign:'right', fontWeight:'600', p:0, fontSize:'0.8125rem', height:'16px', color:'#3e5935'}}>
                  <CutText
                    value={getDadosUsers()?.full_name || "Sem nome Cadastrado"} contagem="22"
                  />
                </Typography>
                <Typography component="p" variant="caption" sx={{width:'100%', textAlign:'right',  fontSize:'0.68rem', color:'#999', height:'16px',}}>
                  {getDadosUsers()?.email}
                </Typography>
              </Grid>
              <Grid container size={{sm:2, xs:2}}>
                <Button
                  id="basic-button"
                  aria-controls={anchorEl ? "MenuPerfil" : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? "true" : undefined}
                  onClick={handleClick}
                  sx={{ maxWidth: "30px", minWidth: "auto", p: "0" }}
                >

                      <Avatar
                        alt={getDadosUsers()?.full_name || "Sem nome Cadastrado"}
                        src="https://andrewluciano.com.br/imagens/eu-2.png"
                        sx={{ width: 30, height: 30 }}
                      />
                    


                </Button>
              </Grid>
            </Grid>         


          <Menu
            id="MenuPerfil"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
            sx={{
              svg: { color: "#333" },
              "li:hover, a:hover": { backgroundColor: "#dfdfdf" },
              "li:hover svg, a:hover svg": { color: "#333" },
            }}
          >
            <MenuItem
              sx={{ flexDirection: "column", alignItems: "flex-start", display: { md: "none", xs: "flex" } }}
            >
              <Typography
                sx={{ fontSize: "0.875rem", letterSpacing: "0" }}
                variant="caption"
              >
                {getDadosUsers()?.full_name || "Sem nome Cadastrado"}
              </Typography>
              <Typography
                sx={{ fontSize: "0.775rem", letterSpacing: "0" }}
                color="textDisabled"
                variant="caption"
              >
                {getDadosUsers()?.email}
              </Typography>
            </MenuItem>

            <Divider sx={{ marginBottom:'0 !important', display: { md: "none", xs: "flex" } }} />

            <MenuItem sx={{ backgroundColor: "#d9f99d", mt:0 }}>
              <CreditosCabecalho />
            </MenuItem>

            <Divider sx={{ marginTop: "0 !important" }} />

            <MenuItem
              component="a"
              href="/Perfil"
              onClick={handleClose}
              sx={{ gap: "5px" }}
            >
              <FingerprintIcon sx={{ height: "18px" }} />{" "}
              <Typography
                sx={{ fontSize: "0.875rem", letterSpacing: "0" }}
                variant="caption"
              >
                Meu Perfil
              </Typography>
            </MenuItem>
            <MenuItem
              component="a"
              href="/Logout"
              onClick={handleClose}
              sx={{ gap: "5px" }}
            >
              <LogoutIcon sx={{ height: "18px", color: "red" }} />{" "}
              <Typography
                sx={{ fontSize: "0.875rem", letterSpacing: "0" }}
                variant="caption"
              >
                Sair
              </Typography>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          zIndex: 1000,
          borderTop: "1px solid green",
          display: { xs: "flex", md: "none" },
        }}
      >
        <BottomNavigationAction
          sx={{ gap: "3px !important" }}
          onClick={handleClickOpenAdicionar}
          label="Adicionar"
          icon={<AddBoxIcon sx={{ cursor: "pointer" }} />}
        />
        <BottomNavigationAction
          sx={{ gap: "3px !important" }}
          onClick={() => navigate("/Conciliacao")}
          label="Conciliação"
          icon={<HandshakeIcon sx={{ cursor: "pointer" }} />}
        />
        <BottomNavigationAction
          sx={{ gap: "3px !important" }}
          onClick={() => navigate("/Gerenciador-de-arquivos")}
          label="Arquivos"
          icon={<Files size={24} />}
        />
        {/* <BottomNavigationAction
          sx={{ gap: "3px !important" }}
          onClick={() => navigate("/Perfil")}
          label={
            <Avatar
              alt={getDadosUsers()?.full_name || "Sem nome Cadastrado"}
              src="https://andrewluciano.com.br/imagens/eu-2.png"
              sx={{ width: 30, height: 30 }}
            />
          }
        /> */}
        <BottomNavigationAction
          sx={{ gap: "3px !important" }}
          onClick={toggleMenu}
          label=""
          icon={
            <MenuRoundedIcon
              sx={{ position: "relative", margin: "0", left: "-3px" }}
            />
          }
        />
      </BottomNavigation>

      {/* Conteudo Menu Adicionar Mobile */}
      <MenuAdicionar open={openAdicionar} onClose={handleCloseAdicionar} />
    </Container>
  );
};
