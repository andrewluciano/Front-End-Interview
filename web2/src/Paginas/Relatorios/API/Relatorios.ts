import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
// import { type IAdicionarPacientes } from "interfaces/ListaPacientes";
import { getItem } from "@/helpers/armazenamento";
import { baseURL, useDadosUsuarios, token_ } from "@/APIS/BaseApis";

interface IRelatorio {
  id: number;
  paciente: string;
  procedimento: string;
  convenio: string;
  dataProc: string;
  dataConc: string;
  cobrado: number;
  recebido: number;
  glosa: number;
  status: string;
}

class Api {
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

  async GetRelatorios(
    Filtros: string | undefined,
  ): Promise<IApiData<IRelatorio> | undefined> {
    await this.getAuthorization();

    if (!this.acess_token) {
      console.warn("Token não encontrado, requisição pode falhar");
    }
    const response = await this.api!.get<IApiData<IRelatorio>>(
      "/v2/conciliation/report/list",
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }
  async GetSummary(): Promise<IApiData<IRelatorio> | undefined> {
    await this.getAuthorization();

    if (!this.acess_token) {
      console.warn("Token não encontrado, requisição pode falhar");
    }
    const response = await this.api!.get<IApiData<IRelatorio>>(
      "/v2/conciliation/report/summary",
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
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
