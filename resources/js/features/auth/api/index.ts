import AxiosClient from "@/lib/axios-client";

export class UsersAPI {
    static get(count, page=1, filter, pagination = true) {
        return AxiosClient.get('/users', {params: {limit: count, page, filter, pagination}});
    }
    static search(count, page, word, filter = null, params = {}, pagination = true) {
        return AxiosClient.get('/users/search', {params: {limit: count, word, page, pagination, filter, ...params}})
    }
    static getSingle(id) {
        return AxiosClient.get('/users/'+id);
    }
    static create(data) {
        return AxiosClient.post('/users/add', data);
    }
    static update(id, data) {
        return AxiosClient.put('/users/'+id, data);
    }
    static delete(id) {
        return AxiosClient.delete(`/users/${id}`);
    }
}
