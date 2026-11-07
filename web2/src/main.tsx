import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// import { Operacoes } from "./Paginas/Operacoes";
import { Pacientes } from "./Paginas/Pacientes";
import { Procedimentos } from "./Paginas/Procedimentos";
import { Consultas } from "./Paginas/Consultas";
import { Medicos } from "./Paginas/Medicos";
// import { DetalheOperacao } from "./Paginas/Operacoes/DetalheOperacao";
import { NaoExiste } from "./Paginas/404";

import { QueryClientProvider } from "react-query";
import { queryClient } from "./helpers/queryClient";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme";

import { Tema } from "./Tema";
import { ActionLogin, Login, LoginNovaSenha } from "./Paginas/Login";
import { LogoutSession } from "./Paginas/Logout";
import { Perfil } from "./Paginas/Perfil";

import { ModalProvider } from "./Autenticacao/ModalContext";
import { ProtectedRoute } from "./Tema/ProtectedRoute";

import { AuthProvider } from "@/Autenticacao/AuthContext";
import { ModalDefault } from "./Componentes/Modal";
import { DashboardMedico } from "./Paginas/DashboardMedico";
import { Configuracoes } from "./Paginas/Configuracoes";

import "./APIS/AxioInterceptors";
import { OnboardingForm } from "./Paginas/OnBoarding/OnboardingForm";
import { Conciliacao } from "./Paginas/Conciliacao";
import { Relatorios } from "./Paginas/Relatorios";
import { GerenciadorArquivos } from "./Paginas/GerenciadorArquivos";
import Clarity from "@microsoft/clarity";

const projectId = "vpj5933n1k";
Clarity.init(projectId);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="bottom-right" />
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Tema />
                    </ProtectedRoute>
                  }
                >
                  {/* <Route path="Dashboard" element={<Dashboard />} /> */}
                  <Route
                    path="Dashboard-Medico"
                    element={<DashboardMedico />}
                  />

                  {/* <Route path="Operacoes" element={<Operacoes />} /> */}
                  <Route
                    path="Consultas"
                    element={
                      <Consultas
                        DadosSelecionados={[]}
                        Close={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                      />
                    }
                  />
                  <Route
                    path="Procedimentos"
                    element={
                      <Procedimentos
                        DadosSelecionados={[]}
                        Close={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                      />
                    }
                  />
                  <Route path="Pacientes" element={<Pacientes />} />
                  <Route path="Perfil" element={<Perfil />} />
                  <Route path="Conciliacao" element={<Conciliacao />} />
                  <Route path="Historico" element={<Relatorios />} />
                  <Route
                    path="Gerenciador-de-Arquivos"
                    element={<GerenciadorArquivos />}
                  />
                  <Route path="Medicos" element={<Medicos />} />
                  <Route path="Configuracoes" element={<Configuracoes />} />
                  {/* <Route
                    path="Operacoes/operacao-detalhe"
                    element={<DetalheOperacao />}
                  /> */}
                </Route>
                <Route path="Logout" element={<LogoutSession />} />
                <Route index path="/" element={<Login />} />
                <Route index path="/nova-senha" element={<LoginNovaSenha />} />
                <Route path="Onboarding" element={<OnboardingForm />} />

                <Route index path="ActionLogin" element={<ActionLogin />} />
                <Route path="*" element={<NaoExiste />} />
              </Routes>
              <ModalDefault />
            </QueryClientProvider>
          </ThemeProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
