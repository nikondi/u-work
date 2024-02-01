import axiosClient from "@/lib/axios-client";

export class RequestsAPI {
    static get(count, page = 1, order = null, filter = {}) {
        if(order == null)
            order = {id: 'asc'};

        const params = {
            limit: count, page, order, filter
        }
        return axiosClient.get(`/requests`, {params});
    };
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
