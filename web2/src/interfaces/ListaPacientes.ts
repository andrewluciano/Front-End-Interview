export interface IListaPacientes {
  identifier: string;
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
export interface IAdicionarPacientes {
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
