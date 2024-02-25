import AxiosClient from "@/lib/axios-client";
import {AxiosResponse} from "axios";
import {SimpleObject} from "../types";

export class ObjectsAPI {
  static search(count: number, page: number, word: string, pagination = true, filter: Partial<SimpleObject> = {}) : Promise<AxiosResponse<SimpleObject[]>> {
    return AxiosClient.get('/objects/search', {params: {limit: count, word, page, pagination, filter}})
  }
  static get(count: number, page=1, filter: Partial<SimpleObject> = null, pagination = true) : Promise<AxiosResponse<SimpleObject[]>> {
    return AxiosClient.get('/objects', {params: {limit: count, page, filter, pagination}});
  }
  static getSingle(id: number) : Promise<AxiosResponse<SimpleObject>> {
    return AxiosClient.get(`/objects/${id}`);
  }
  static save(id:number, data: Partial<SimpleObject>) : Promise<AxiosResponse<SimpleObject>> {
    return AxiosClient.put(`/objects/${id}`, data);
  }
  static create(data: Partial<SimpleObject>) : Promise<AxiosResponse<SimpleObject>> {
    return AxiosClient.post('/objects', data);
  }
}
