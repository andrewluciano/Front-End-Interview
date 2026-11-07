import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
import { type IListaHospitais } from "interfaces/ListaHospitais";

import { baseURL, useDadosUsuarios, token_ } from "@/APIS/BaseApis";

class Api {
  acess_token: string | null;
  idUsuario: null;
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
    this.idUsuario = null;
    this.acess_token = null;
    this.api = axios.create({
      baseURL,
      headers: {},
    });
    this.getUserData();
  }

  async init() {
    await this.getAuthorization();
  }

  async getUserData() {
    const usuario = useDadosUsuarios;

    if (usuario !== null) {
      this.idUsuario = usuario?.id;
      this.roleUsuario = usuario?.role;
    }
  }

  async getAuthorization() {
    this.acess_token = token_;
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${this.acess_token}`;
    }
  }

  async GetHospitais(): Promise<IApiData<IListaHospitais> | undefined> {
    if (!this.acess_token) {
      await this.getAuthorization();
    }

    const response = await this.api!.get("settings/unity", {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      console.error("Error:", error);
    });
    return response?.data;
  }
}

export default {
  create: async () => {
    const instance = new Api();
    await instance.init();
    return instance;
  },
};
