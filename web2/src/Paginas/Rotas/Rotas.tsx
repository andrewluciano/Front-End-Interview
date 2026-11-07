import { type FC } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from "../Dashboard";
import { Operacoes } from "../Operacoes";
import { Pacientes } from "../Pacientes";
import { Medicos } from "../Medicos";
import { DetalheOperacao } from "../Operacoes/DetalheOperacao";
import { NaoExiste } from "../404";
import { Tema } from "../../Tema";
import { Login } from "../Login";
import { LogoutSession } from "../Logout";
import { Perfil } from "../Perfil";

export const Rotas: FC = (historico) => {
  console.log("Rotas", historico);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tema />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Operacoes" element={<Operacoes />} />
          <Route path="Pacientes" element={<Pacientes />} />
          <Route path="Perfil" element={<Perfil />} />
          <Route path="Medicos" element={<Medicos />} />
          <Route path="Logout" element={<LogoutSession />} />
          <Route
            path="Operacoes/operacao-detalhe"
            element={<DetalheOperacao />}
          />
        </Route>

        <Route index path="/" element={<Login />} />
        <Route path="*" element={<NaoExiste />} />
      </Routes>
    </BrowserRouter>
  );
};

// import {
//   Pagina404,
//   PaginaHome,
//   PaginaLogout,
//   PaginaTodasNegociacoes,
// } from 'paginas';

// import { Layout } from 'componentes/Layout';
// import { Navigation } from 'componentes/Navigation';

// const PaginaRoteamento = ({ historico, match, ...rest }) => {
//   const usuario = useContext(UsuarioContext);
//   const location = useLocation();
//   const background = location?.state?.background;

//   // Sem usuario carregado, nada de roteamento
//   if (usuario === null) return '';

//   return (
//     <Router history={historico}>
//       <Navigation history={historico} />

//       <Layout>
//         <Switch location={background || location}>
//           <Route path="/" component={PaginaHome} exact {...rest} />
//           <Route path="/logout" component={PaginaLogout} exact />
//           <Route path="/negociacoes" component={PaginaTodasNegociacoes} />
//           <Route path="" component={Pagina404} />
//         </Switch>
//       </Layout>
//     </Router>
//   );
// };

// export default PaginaRoteamento;
