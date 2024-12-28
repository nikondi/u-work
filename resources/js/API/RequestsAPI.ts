import AxiosClient from "@/lib/axios-client";
import {TRequest} from "@/Features/Requests/types";

export default class RequestsAPI {
    static get(count: number, page = 1, order: Partial<Record<keyof TRequest, 'asc' | 'desc'>> = null, filter: Partial<TRequest> = {}) {
        if(order == null)
            order = {id: 'asc'};

        const params = {
            limit: count, page, order, filter
        }
        return AxiosClient.get(`/requests`, {params});
    };
    static async single(id: number) {
        const response = await AxiosClient.get(`/requests/${id}`);
        return response.data;
    }
    static create(data: Partial<TRequest>) {
        return AxiosClient.post(`/requests`, data);
    }
    static async update(id: number, data: Partial<TRequest>) {
        return AxiosClient.put(`/requests/${id}`, data);
    }
    static async updateOrder(items: { id: number, order: number }[]) {
        return AxiosClient.post(`/requests/updateOrder`, items);
    }
}
