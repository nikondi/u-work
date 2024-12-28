import {Client} from "@/features/clients";
import {user} from "@/features/auth";
import {Address} from "@/features/addresses";

export type RequestStatus = 'new' | 'done' | 'important' | 'unknown';
type RequestSource = "unisite" | "uniwork" | "tomoru" | string;

export type TRequest = {
  id: number,
  type: string,
  order: number,
  source: RequestSource,
  subject: string,
  client?: Client,
  worker: | user | null,
  client_name?: string,
  client_phone: number | string,
  client_phone_contact?: number | string,
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
  client_phone: number | string,
  client_phone_contact?: number | string,
  email: string,
  address?: string,
  status: RequestStatus,
  created: string,
  archived: boolean
}
