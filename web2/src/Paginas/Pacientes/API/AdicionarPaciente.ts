/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { type IAdicionarPacientes } from "@/interfaces/ListaPacientes";

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

  async AdicionarDocumentos(
    IdPatient: string,
    FilesUpload: File,
  ): Promise<IApiData<IAdicionarPacientes> | undefined> {
    await this.getAuthorization();

    if (!FilesUpload) {
      console.error("Nenhum arquivo para upload.");
      return;
    }

    this.api.defaults.headers.post["Content-Type"] = "multipart/form-data";

    const formData = new FormData();
    formData.append("patient_id", IdPatient);
    formData.append("file", FilesUpload);

    const response = await this.api!.post(
      `/v1/upload/patient/${IdPatient}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token_}`,
        },
      },
    )
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
