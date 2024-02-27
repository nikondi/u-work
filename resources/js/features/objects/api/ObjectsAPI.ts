import AxiosClient from "@/lib/axios-client";
import {AxiosResponse} from "axios";
import {Objects} from "../types";

export class ObjectsAPI {
  static getSingle(id: number) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.get(`/objects/${id}`);
  }
  static save(id:number, data: Partial<Objects>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.put(`/objects/${id}`, data);
  }
  static create(data: Partial<Objects>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.post('/objects', data);
  }

  static saveAddress(address_id: number, data: Partial<ObjectsAPI>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.put(`/addresses/${address_id}/object`, data);
  }
  static createAddress(address_id: number, data: Partial<ObjectsAPI>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.post(`/addresses/${address_id}/object`, data);
  }
}
