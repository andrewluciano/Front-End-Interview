export interface IListaFiles {
  _id: string;
  nome: string;
  creditos: number;
  tipo: string;
  dataUpload: string;
  status: string;
  status_level: string;
  status_message: string;
  identifier: string;
  created_at: Date;
  user_id: string;
  tamanho: string;
}

export interface IAdicionaArquivos {
  nome: string;
  creditos: number;
  tipo: string;
  dataUpload: string;
  status: string;
  identifier: string;
  created_at: Date;
  user_id: string;
  tamanho: string;
  file: File;
}

export interface IUploadPayload {
  nome: string;
  creditos: number;
  tipo: string;
  dataUpload: Date;
  status: string;
  tamanho: string;
  file: File;
}
