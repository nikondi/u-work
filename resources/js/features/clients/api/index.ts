import axiosClient from "@/lib/axios-client";

export class ClientsAPI {
    static get(count, page=1) {
        return axiosClient.get('/clients', {params: {limit: count, page}});
    }
    static search(count, page, word, pagination = true) {
        return axiosClient.get('/clients/searchAny', {params: {limit: count, word, page, pagination}})
    }
    static getSingle(id) {
        return axiosClient.get(`/clients/${id}`);
    }
    static update(id, data) {
        return axiosClient.put('/clients/'+id, data);
    }
    static create(data) {
        return axiosClient.post(`/clients`, data);
    }
}
