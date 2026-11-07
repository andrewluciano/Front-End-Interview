import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { type IAdicionarMedicos } from "@/interfaces/ListaMedicos";

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
    this.acess_token = token_;
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${this.acess_token}`;
    }
  }

  async PostMedicos(
    dados: void,
  ): Promise<IApiData<IAdicionarMedicos> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.post(`/v1/doctors`, dados, {
      headers: {
        Authorization: `Bearer ${await this.acess_token}`,
      },
    })
      .then(function () {})
      .catch(function (error) {
        console.error("Error:", error); // Handle any errors
      });

    return response?.data;
  }

  async RemoveMedicos(
    dados: void,
  ): Promise<IApiData<IAdicionarMedicos> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.delete(`/v1/doctors/${dados}`, {
      headers: {
        Authorization: `Bearer ${await this.acess_token}`,
      },
    })
      .then(function () {})
      .catch(function (error) {
        console.error("Error:", error); // Handle any errors
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
