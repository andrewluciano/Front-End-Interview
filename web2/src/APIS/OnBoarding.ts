import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";

import { baseURL, token_, useDadosUsuarios } from "@/APIS/BaseApis";
import { getItem } from "@/helpers/armazenamento";

interface IMe {
  id: string;
  email: string;
  full_name: string;
  role: string;
  billing_email: string;
  offices: [];
  phone: number;
  personal_document: string;
  professional_document: string;
  onboarding: boolean;
  privacy_agreement: boolean;
  terms_agreement: boolean;
}

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

  async SalvarOnboarding(
    payload: Partial<IMe>,
  ): Promise<IApiData<IMe> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.post<IApiData<IMe>>(
      `${baseURL}/v1/onboarding`,
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
