import AxiosClient from "@/lib/axios-client";
import {AxiosError, AxiosResponse} from "axios";
import {Objects} from "../types";
import {serialize} from "object-to-formdata";
import API from "@/lib/api";
import {err} from "@/helpers";

type ObjectRelations = 'addresses' | 'entrances';

type MorphedConfig = {
  callback?: (data: Objects, type: 'save' | 'create') => void,
  beforeSend?: () => void,
  onError?: (error: AxiosError) => void
  onFinally?: () => void
  object_type: '112-stand' | '112-button' | 'intercom' | 'house'
}

export class ObjectsAPI extends API {
  static getSingle(id: number) {
    return this._prepare<Objects>(({signal}) => AxiosClient.get(`/objects/${id}`, {signal}));
  }
  static save(id:number, data: Partial<Objects>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.put(`/objects/${id}`, data);
  }
  static create(data: Partial<Objects>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.post('/objects', data);
  }

  static createMorphed(id: number, relation: ObjectRelations, data: any) : Promise<AxiosResponse<Objects>> {
    const d = serialize(data, {indices: true});
    return AxiosClient.post(`/${relation}/${id}/object`, d, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
  }
  static saveMorphed(id: number, relation: ObjectRelations, data: any) : Promise<AxiosResponse<Objects>> {
    const d = serialize(data, {indices: true});
    return AxiosClient.post(`/${relation}/${id}/object`, d, {
      params: {_method: 'PUT'},
      headers: {'Content-Type': 'multipart/form-data'}
    });
  }

  static manageMorphed(id: number, relation: ObjectRelations, data: Partial<Objects>, config: MorphedConfig) {
    const defaultConfig: MorphedConfig = {
      callback: null,
      beforeSend: null,
      onError: err,
      onFinally: null,
      object_type: '112-button',
    }
    config = {...defaultConfig, ...config};

    const d = {
      ...data,
      type: config.object_type,
      nets: data.nets || [],
      cameras: data.cameras || [],
      files: [...data.schemas, ...data.photos],
    }
    delete d['schemas'];
    delete d['photos'];

    if(d.files.length == 0)
      d.files.push({id: null, basename: null, title: null, type: null, file: null, path: null, url: null});

    config.beforeSend && config.beforeSend();

    if(data.id) {
      this.saveMorphed(id, relation, d)
          .then(({data: server_data}) => config.callback && config.callback(server_data, 'save'))
          .catch((err) => config.onError && config.onError(err))
          .finally(() => config.onFinally && config.onFinally());
    }
    else {
      this.createMorphed(id, relation, d)
          .then(({data: server_data}) => config.callback && config.callback(server_data, 'create'))
          .catch((err) => config.onError && config.onError(err))
          .finally(() => config.onFinally && config.onFinally());
    }
  }

  static updateStatuses() {
    return AxiosClient.get('/objects/update_statuses');
  }
}
