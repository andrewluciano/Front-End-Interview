import { type FC, useState } from "react";
import { Menu } from "../Componentes/Menu";

import { Outlet } from "react-router-dom";
import { Cabecalho } from "../Componentes/Cabecalho";

import { UsuarioProvider } from "@/Autenticacao/UsuarioContext";

import { Container, AreaConteudo, AreaDireita, Conteudo } from "./Styles";
import { RastroPagina } from "../Componentes/RastroPagina";

export const Tema: FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const toggleMenu = () => setOpenMenu((prev) => !prev);

  return (
    <UsuarioProvider>
      <Container container>
        <Cabecalho openMenu={openMenu} toggleMenu={toggleMenu} />

        <AreaConteudo container>
          <Menu open={openMenu} />
          <AreaDireita size={{ sm: 12, xs: 12 }} container>
            <RastroPagina />
            <Conteudo container>
              <Outlet />
            </Conteudo>
          </AreaDireita>
        </AreaConteudo>
      </Container>
    </UsuarioProvider>
  );
};
