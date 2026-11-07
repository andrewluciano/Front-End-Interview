import { Log, UserManager } from "oidc-client";
import axios from "axios";
import { getItem, setItem } from "../helpers/armazenamento";
import CONFIG from "config";

const settings = {
  authority: CONFIG.IS_STS_AUTHORITY,
  client_id: CONFIG.IS_CLIENT_ID,
  redirect_uri: `${CONFIG.IS_CLIENT_ROOT}signin-callback`,
  silent_redirect_uri: `${CONFIG.IS_CLIENT_ROOT}signin-callback`,
  post_logout_redirect_uri: `${CONFIG.IS_POST_LOGOUT_URL}`,
  response_type: "code",
  scope: CONFIG.IS_CLIENT_SCOPE,
};

const userManager = new UserManager(settings);

export const SigninMethods = {
  DIRECT: "0",
  SILENT: "1",
};

const chaveSignin = "signin-method";

export function getActualMethod() {
  return getItem(chaveSignin);
}

Log.logger = console;
Log.level = Log.INFO;

export function getUser(args) {
  return userManager.getUser(args);
}

export function signinRedirect(args) {
  setItem(chaveSignin, SigninMethods.DIRECT);
  return userManager.signinRedirect(args);
}

export function signinSilent(args) {
  setItem(chaveSignin, SigninMethods.SILENT);
  return userManager.signinSilent(args);
}

export function signoutRedirect(args) {
  return userManager.signoutRedirect(args);
}

export function signinRedirectCallback(url) {
  return userManager.signinRedirectCallback(url);
}

export function signinSilentCallback(url) {
  return userManager.signinSilentCallback(url);
}

export async function genericSigninCallback(url) {
  try {
    switch (getActualMethod()) {
      case SigninMethods.SILENT:
        return await signinSilentCallback(url);
      case SigninMethods.DIRECT:
        return await signinRedirectCallback(url);
      default:
        return signinRedirect();
    }
  } catch (error) {
    return signinRedirect();
  }
}

export async function obtemDadosDeAcesso() {
  // const url = `${CONFIG.API_BASE_URL}/acesso/loga`;
  const url = `${CONFIG.API_REMODELING_URL}/user-api/api/acesso/login`;
  return axios.get(url).then((response) => {
    if (response && response.data) {
      const dados = response.data.data;

      return {
        idPessoaCedente: dados.idUsuario,
        idCedente: dados.idEmpresa,
        cnpj: dados.cnpj,
        colaboradores: dados.colaboradores,
        idGrupo: dados.idGrupo,
      };
    }

    return {};
  });
}

export default {
  getUser,
  signinRedirect,
  signinSilent,
  signoutRedirect,
  signinRedirectCallback,
  signinSilentCallback,
};
