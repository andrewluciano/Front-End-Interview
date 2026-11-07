import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
import { type IListaPacientes } from "interfaces/ListaPacientes";

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

  async GetPacientes(
    idPaciente: number,
  ): Promise<IApiData<IListaPacientes> | undefined> {
    await this.getAuthorization();
    const IdPacienteChecked = idPaciente ? "/" + idPaciente : [];

    const response = await this.api!.get<IApiData<IListaPacientes>>(
      `/v1/patients${IdPacienteChecked}`,
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

  async GetDocumentosPacientes(
    idPaciente: number,
  ): Promise<IApiData<IListaPacientes> | undefined> {
    await this.getAuthorization();
    const IdPacienteChecked = idPaciente ? idPaciente : [];

    const response = await this.api!.get<IApiData<IListaPacientes>>(
      `v1/upload/patient/${IdPacienteChecked}`,
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

  async RemovePacientes(
    idPaciente: number,
  ): Promise<IApiData<IListaPacientes> | undefined> {
    await this.getAuthorization();

    const IdPacienteChecked = idPaciente ? idPaciente : [];

    const response = await this.api!.delete<IApiData<IListaPacientes>>(
      `/v1/patients/${IdPacienteChecked}`,
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

  async EditarPacientes(
    idPaciente: number,
    dados: [],
  ): Promise<IApiData<IListaPacientes> | undefined> {
    await this.getAuthorization();

    const IdPacienteChecked = idPaciente ? idPaciente : [];

    const response = await this.api!.put<IApiData<IListaPacientes>>(
      `/patients/${IdPacienteChecked}`,
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
