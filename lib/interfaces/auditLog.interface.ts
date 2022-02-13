export interface IAuditLogs {
  message: string;
  action: Action;
  actor_uuid: string;
  actor_type: string;
  previous_data?: any;
  updated_data?: any;
  address?: IAddress;
}
export interface IAddress {
  ip: string;
  country: string;
  deviceId: string;
}

export enum Action {
  "CREATE",
  "UPDATE",
  "READ",
  "DELETE",
}
