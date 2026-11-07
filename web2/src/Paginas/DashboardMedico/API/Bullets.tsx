import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { getItem } from "@/helpers/armazenamento";

import { baseURL, useDadosUsuarios } from "@/APIS/BaseApis";

import {
  IListaBullets,
  IListaAppointments,
  IListaPendencias,
} from "./Interfaces";

class Api {
  user: null;
  acess_token: string | null; // Alterei para string ou null
  idUsuario: null;
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
    this.user = null;
    this.idUsuario = null;
    this.acess_token = getItem("auth-token");
    this.api = axios.create({
      baseURL,
      headers: {},
    });
    this.getUserData();
  }

  async init() {
    // Carrega o token
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
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${await this.acess_token}`;
    }
  }

  async GetDashboardMedicoBullets(): Promise<
    IApiData<IListaBullets> | undefined
  > {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaBullets>>(
      `/v2/bullets`,
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

  async GetDashboardMedicoPendencies(): Promise<
    IApiData<IListaPendencias> | undefined
  > {
    // await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaPendencias>>(
      `/v1/pendencies`,
    ).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async GetDashboardMedicoAppointments(): Promise<
    IApiData<IListaAppointments> | undefined
  > {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaAppointments>>(
      `/v1/appointments`,
      {
        headers: {
          Authorization: `Bearer ${getItem("auth-token")}`,
        },
      },
    ).catch(function (error) {
      return error.response;
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
