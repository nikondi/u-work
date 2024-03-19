import {Client, ClientRaw} from "../types";
import AxiosClient from "@/lib/axios-client";
import {Response} from "@/types";
import API from "@/lib/api";

export class ClientsAPI extends API {
  static get(count: number, page = 1, filter: Partial<ClientRaw> = null) {
    return AxiosClient.get('/clients', {params: {limit: count, page, filter}});
  }
  static search(count: number, page: number, word: string, pagination = true) {
    return AxiosClient.get('/clients/searchAny', {params: {limit: count, word, page, pagination}})
  }
  static searchNotInAddress(count: number, word: string, address_id: number) {
    return this._prepare<Response<Client[]>>((controller) => AxiosClient.get(`/clients/searchNotInAddress/${address_id}`, {params: {limit: count, word}, signal: controller.signal}));
  }
  static getNotInAddress(count: number, address_id: number) {
    return this._prepare<Response<Client[]>>((controller) => AxiosClient.get(`/clients/getNotInAddress/${address_id}`, {params: {limit: count}, signal: controller.signal}));
  }
  static getSingle(id: number) {
    return AxiosClient.get(`/clients/${id}`);
  }
  static update(id: number, data: ClientRaw) {
    return AxiosClient.put('/clients/'+id, data);
  }

  static create(data: ClientRaw) {
    return AxiosClient.post(`/clients`, data);
  }
}
