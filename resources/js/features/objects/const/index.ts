import {Objects, SimpleObject} from "../types";

export const defaultObject: Objects = {
  id: null,
  type: 'intercom',
  router: '',
  internet: false,
  nets: [],
  cameras: [],
  cubic_ip: '',
  sip: '',
  minipc_model: '',
  intercom_model: '',
  comment: '',
}

export const defaultSimpleObject: SimpleObject = {
  id: null,
  name: '',
  type: '',
  city: '',
  house: '',
  street: '',
  object: defaultObject
}

const objectTypeLabels = {
  '112-stand': 'Стойка 112',
  '112-button': 'Кнопка 112',
  'intercom': 'Домофон'
}

export function objectTypeLabel(type: string) {
  return objectTypeLabels[type] || type;
}
