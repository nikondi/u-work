import {Worker} from "@/features/workers/types";

export type SimpleObject = {
  id: number,
  name: string,
  type: string,
  city: string,
  street: string,
  house: string,
  object: Objects
}

export type ObjectCamera = {
  id: number,
  ip: string,
  model: string,
}
export type ObjectNet = {
  id: number,
  subnet: string,
  wan: string,
  pppoe_cred: string,
}

export type ObjectStatus = 'offline' | 'online' | 'unknown';

export type ObjectFile = {
  id: number,
  title: string,
  file?: File,
  path: string,
  url: string,
  type: 'schema' | 'photo',
  basename: string
}

export type Objects = {
  id: number,
  type: '112-stand' | '112-button' | 'intercom' | 'house',
  worker: Worker
  router: string,
  internet: boolean,
  nets: ObjectNet[],
  cameras: ObjectCamera[],
  sip: number | string,
  status: ObjectStatus,
  last_online: string,
  minipc_model: string,
  intercom_model: string,
  cubic_ip: string,
  comment: string,
  schemas: ObjectFile[]
  photos: ObjectFile[]
}
