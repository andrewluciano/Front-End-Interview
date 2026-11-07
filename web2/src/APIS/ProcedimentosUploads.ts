import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
import { type IListaUploads } from "interfaces/Uploads";
import { type IAdicionaUploads } from "interfaces/Uploads";
import { getItem } from "@/helpers/armazenamento";

import { baseURL, useDadosUsuarios } from "@/APIS/BaseApis";

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
    // Busca o token sempre do armazenamento para garantir que esteja atualizado
    this.acess_token = getItem("auth-token");
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${this.acess_token}`;
    }
  }

  private async waitForToken(maxRetries = 30, delayMs = 100) {
    // Aguarda até que o token esteja disponível no armazenamento
    for (let i = 0; i < maxRetries; i++) {
      const current = getItem("auth-token");
      if (current) {
        this.acess_token = current;
        if (this.api) {
          this.api.defaults.headers.common["Authorization"] =
            `Bearer ${current}`;
        }
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  async GetUploads(): Promise<IApiData<IListaUploads> | undefined> {
    // Garante que o token esteja carregado; tenta novamente se estiver nulo
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }

    const response = await this.api!.get(`/v1/uploads/procedure`, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async PostUploads(
    FilesUpload: File,
  ): Promise<IApiData<IAdicionaUploads> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }

    if (!FilesUpload) {
      console.error("Nenhum arquivo para upload.");
      return;
    }

    this.api.defaults.headers.post["Content-Type"] = "multipart/form-data";

    const formData = new FormData();
    formData.append("file", FilesUpload);

    const response = await this.api!.post(`/v1/upload/procedure`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async GetUploadsConsultas(): Promise<IApiData<IListaUploads> | undefined> {
    // Garante que o token esteja carregado; tenta novamente se estiver nulo
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }

    const response = await this.api!.get(`/v1/upload/encounter`, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async PostUploadsConsultas(
    FilesUpload: File,
  ): Promise<IApiData<IAdicionaUploads> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }

    if (!FilesUpload) {
      console.error("Nenhum arquivo para upload.");
      return;
    }

    this.api.defaults.headers.post["Content-Type"] = "multipart/form-data";

    const formData = new FormData();
    formData.append("file", FilesUpload);

    const response = await this.api!.post(`/v1/upload/encounter`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.acess_token}`,
      },
    }).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async GetUploadsDownloads(Id_file: string): Promise<Blob | undefined> {
    // Garante que o token esteja carregado; tenta novamente se estiver nulo
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }

    const response = await this.api!.get(`/v1/uploads/${Id_file}/download`, {
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
      responseType: "blob",
    }).catch(function (error) {
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
