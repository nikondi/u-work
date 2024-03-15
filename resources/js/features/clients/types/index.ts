import {Address} from "@/features/addresses";

type ClientAddress = {
  floor: number | string,
  apartment: number | string,
} & Address;

export type Client = {
  id: number
  name: string
  email: string
  phone: string
  phones: string[]
  status: string
  floor: number
  apartment: number
  comment: string
}

export type ClientEntrance = {
  id: number
  name: string
  floor: number
  apartment: number
  entrance: number
  entrance_id: number
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
