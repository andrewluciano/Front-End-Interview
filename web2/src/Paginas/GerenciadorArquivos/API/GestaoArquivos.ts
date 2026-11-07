import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { type IApiData } from "@/interfaces/apiData";
import { getItem } from "@/helpers/armazenamento";

import { baseURL, useDadosUsuarios } from "@/APIS/BaseApis";

import { IListaFiles, IAdicionaArquivos, IUploadPayload } from "./Interfaces";

class Api {
  user: null;
  acess_token: string | null; // Alterei para string ou null
  idUsuario: null;
  api: AxiosInstance | undefined;
  roleUsuario: unknown;

  constructor() {
    this.user = null;
    this.idUsuario = null;
    this.acess_token = getItem("auth-token");
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
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${await this.acess_token}`;
    }
  }

  async GetTiposArquivos(): Promise<IApiData<IListaFiles> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaFiles>>(
      `/v3/file/type/content`,
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

  async GetArquivos(): Promise<IApiData<IListaFiles> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaFiles>>(`/v3/files`, {
      headers: {
        Authorization: `Bearer ${await this.acess_token}`,
      },
    }).catch(function (error) {
      return error.response;
    });
    return response?.data;
  }

  async GetArquivosEspecificos(
    Identifier: string,
  ): Promise<IApiData<IListaFiles> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaFiles>>(
      `/v3/file/${Identifier}`,
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

  async PostArquivos(
    payload: IUploadPayload,
  ): Promise<IApiData<IAdicionaArquivos> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }

    if (!payload.file) {
      console.error(
        "Nenhum arquivo para upload. ALTERAR FUNCOES PARA ACEPTAR FILE",
      );
      return;
    }
    // console.log("payload", payload);

    const formData = new FormData();
    formData.append("file", payload.file);

    // Montar o objeto JSON para o campo 'payload'
    const jsonPayload = JSON.stringify({
      nome: payload.nome,
      creditos: payload.creditos,
      tipo: payload.tipo,
      tamanho: payload.tamanho,
      dataUpload: payload.dataUpload.toISOString(),
      status: payload.status,
    });

    formData.append("payload", jsonPayload);

    // console.log("formData", formData);

    const response = await this.api!.post<IApiData<IAdicionaArquivos>>(
      `/v3/file`,
      formData,
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.acess_token}`,
        },
      },
    ).catch((error: AxiosError<IApiData<IAdicionaArquivos>>) => {
      const errorResponse = error.response as
        | AxiosResponse<IApiData<IAdicionaArquivos>>
        | undefined;

      if (!errorResponse) {
        return {
          data: {
            is_error: true,
            message: error.message,
          } as IApiData<IAdicionaArquivos>,
        };
      }

      return {
        ...errorResponse,
        data: {
          ...errorResponse.data,
          message: errorResponse.message || errorResponse.data?.message,
        },
      };
    });
    return response?.data;
  }

  async RemoveArquivos(
    IdArquivo: number,
  ): Promise<IApiData<IListaArquivos> | undefined> {
    await this.getAuthorization();

    const IdArquivoChecked = IdArquivo ? IdArquivo : [];

    const response = await this.api!.delete<IApiData<IListaArquivos>>(
      `/v3/file/${IdArquivoChecked}`,
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

  async ReprocessarArquivos(
    IdArquivo: number,
  ): Promise<IApiData<IListaArquivos> | undefined> {
    await this.getAuthorization();

    const IdArquivoChecked = IdArquivo ? IdArquivo : [];

    const response = await this.api!.post<IApiData<IListaArquivos>>(
      `/v3/file/rerun/${IdArquivoChecked}`,
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

  async GetHistoricoArquivo(
    Identifier: string,
  ): Promise<IApiData<IListaFiles> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IListaFiles>>(
      `/v3/file/history/${Identifier}`,
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
