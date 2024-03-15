import AxiosClient from "@/lib/axios-client";
import {Entrance} from "../types";

export class EntrancesAPI {
  static getClients(id: number) {
    return AxiosClient.get(`/entrances/${id}/clients`);
  }
  static update(id: number, data: Partial<Entrance>) {
    return AxiosClient.put(`/entrances/${id}`, data);
  }
  static delete(id: number) {
    return AxiosClient.delete(`/entrances/${id}`);
  }
}
