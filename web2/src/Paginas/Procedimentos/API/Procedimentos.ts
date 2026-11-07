import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
// import { type IAdicionarPacientes } from "interfaces/ListaPacientes";
import { getItem } from "@/helpers/armazenamento";

interface IListaProcedimentos {
  id: number;
  procedure_id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface IListaPendencias {
  identifier: number;
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

  async GetPendencias(
    IdProcedimento,
  ): Promise<IApiData<IListaPendencias> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }
    const IdProcedimentoChecked = IdProcedimento ? IdProcedimento : [];

    const response = await this.api!.get<IApiData<IListaPendencias>>(
      `v1/procedure/${IdProcedimentoChecked}/pendency`,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async GetEstagios(): Promise<IApiData<IListaEstagios> | undefined> {
    await this.getAuthorization();

    // const IdPacienteChecked = idPaciente ? idPaciente : [];

    const response = await axios
      .get<IApiData<IListaEstagios>>(
        // `/pending?user_id=${IdPacienteChecked}`,
        `src/Json/Estagios.json`,
        {
          headers: {
            Authorization: `Bearer ${await this.acess_token}`,
          },
        },
      )
      .catch(function (error) {
        return error.response;
      });
    return response?.data;
  }

  async GetProcedimentos(
    IdProcedimento,
  ): Promise<IApiData<IListaProcedimentos> | undefined> {
    await this.getAuthorization();

    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }

    const IdProcedimentoChecked = IdProcedimento
      ? "/v1/procedure/" + IdProcedimento
      : "/v1/procedures";

    const response = await this.api!.get<IApiData<IListaProcedimentos>>(
      `${IdProcedimentoChecked}`,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async GetProcedimentosArquivos(
    IdProcedimento,
  ): Promise<IApiData<IListaProcedimentos> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }
    const IdProcedimentoChecked = IdProcedimento ? IdProcedimento : [];

    const response = await this.api!.get<IApiData<IListaProcedimentos>>(
      `/v1/upload/procedure/${IdProcedimentoChecked}`,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async PutProcedimentos(
    IdProcedimento,
    Dados,
  ): Promise<IApiData<IListaProcedimentos> | undefined> {
    await this.getAuthorization();
    // const IdProcedimentoChecked = IdProcedimento ? IdProcedimento : [];

    console.log("IdProcedimento", IdProcedimento);
    const response = await this.api!.put<IApiData<IListaProcedimentos>>(
      `/v1/procedure/${IdProcedimento}`,
      Dados,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async AdicionarProcedimentos(
    dados: unknown,
  ): Promise<IApiData<IAdicionaProcedimentos> | undefined> {
    await this.getAuthorization();

    const response = await this.api!.post(`/v1/procedure`, dados, {
      headers: {
        Authorization: `Bearer ${await this.acess_token}`,
      },
    })
      .then(function () {})
      .catch(function (error) {
        console.error("Error:", error); // Handle any errors
      });

    return response?.data;
  }

  async AdicionarDocumentos(
    IdProcedimento: string,
    FilesUpload: File,
  ): Promise<IApiData<IAdicionaProcedimentos> | undefined> {
    await this.getAuthorization();

    if (!FilesUpload) {
      console.error("Nenhum arquivo para upload.");
      return;
    }

    this.api.defaults.headers.post["Content-Type"] = "multipart/form-data";

    const formData = new FormData();
    formData.append("file", FilesUpload);

    const response = await this.api!.post(
      `/v1/upload/procedure/${IdProcedimento}`,
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

  async RemoveProcedimentos(idProcedimento: number): Promise<IApiData> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }
    const response = await this.api!.delete<IApiData>(
      `/v1/procedure/${idProcedimento}`,
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
