import axiosClient from "@/lib/axios-client";

export class AddressesAPI {
    static search(count, page, word, pagination = true) {
        return axiosClient.get('/addresses/search', {params: {limit: count, word, page, pagination}})
    }
    static get(count, page=1, filter = null, pagination = true) {
        return axiosClient.get('/addresses', {params: {limit: count, page, filter, pagination}});
    }
    static indexWorker(worker_id) {
        return axiosClient.get('/addresses/worker', {params: {worker_id}});
    }
}
