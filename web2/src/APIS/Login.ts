import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
import { getItem } from "@/helpers/armazenamento";
const token_ = getItem("auth-token");

import { baseURL } from "@/APIS/BaseApis";

interface ILogin {
  email: string;
  password: string;
}
interface IMe {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface IAlteraSenha {
  identifier: string;
  cur_password: string;
  new_password: string;
}

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
    this.acess_token = token_;
    if (this.acess_token && this.api) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${this.acess_token}`;
    }
  }
  async Logar(dados: unknown): Promise<IApiData<ILogin> | undefined> {
    // await this.getAuthorization();
    const response = await this.api!.post(`${baseURL}/v1/login`, dados);
    return response?.data;
  }

  async CadastrarLogin(dados: unknown): Promise<IApiData<ILogin> | undefined> {
    // await this.getAuthorization();
    const response = await this.api!.post(`${baseURL}/v1/register`, dados);
    return response?.data;
  }

  async EsqueciMinhaSenha(
    dados: unknown,
  ): Promise<IApiData<ILogin> | undefined> {
    // await this.getAuthorization();
    const response = await this.api!.post(
      `${baseURL}/v1/password-reset`,
      dados,
    );
    return response?.data;
  }

  async NovaSenha(dados: unknown): Promise<IApiData<ILogin> | undefined> {
    // await this.getAuthorization();
    const response = await this.api!.post(
      `${baseURL}/v1/password-reset-run`,
      dados,
    );
    return response?.data;
  }

  async AlterarSenha(
    dados: unknown,
  ): Promise<IApiData<IAlteraSenha> | undefined> {
    const payload = {
      cur_password: dados?.cur_password,
      new_password: dados?.new_password,
    };

    const response = await this.api!.post(
      `${baseURL}/v1/change-password`,
      payload,
    );
    return response?.data;
  }

  async Logout(): Promise<IApiData<ILogin> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.post(`${baseURL}/v1/logout`, {
      headers: {
        Authorization: `Bearer ${await this.acess_token}`,
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

  async dadosMe(token: unknown): Promise<IApiData<IMe> | undefined> {
    await this.getAuthorization();

    console.log("token", token);

    const response = await this.api!.get<IApiData<IMe>>(
      `${baseURL}profile/me`,
      {
        headers: {
          // Authorization: `Bearer ${token?.access_token}`,
          Authorization: `Bearer ${await this.acess_token}`,
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
    const instance = new Api();
    await instance.init();
    return instance;
  },
};
