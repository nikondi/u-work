import {ClientRaw} from "../types";
import AxiosClient from "@/lib/axios-client";

export class ClientsAPI {
  static get(count: number, page = 1, filter: Partial<ClientRaw> = null) {
    return AxiosClient.get('/clients', {params: {limit: count, page, filter}});
  }
  static search(count: number, page: number, word: string, pagination = true) {
    return AxiosClient.get('/clients/searchAny', {params: {limit: count, word, page, pagination}})
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
