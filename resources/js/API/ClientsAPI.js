import axiosClient from "../axios-client.jsx";

export default class ClientsAPI {
    static get(count, page=1) {
        return axiosClient.get('/clients', {params: {limit: count, page}});
    }
    static search(count, page, word, pagination = true) {
        return axiosClient.get('/clients/searchAny', {params: {limit: count, word, page, pagination}})
    }
}
