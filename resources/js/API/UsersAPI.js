import axiosClient from "../axios-client.jsx";

export default class UsersAPI {
    static get(count, page=1, filter, pagination = true) {
        return axiosClient.get('/users', {params: {limit: count, page, filter, pagination}});
    }
    static search(count, page, word, filter = null, params = {}, pagination = true) {
        return axiosClient.get('/users/search', {params: {limit: count, word, page, pagination, filter, ...params}})
    }
}
