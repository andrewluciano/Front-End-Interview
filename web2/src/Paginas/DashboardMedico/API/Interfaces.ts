export interface IListaPendencias {
  identifier: string;
  type: string;
  related_id: string;
  description: string;
  status: string;
  created_at: Date;
}
export interface IListaBullets {
  title: string;
  description: string;
  icon: string;
  color: string;
  value: number;
  last_value: number;
  unit: string;
  trend: string;
}

export interface IAppointmentItem {
  relationed_id: string;
  local: string;
  time: string;
  patient_name: string;
  procedure: string;
  status: string;
  icon: string;
  color: string;
}

export interface IListaAppointments {
  date: Date;
  date_str: string;
  appointments: IAppointmentItem[];
}
