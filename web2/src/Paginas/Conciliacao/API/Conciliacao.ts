/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { type IListaFiles } from "./Interfaces";
import { getItem } from "@/helpers/armazenamento";

import { baseURL, token_ } from "@/APIS/BaseApis";

class Api {
  acess_token: string | null; // Alterei para string ou null
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
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

  async PostPaciente(
    data: any,
  ): Promise<IApiData<IAdicionarPacientes> | undefined> {
    // Garantir que o token está carregado antes de fazer a requisição
    if (!this.acess_token) {
      await this.getAuthorization();
    }

    const response = await this.api!.post(`/v1/patients`, data, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      console.error("Error:", error);
    });
    return response?.data;
  }

  async GetConciliationsAutomaticaPlanner(): Promise<
    IApiData<IListaFiles> | undefined
  > {
    await this.getAuthorization();

    if (!this.acess_token) {
      console.warn("Token não encontrado, requisição pode falhar");
    }

    const response = await this.api!.get(`/v2/conciliations/auto/run/planner`, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      console.error("Error:", error);
    });
    return response?.data;
  }

  async GetConciliations(
    stage: any,
  ): Promise<IApiData<IListaFiles> | undefined> {
    await this.getAuthorization();

    if (!this.acess_token) {
      console.warn("Token não encontrado, requisição pode falhar");
    }

    const response = await this.api!.get(`/v2/conciliations/${stage}`, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      console.error("Error:", error);
    });
    return response?.data;
  }

  async PostConciliation(
    payload: any,
  ): Promise<IApiData<IAdicionarConciliacao> | undefined> {
    // Garantir que o token está carregado antes de fazer a requisição
    if (!this.acess_token) {
      await this.getAuthorization();
    }

    const response = await this.api!.post(`/v2/conciliations/run`, payload, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      console.error("Error:", error);
    });
    return response?.data;
  }

  async PostAutoConciliation(): Promise<
    IApiData<IAdicionarConciliacao> | undefined
  > {
    await this.getAuthorization();

    if (!this.acess_token) {
      console.warn("Token não encontrado, requisição pode falhar");
    }

    const response = await this.api!.post(`/v2/conciliations/auto/run/start`, {
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
