import AxiosClient from "@/lib/axios-client";
import {AxiosResponse} from "axios";
import {Objects} from "../types";

type ObjectRelations = 'addresses' | 'entrances';

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

  static createMorphed(id: number, relation: ObjectRelations, data: Partial<ObjectsAPI>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.post(`/${relation}/${id}/object`, data);
  }
  static saveMorphed(id: number, relation: ObjectRelations, data: Partial<ObjectsAPI>) : Promise<AxiosResponse<Objects>> {
    return AxiosClient.put(`/${relation}/${id}/object`, data);
  }
}
