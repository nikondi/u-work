import AxiosClient from "@/lib/axios-client";
import {Entrance} from "../types";
import API from "@/lib/api";

export class EntrancesAPI extends API {
  static getClients(id: number) {
    return this._prepare((controller) => AxiosClient.get(`/entrances/${id}/clients`, {signal: controller.signal}));
  }
  static update(id: number, data: Partial<Entrance>) {
    return AxiosClient.put(`/entrances/${id}`, data);
  }
  static delete(id: number) {
    return AxiosClient.delete(`/entrances/${id}`);
  }
  static addClients(entrance_id: number, entrance: number, address_id: number, client_ids: number[]) {
    return AxiosClient.post(`/entrances/addClients`, {entrance_id, entrance, client_ids, address_id});
  }
}
