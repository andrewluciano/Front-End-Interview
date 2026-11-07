export interface IListaPerfil {
  email: string;
  id: string;
  full_name: string;
  billing_email: string;
  offices: string[];
  phone: string;
  personal_document: string;
  professional_document: string;
  role: string;
  onboarding: boolean;
  privacy_agreement: boolean;
  terms_agreement: boolean;
}
