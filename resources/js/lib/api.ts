import {AxiosResponse} from "axios";

type Answer<T> = {
  getResult: Promise<AxiosResponse<T>>
  abort: () => void
}

export default class API {
  static _prepare<T = any>(callback: ((controller: AbortController) => Promise<AxiosResponse<T>>)): Answer<T> {
    const controller = new AbortController();
    return {
      getResult: callback(controller),
      abort: (reason: string = '_abort') => controller.abort(reason),
    };
  }
}
