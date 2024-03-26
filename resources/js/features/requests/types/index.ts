import {user} from "@/features/auth";
import {Client} from "@/features/clients";
import {Address} from "@/features/addresses";

export type RequestStatus = 'new' | 'done' | 'important' | 'unknown';
type RequestSource = "unisite" | "uniwork" | "tomoru" | string;

export type Request = {
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

export type Column = {
  id: string,
  colors: string,
  title: string,
  items: { id: string, content: Request }[]
}
