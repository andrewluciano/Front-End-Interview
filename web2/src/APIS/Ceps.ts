import axios from "axios";

import { type IApiData } from "interfaces/apiData";

interface IListaCep {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

class ApiCep {
  async GetCEP(CEP: []): Promise<IApiData<IListaCep> | undefined> {
    const response = await axios
      .get<IApiData<IListaCep>>(`https://brasilapi.com.br/api/cep/v1/${CEP}`)
      .catch(function (error) {
        return error.response;
      });
    return response?.data;
  }
}

export default new ApiCep();
