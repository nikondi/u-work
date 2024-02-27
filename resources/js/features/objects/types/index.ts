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

export type Objects = {
  id: number,
  type: '112-stand' | '112-button' | 'intercom' | 'house',
  router: string,
  internet: boolean,
  nets: ObjectNet[],
  cameras: ObjectCamera[],
  sip: number | string,
  minipc_model: string,
  intercom_model: string,
  cubic_ip: string,
  comment: string,
}
