import { type FC } from "react";
import { useLocation } from "react-router-dom"; // Importe useLocation do react-router-dom
import { getItem } from "@/helpers/armazenamento";
import GroupIcon from "@mui/icons-material/Group";
type UserRole = "admin" | "medico" | "user" | null;

// import Logo from "@/assets/imagens/Logo/simbolo.svg?url";
// import stethoscope from "@/assets/imagens/icones/stethoscope.svg?url";

import { Container } from "./Styles";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Icones
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import HandshakeIcon from "@mui/icons-material/Handshake";
// import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { Ambulance, Files, Stethoscope } from "@phosphor-icons/react";

import LogoutIcon from "@mui/icons-material/Logout";
import { Tooltip } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

interface MenuProps {
  open: boolean;
}

export const Menu: FC<MenuProps> = ({ open }) => {
  const USER_ROLE: UserRole = getItem("role");
  const location = useLocation();
  const currentPath = location.pathname;

  const isSelected = (href: string) => {
    return currentPath.toLowerCase() === href.toLowerCase();
  };

  return (
    <Container open={open} sx={{ boxShadow: "0px 10px 10px #dfdfdf" }}>
      <MenuList variant="menu">
        {/* {USER_ROLE !== "medico" && USER_ROLE !== "user" && (
          <Tooltip
            title="Dashboard"
            placement="right"
            disableHoverListener={open}
          >
            <MenuItem
              component="a"
              selected={isSelected("/Dashboard")}
              href="/Dashboard"
              sx={{ justifyContent: "center", height: "55px" }}
            >
              <ListItemIcon
                sx={{
                  padding: "0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DashboardIcon />
              </ListItemIcon>
              {open && <ListItemText>Dashboard</ListItemText>}
            </MenuItem>
          </Tooltip>
        )} */}

        <Tooltip
          title="Dashboard Médico"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            selected={isSelected("/Dashboard-Medico")}
            href="/Dashboard-Medico"
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText>Dashboard Médico</ListItemText>}
          </MenuItem>
        </Tooltip>

        {/* <Tooltip
          title="Consultas"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            selected={isSelected("/Consultas")}
            href="/Consultas"
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GroupIcon size={26} weight="fill" />
            </ListItemIcon>
            {open && <ListItemText>Consultas</ListItemText>}
          </MenuItem>
        </Tooltip> */}

        {/* <Tooltip
          title="Procedimentos"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            selected={isSelected("/Procedimentos")}
            href="/Procedimentos"
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ambulance size={26} weight="fill" />
            </ListItemIcon>
            {open && <ListItemText>Procedimentos</ListItemText>}
          </MenuItem>
        </Tooltip> */}

        <Tooltip
          title="Conciliação"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            selected={isSelected("/Conciliacao")}
            href="/Conciliacao"
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <MedicalServicesIcon /> */}
              <HandshakeIcon size={26} weight="fill" />
            </ListItemIcon>
            {open && <ListItemText>Conciliação</ListItemText>}
          </MenuItem>
        </Tooltip>

        <Tooltip
          title="Gestão de Arquivos"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            selected={isSelected("/Gerenciador-de-arquivos")}
            href="/Gerenciador-de-arquivos"
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Files size={26} weight="fill" />
            </ListItemIcon>
            {open && <ListItemText>Arquivos</ListItemText>}
          </MenuItem>
        </Tooltip>
        {/* 
        <Tooltip
          title="Pacientes"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            href="/Pacientes"
            selected={isSelected("/Pacientes")}
            sx={{ justifyContent: "center", height: "55px"}}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EmojiPeopleIcon />
            </ListItemIcon>
            {open && <ListItemText>Pacientes</ListItemText>}
          </MenuItem>
        </Tooltip>

        <Tooltip title="Médicos" placement="right" disableHoverListener={open}>
          <MenuItem
            component="a"
            href="/Medicos"
            selected={isSelected("/Medicos")}
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              
              <Stethoscope size={22} weight="bold" />
            </ListItemIcon>
            {open && <ListItemText>Médicos</ListItemText>}
          </MenuItem>
        </Tooltip>

        <Tooltip
          title="Configurações"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            href="/configuracoes"
            selected={isSelected("/configuracoes")}
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingsIcon size={22} weight="bold" />
            </ListItemIcon>
            {open && <ListItemText>Configurações</ListItemText>}
          </MenuItem>
        </Tooltip> */}

        <Tooltip
          title="Relatórios"
          placement="right"
          disableHoverListener={open}
        >
          <MenuItem
            component="a"
            href="/relatorios"
            selected={isSelected("/relatorios")}
            sx={{ justifyContent: "center", height: "55px" }}
          >
            <ListItemIcon
              sx={{
                padding: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QueryStatsIcon size={22} weight="bold" />
            </ListItemIcon>
            {open && <ListItemText>Relatórios</ListItemText>}
          </MenuItem>
        </Tooltip>

        {open && (
          <MenuItem className="versao">
            versão v{import.meta.env.VITE_VERSION}
          </MenuItem>
        )}
        <MenuItem
          component="a"
          href="/Logout"
          sx={{ justifyContent: "center", height: "55px" }}
        >
          <ListItemIcon
            sx={{
              padding: "0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          {open && <ListItemText>sair</ListItemText>}
        </MenuItem>
      </MenuList>
    </Container>
  );
};
