import AxiosClient from "@/lib/axios-client";
import {AxiosResponse} from "axios";
import {SimpleObject} from "../types";

export * from './ObjectsAPI'

export class SimpleObjectsAPI {
  static search(count: number, page: number, word: string, pagination = true, filter: Partial<SimpleObject> = {}) : Promise<AxiosResponse<SimpleObject[]>> {
    return AxiosClient.get('/simple_objects/search', {params: {limit: count, word, page, pagination, filter}})
  }
  static get(count: number, page=1, filter: Partial<SimpleObject> = null, pagination = true) : Promise<AxiosResponse<SimpleObject[]>> {
    return AxiosClient.get('/simple_objects', {params: {limit: count, page, filter, pagination}});
  }
  static getSingle(id: number) : Promise<AxiosResponse<SimpleObject>> {
    return AxiosClient.get(`/simple_objects/${id}`);
  }
  static save(id:number, data: Partial<SimpleObject>) : Promise<AxiosResponse<SimpleObject>> {
    return AxiosClient.put(`/simple_objects/${id}`, data);
  }
  static create(data: Partial<SimpleObject>) : Promise<AxiosResponse<SimpleObject>> {
    return AxiosClient.post('/simple_objects', data);
  }
}
