export interface IListaMedicos {
  crm: string;
  crm_state: string;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  identifier: string;
  created_at: Date;
  deleted_at: string;
}

export interface IAdicionarMedicos {
  crm: string;
  crm_state: string;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
}
