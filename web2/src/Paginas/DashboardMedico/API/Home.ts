import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { getItem } from "@/helpers/armazenamento";

import { baseURL } from "@/APIS/BaseApis";

import { IListaBullets } from "./Interfaces";

class Api {
  acess_token: string | null; // Alterei para string ou null
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
    this.acess_token = getItem("auth-token");
    this.api = axios.create({
      baseURL,
      headers: {},
    });
  }

  async init() {
    // Carrega o token
    await this.getAuthorization();
  }

  async getAuthorization() {
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${await this.acess_token}`;
    }
  }

  async GetListaHome(
    payload: unknown,
  ): Promise<IApiData<IListaBullets> | undefined> {
    await this.getAuthorization();

    

    const response = await this.api!.post<IApiData<IListaBullets>>(
      `/v2/home`,
      payload,
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
