import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { type IListaMedicos } from "@/interfaces/ListaMedicos";

import { baseURL, useDadosUsuarios, token_ } from "@/APIS/BaseApis";

class Api {
  user: null;
  acess_token: string | null; // Alterei para string ou null
  idUsuario: null;
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
    this.user = null;
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

  async GetMedicos(IdMedico): Promise<IApiData<IListaMedicos> | undefined> {
    await this.getAuthorization();

    const IdMedicoChecked = IdMedico ? "/" + IdMedico : [];
    const response = await this.api!.get(`/v1/doctors${IdMedicoChecked}`, {
      headers: {
        Authorization: `Bearer ${await this.acess_token}`,
      },
    }).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async EditarMedico(
    idIdMedico: number,
    dados: [],
  ): Promise<IApiData<IListaMedicos> | undefined> {
    await this.getAuthorization();

    const IdIdMedicoChecked = idIdMedico ? "/" + idIdMedico : [];

    const response = await this.api!.put<IApiData<IListaMedicos>>(
      `/v1/doctors${IdIdMedicoChecked}`,
      dados,
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

export default {
  create: async () => {
    const instance = new Api();
    await instance.init();
    return instance;
  },
};
