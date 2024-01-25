import axiosClient from "../axios-client.jsx";
import {Client} from "../views/Client/Clients.js";

export type RequestStatus = 'new' | 'done' | 'important' | 'unknown';
type RequestSource = "unisite" | "uniwork" | "tomoru" | string;

export type Request = {
  id:number,
  type: string,
  order: number,
  source:  RequestSource,
  subject: string,
  client?: Client,
  worker: | user | null,
    client_name?: string,
    client_phone: number|string,
    client_phone_contact?: number|string,
    email: string,
    addressDB?: Address,
    address?: string,
    content: string,
    status: RequestStatus,
    created: string,
}

export default class RequestsAPI {
  static get(count, page = 1, order = null, filter = {}) {
    if(order == null)
      order = {id: 'asc'};

    const params = {
      limit: count, page, order, filter
    }
    return axiosClient.get(`/requests`, {params});
  }
  static async single(id) {
    const response = await axiosClient.get(`/requests/${id}`);
    return response.data;
  }
  static create(data) {
    return axiosClient.post(`/requests`, data);
  }
  static async update(id, data) {
    return axiosClient.put(`/requests/${id}`, data);
  }
  static async updateOrder(items) {
    return axiosClient.post(`/requests/updateOrder`, items);
  }
}
