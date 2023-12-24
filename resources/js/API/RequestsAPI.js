import axiosClient from "../axios-client.jsx";

export default class RequestsAPI {
  static get(count, page = 1, order = null, filter = {}) {
    if(order == null)
      order = {id: 'asc'};

    const params = {
      limit: count, page, order, filter
    }
    return axiosClient.get(`/requests`, {params});
  }
}
