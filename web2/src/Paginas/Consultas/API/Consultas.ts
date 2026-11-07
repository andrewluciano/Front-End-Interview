import axios, { AxiosInstance } from "axios";

import { type IApiData } from "interfaces/apiData";
// import { type IAdicionarPacientes } from "interfaces/ListaPacientes";
import { getItem } from "@/helpers/armazenamento";
import { baseURL, useDadosUsuarios, token_ } from "@/APIS/BaseApis";

interface IListaConsultas {
  nome_paciente: string;
  cpf_rg: string;
  r_nascido: string;
  numero_carteira: string;
  data_nascimento: string;
  idade: string;
  contato: string;
  convenio: string;
  unidade: string;
  local: string;
  tipo_encontro: string;
  data_consulta: string;
  medico: string;
  medico_encaminhador: string;
  valor_receber: string;
  valor_recebido: string;
}

interface IAdicionaConsultas {
  nome_paciente: string;
  cpf_rg: string;
  r_nascido: string;
  numero_carteira: string;
  data_nascimento: Date;
  idade: string;
  contato: string;
  convenio: string;
  unidade: string;
  local: string;
  tipo_encontro: string;
  data_consulta: Date;
  medico: string;
  medico_encaminhador: string;
  valor_receber: number;
  valor_recebido: number;
}
interface IListaPendencias {
  identifier: number;
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
    this.acess_token = null;
    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${this.acess_token}`,
      },
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

  async GetConsultas(
    IdConsulta,
  ): Promise<IApiData<IListaConsultas> | undefined> {
    await this.getAuthorization();

    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }

    const IdConsultaChecked = IdConsulta
      ? "/v2/encounter/" + IdConsulta
      : "/v2/encounters";

    const response = await this.api!.get<IApiData<IListaConsultas>>(
      `${IdConsultaChecked}`,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async GetConsultasArquivos(
    IdProcedimento,
  ): Promise<IApiData<IListaConsultas> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }
    const IdProcedimentoChecked = IdProcedimento ? IdProcedimento : [];

    const response = await this.api!.get<IApiData<IListaConsultas>>(
      `/v2/upload/procedure/${IdProcedimentoChecked}`,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async PutConsultas(
    IdProcedimento,
    Dados,
  ): Promise<IApiData<IListaConsultas> | undefined> {
    await this.getAuthorization();
    // const IdProcedimentoChecked = IdProcedimento ? IdProcedimento : [];

    console.log("IdProcedimento", IdProcedimento);
    const response = await this.api!.put<IApiData<IListaConsultas>>(
      `/v2/encounter/${IdProcedimento}`,
      Dados,
      {
        headers: {
          Authorization: `Bearer ${await this.acess_token}`,
        },
      },
    );
    return response?.data;
  }

  async AdicionarConsultas(
    dados: unknown,
  ): Promise<IApiData<IAdicionaConsultas> | undefined> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }
    const response = await this.api!.post(`/v2/encounter`, dados, {
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
  ): Promise<IApiData<IAdicionaConsultas> | undefined> {
    await this.getAuthorization();

    if (!FilesUpload) {
      console.error("Nenhum arquivo para upload.");
      return;
    }

    this.api.defaults.headers.post["Content-Type"] = "multipart/form-data";

    const formData = new FormData();
    formData.append("file", FilesUpload);

    const response = await this.api!.post(
      `/v2/upload/procedure/${IdProcedimento}`,
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

  async RemoveConsultas(idProcedimento: number): Promise<IApiData> {
    await this.getAuthorization();
    if (!this.acess_token) {
      await this.waitForToken();
    }
    if (!this.acess_token) {
      return;
    }
    const response = await this.api!.delete<IApiData>(
      `/v2/encounter/${idProcedimento}`,
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
