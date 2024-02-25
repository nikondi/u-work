import {Address} from "@/features/addresses";

type ClientAddress = {
  floor: number | string,
  apartment: number | string,
} & Address;

export type Client = {
  id: number,
  name: string,
  address: ClientAddress,
  comment: string,
  phone?: string,
  email?: string,
  status: string,
  phones?: string[],
  floor: number | string,
  apartment: number | string,
}

export type ClientRaw = {
  id: number,
  address_id: number,
  phone: string,
  email: string,
  name: string,
  status: number,
  floor: number,
  apartment: number | string,
  comment: string,
  password: string,
}
