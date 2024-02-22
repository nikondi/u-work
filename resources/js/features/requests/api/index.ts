import AxiosClient from "@/lib/axios-client";

export class RequestsAPI {
    static get(count, page = 1, order = null, filter = {}) {
        if(order == null)
            order = {id: 'asc'};

        const params = {
            limit: count, page, order, filter
        }
        return AxiosClient.get(`/requests`, {params});
    };
    static async single(id) {
        const response = await AxiosClient.get(`/requests/${id}`);
        return response.data;
    }
    static create(data) {
        return AxiosClient.post(`/requests`, data);
    }
    static async update(id, data) {
        return AxiosClient.put(`/requests/${id}`, data);
    }
    static async updateOrder(items) {
        return AxiosClient.post(`/requests/updateOrder`, items);
    }
}
