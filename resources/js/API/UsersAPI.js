import axiosClient from "../axios-client.jsx";

export default class UsersAPI {
    static get(count, page=1) {
        return axiosClient.get('/users', {params: {limit: count, page}});
    }
    static search(count, page, word, filter = null, pagination = true) {
        return axiosClient.get('/users/search', {params: {limit: count, word, page, pagination, filter}})
    }
}
