import axiosClient from "../axios-client.jsx";

export default class ClientsAPI {
    static get(count, page=1) {
        return axiosClient.get(`/clients?limit=${count}&page=${page}`);
    }
}
