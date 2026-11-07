import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabaseClient";

// Cria o contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Quando o estado de autenticação muda (login, logout, etc.),
      // atualiza o estado do usuário
      setUser(session?.user || null);
      setLoading(false);
    });

    // Pega a sessão inicial do usuário
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getInitialSession();

    // Limpeza da inscrição no listener quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
