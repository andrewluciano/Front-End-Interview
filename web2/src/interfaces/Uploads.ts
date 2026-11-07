export interface IListaUploads {
  status: string;
  created_at: Date;
  deleted_at: string;
  procedure_request_identifier: string;
  file_name: string;
  file_type: string;
  user_id: string;
  identifier: string;
  is_private: boolean;
  source_content: [];
}
export interface IAdicionaUploads {
  file: File;
}
