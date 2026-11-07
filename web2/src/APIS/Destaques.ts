import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { type IFavoritos } from "@/interfaces/favoritos";

interface IProcedimentosDashboard {
  label: string;
  type: string;
  value: number;
}

interface IMedicosDashboard {
  label: string;
  type: string;
  value: number;
}

interface IPacientesDashboard {
  label: string;
  type: string;
  value: number;
}

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

  async GetDestaques(): Promise<IApiData<IFavoritos> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IFavoritos>>(
      `${baseURL}/dashboard/requests`,
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

  async GetMedicosDashboard(): Promise<
    IApiData<IMedicosDashboard> | undefined
  > {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IMedicosDashboard>>(
      `${baseURL}/dashboard/doctors`,
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

  async GetPacientesDashboard(): Promise<
    IApiData<IPacientesDashboard> | undefined
  > {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IPacientesDashboard>>(
      `${baseURL}/dashboard/patients`,
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

  async GetProcedimentosDashboard(): Promise<
    IApiData<IProcedimentosDashboard> | undefined
  > {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IProcedimentosDashboard>>(
      `src/Json/ProcedimentosDashboard.json`,
      // `${baseURL}/dashboard/requests`,
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
