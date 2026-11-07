import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";

import { baseURL, token_ } from "@/APIS/BaseApis";
import { getItem } from "@/helpers/armazenamento";

interface iUsage {
  usage: number;
  available: number;
  plan: string;
  expiration_date: string;
}

class ApiDados {
  user: null;
  acess_token: string | null; // Alterei para string ou null
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
    this.user = null;
    this.acess_token = null;
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
    const token = getItem("auth-token");
    this.acess_token = token || token_;
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${this.acess_token}`;
    }
  }

  async GetUsage(): Promise<IApiData<iUsage> | undefined> {
    // Garantir que o token está carregado antes de fazer a requisição
    await this.getAuthorization();

    if (!this.acess_token) {
      console.warn("Token não encontrado, requisição pode falhar");
    }

    const response = await this.api!.get<IApiData<iUsage>>(
      `${baseURL}/v2/usage`,
      {
        headers: {
          Authorization: `Bearer ${this.acess_token}`,
        },
      },
    )
      .then(function (data) {
        return data;
      })
      .catch(function (error) {
        console.error("Error:", error); // Handle any errors
      });
    return response?.data;
  }
}

export default {
  create: async () => {
    const instance = new ApiDados();
    await instance.init();
    return instance;
  },
};
