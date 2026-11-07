import { createContext } from "react";

const UsuarioContext = createContext({});

export const UsuarioProvider = UsuarioContext.Provider;
export const UsuarioConsumer = UsuarioContext.Consumer;

export default UsuarioContext;
