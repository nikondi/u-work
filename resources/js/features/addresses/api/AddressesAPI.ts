import AxiosClient from "@/lib/axios-client";
import {AxiosResponse} from "axios";
import {ClientEntrance} from "@/features/clients";
import {Response} from "@/types";

export class AddressesAPI {
  static search(count, page, word, pagination = true, filter = {}) {
    return AxiosClient.get('/addresses/search', {params: {limit: count, word, page, pagination, filter}})
  }
  static get(count, page=1, filter = null, pagination = true) {
    return AxiosClient.get('/addresses', {params: {limit: count, page, filter, pagination}});
  }
  static getCities() {
    return AxiosClient.get('/addresses/getCities');
  }
  static getSingle(id) {
    return AxiosClient.get(`/addresses/${id}`);
  }
  static getEntrances(address_id) {
    return AxiosClient.get(`/addresses/${address_id}/entrances`);
  }
  static getClients(address_id: number) : Promise<AxiosResponse<Response<ClientEntrance[]>>> {
    return AxiosClient.get(`/addresses/${address_id}/getClients`);
  }
  static saveClients(address_id: number, clients: ({client_id: number, entrance_id: number, entrance: number})[]) {
    return AxiosClient.post(`/addresses/${address_id}/saveClients`, {clients});
  }
}
