import axios, { AxiosInstance } from "axios";
import { IApiData } from "interfaces/apiData";

import { type IFavoritos } from "interfaces/favoritos";

import { baseURL, useDadosUsuarios, token_ } from "@/APIS/BaseApis";

class Api {
  user: null;
  acess_token: null;
  idUsuario: null;
  api: AxiosInstance | undefined;
  nomeUsuario: unknown;
  emailUsuario: unknown;
  roleUsuario: unknown;
  constructor() {
    this.user = null;
    this.idUsuario = null;
    this.acess_token = null;
    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    });
    this.getUserData();
  }
  async init() {
    await this.getAuthorization();
  }

  async getUserData() {
    const usuario = useDadosUsuarios;

    if (usuario !== null) {
      this.emailUsuario = usuario?.email;
      this.nomeUsuario = usuario?.full_name || "sem nome cadastrado";
      this.idUsuario = usuario?.id;
      this.roleUsuario = usuario?.role;
    }
  }

  async getAuthorization() {
    this.acess_token = token_;
  }
  async GetPendencias(): Promise<IApiData<IFavoritos> | undefined> {
    await this.getUserData();
    await this.getAuthorization();
    if (this.idUsuario !== null) {
      const response = await this.api!.get<IApiData<IFavoritos>>(
        `${baseURL}/v1/pendencies`,
        {
          headers: {
            Authorization: `Bearer ${await this.acess_token}`,
          },
        },
      ).catch(function (error) {
        return error.response;
      });
      return response?.data;
    }
  }
}

export default {
  create: async () => {
    const instance = new Api();
    await instance.init();
    return instance;
  },
};
