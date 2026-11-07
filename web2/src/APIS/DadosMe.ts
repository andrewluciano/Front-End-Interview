import axios, { AxiosInstance } from "axios";

import { type IApiData } from "@/interfaces/apiData";

import { baseURL, token_ } from "@/APIS/BaseApis";

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

class ApiDados {
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
  }

  async init() {
    // Carrega o token
    await this.getAuthorization();
  }

  async getAuthorization() {
    this.acess_token = token_;
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token_}`;
    }
  }

  async DadosMe(token: unknown): Promise<IApiData<IMe> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.get<IApiData<IMe>>(`${baseURL}/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
