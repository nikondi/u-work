import axiosClient from "../axios-client.jsx";

export default class AddressesAPI {
    static search(count, page, word, pagination = true) {
        return axiosClient.get('/addresses/search', {params: {limit: count, word, page, pagination}})
    }
}
