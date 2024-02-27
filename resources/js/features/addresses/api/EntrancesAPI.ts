import AxiosClient from "@/lib/axios-client";

export class EntrancesAPI {
  static getClients(id: number) {
    return AxiosClient.get(`/entrances/${id}/clients`);
  }
}
