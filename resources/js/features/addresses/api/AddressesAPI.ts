import AxiosClient from "@/lib/axios-client";

export class AddressesAPI {
  static search(count, page, word, pagination = true, filter = {}) {
    return AxiosClient.get('/addresses/search', {params: {limit: count, word, page, pagination, filter}})
  }
  static get(count, page=1, filter = null, pagination = true) {
    return AxiosClient.get('/addresses', {params: {limit: count, page, filter, pagination}});
  }
  static getCities() {
    return AxiosClient.get('/addresses/getCities');
  }
  static getSingle(id) {
    return AxiosClient.get(`/addresses/${id}`);
  }
  static getEntrances(address_id) {
    return AxiosClient.get(`/addresses/${address_id}/entrances`);
  }
}
