import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";

import { baseURL, token_, useDadosUsuarios } from "@/APIS/BaseApis";
import { getItem } from "@/helpers/armazenamento";

interface IMe {
  id: string;
}

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

  async ResetPlataforma(
    payload: Partial<IMe>,
  ): Promise<IApiData<IMe> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.post<IApiData<IMe>>(
      `${baseURL}/v1/reset`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    )
      .then(function (data) {
        return data;
      })
      .catch(function (error) {
        console.error("Error:", error);
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
