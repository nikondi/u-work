import {Client} from "@/features/clients/types";
import {Address} from "@/features/addresses/types";
import {IUser} from "@/types/auth";

export type RequestStatus = 'new' | 'done' | 'important' | 'unknown' | string;
type RequestSource = "unisite" | "uniwork" | "tomoru" | string;

export type TRequest = {
  id: number,
  type: string,
  order: number,
  source: RequestSource,
  subject: string,
  client?: Client,
  worker: | IUser | null,
  client_name?: string,
  client_phone: string,
  client_phone_contact?: string,
  email: string,
  addressDB?: Address,
  address?: string,
  content: string,
  status: RequestStatus,
  created: string,
  archived: boolean
}

export type TRequestCard = {
  id: number,
  type: string,
  order: number,
  source: RequestSource,
  subject: string,
  client_name?: string,
  client_phone: string,
  client_phone_contact?: string,
  email: string,
  address?: string,
  status: RequestStatus,
  created: string,
  archived: boolean
}

export interface IRequestForm {
  client_id: number
  type: string
  source: RequestSource
  subject: string
  worker_id: number
  address_id: number
  email: string
  client_name: string
  client_phone: string
  client_phone_contact: string
  address: string
  content: string
  status: RequestStatus
}
