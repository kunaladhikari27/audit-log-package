export interface IAuditLogs {
  message: string;
  action: Action;
  actor_uuid: string;
  group?: string;
  actor_type: ActorType;
  previous_value?: any;
  updated_value?: any;
  address?: IAddress;
}

export interface IAddress {
  ip: string;
  country: string;
  deviceId: string;
}

export enum ActorType {
  person = "PERSON",
  api = "API",
}
export enum Action {
  post = "CREATE",
  put = "UPDATE",
  get = "READ",
  delete = "DELETE",
}
