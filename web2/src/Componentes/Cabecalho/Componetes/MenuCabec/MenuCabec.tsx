import { type FC } from "react";
import { useLocation } from "react-router-dom"; // Importe useLocation do react-router-dom
import { getItem } from "@/helpers/armazenamento";

type UserRole = "admin" | "medico" | "user" | null;

import { Container } from "./Styles";
import { Grid, Typography } from "@mui/material";

export const MenuCabec: FC = () => {
  const USER_ROLE: UserRole = getItem("role");
  const location = useLocation();
  const currentPath = location.pathname;

  const isSelected = (href: string) => {
    return currentPath.toLowerCase() === href.toLowerCase();
  };

  return (
    <Container container>
      <Typography
        component="a"
        variant="body2"
        // selected={isSelected("/Dashboard-Medico")}
        href="/Dashboard-Medico"
        sx={{}}
        className={isSelected("/Dashboard-Medico") ? "selected" : ""}
      >
        Dashboard
      </Typography>

      <Typography
        component="a"
        variant="body2"
        // selected={isSelected("/Conciliacao")}
        href="/Conciliacao"
        className={isSelected("/Conciliacao") ? "selected" : ""}
        sx={{}}
      >
        Conciliação
      </Typography>

      <Typography
        component="a"
        variant="body2"
        // selected={isSelected("/Conciliacao")}
        href="/Gerenciador-de-arquivos"
        className={isSelected("/Gerenciador-de-arquivos") ? "selected" : ""}
        sx={{}}
      >
        Arquivos
      </Typography>
      <Typography
        component="a"
        variant="body2"
        // selected={isSelected("/Conciliacao")}
        href="/historico"
        className={isSelected("/historico") ? "selected" : ""}
        sx={{}}
      >
        Histórico
      </Typography>
    </Container>
    // <MenuList variant="menu" sx={{flexDirection:'row'}}>

    //   <Tooltip
    //     title="Dashboard Médico"
    //     placement="right"
    //     disableHoverListener={open}
    //   >
    //     <MenuItem
    //       component="a"
    //       selected={isSelected("/Dashboard-Medico")}
    //       href="/Dashboard-Medico"
    //       sx={{ justifyContent: "center", height: "55px" }}
    //     >
    //       <ListItemText>Dashboard Médico</ListItemText>
    //     </MenuItem>
    //   </Tooltip>

    //   <Tooltip
    //     title="Conciliação"
    //     placement="right"
    //     disableHoverListener={open}
    //   >
    //     <MenuItem
    //       component="a"
    //       selected={isSelected("/Conciliacao")}
    //       href="/Conciliacao"
    //       sx={{ justifyContent: "center", height: "55px" }}
    //     >
    //       <ListItemText>Conciliação</ListItemText>
    //     </MenuItem>
    //   </Tooltip>

    //   <Tooltip
    //     title="Gestão de Arquivos"
    //     placement="right"
    //     disableHoverListener={open}
    //   >
    //     <MenuItem
    //       component="a"
    //       selected={isSelected("/Gerenciador-de-arquivos")}
    //       href="/Gerenciador-de-arquivos"
    //       sx={{ justifyContent: "center", height: "55px" }}
    //     >
    //       <ListItemText>Arquivos</ListItemText>
    //     </MenuItem>
    //   </Tooltip>

    //   <Tooltip
    //     title="Relatórios"
    //     placement="right"
    //     disableHoverListener={open}
    //   >
    //     <MenuItem
    //       component="a"
    //       href="/relatorios"
    //       selected={isSelected("/relatorios")}
    //       sx={{ justifyContent: "center", height: "55px" }}
    //     >
    //       <ListItemText>Relatórios</ListItemText>
    //     </MenuItem>
    //   </Tooltip>

    //   {/* {open && (
    //     <MenuItem className="versao">
    //       versão v{import.meta.env.VITE_VERSION}
    //     </MenuItem>
    //   )} */}
    //   {/* <MenuItem
    //     component="a"
    //     href="/Logout"
    //     sx={{ justifyContent: "center", height: "55px" }}
    //   >
    //     <ListItemText>sair</ListItemText>
    //   </MenuItem> */}
    // </MenuList>
  );
};
