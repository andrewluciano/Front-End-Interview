export interface IListaHospitais {
  deleted_at: Date;
  convenios: [];
  tipo: string;
  endereco_numero: string;
  telefones: [];
  created_at: Date;
  nome: string;
  endereco_cep: string;
  identifier: string;
  emails: [];
  endereco: string;
  razao_social: string;
  active: true;
  cnpj: string;
  user_id: null;
}
export interface IAdicionarHospital {
  full_name: string;
  email: string;
  phone: string;
  birth_date: Date;
  gender: string;
  address: string;
  marital_status: string;
  nationality: string;
  emergency_contact: string;
  medical_history: string;
  allergies: string;
  current_medications: string;
  primary_physician: string;
  insurance_provider: string;
  insurance_policy_number: string;
  optin_message: string;
  optin_message_date: string;
}
