import {useMemo, useRef, useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import AxiosClient from "@/utils/axios-client";

type setDataByObject<TForm> = (data: TForm) => void;
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void;
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void;
type FormDataType = object;
type FormMethod = 'get' | 'patch' | 'post' | 'put' | 'delete';
type FormConfig<TResponse, TError> = Partial<{
  onSuccess: (response: TResponse, XHR: AxiosResponse<TResponse>) => void
  onError: (response: TError, XHR: AxiosError<TError>) => void
  onFinally: () => void
  onCancel: () => void
  onBefore: () => void
}>
export interface IAxiosForm<TForm extends FormDataType, TResponse = any, TError = any> {
  data: TForm;
  errors: Partial<Record<keyof TForm, string>>;
  hasErrors: boolean;
  processing: boolean;
  wasSuccessful: boolean;
  recentlySuccessful: boolean;
  setData: setDataByObject<TForm> & setDataByMethod<TForm> & setDataByKeyValuePair<TForm>;
  reset: (...fields: (keyof TForm)[]) => void;
  clearErrors: (...fields: (keyof TForm)[]) => void;
  get: (url: string, config?: FormConfig<TResponse, TError>) => void;
  patch: (url: string, config?: FormConfig<TResponse, TError>) => void;
  post: (url: string, config?: FormConfig<TResponse, TError>) => void;
  put: (url: string, config?: FormConfig<TResponse, TError>) => void;
  delete: (url: string, config?: FormConfig<TResponse, TError>) => void;
  cancel: () => void;
}
export function useAxios<TForm extends FormDataType, TResponse extends object = object, TError extends object = object>(initialValues?: TForm): IAxiosForm<TForm> {
  const [data, _setData] = useState(initialValues);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const controller = useRef<AbortController>(null);

  const setDataByKeyValue: setDataByKeyValuePair<TForm> = (key, value) => _setData((prev) => ({...prev, [key]: value}));
  const clearErrors = () => setErrors({});
  const reset = () => _setData(initialValues);
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, []);
  const cancel = () => {
    controller.current?.abort();
  };

  const sendForm = (method: FormMethod, url: string, config: FormConfig<TResponse, TError> = {}) => {
    clearErrors();
    config.onBefore && config.onBefore();
    setWasSuccessful(false);

    controller.current = new AbortController;

    const onFinally = () => {
      setProcessing(false);
      config.onFinally && config.onFinally();
    }

    const onError = (res: AxiosError<TError>) => {
      if(res.code == "ERR_CANCELED") {
        config.onCancel && config.onCancel();
        return;
      }

      // @ts-ignore
      const _errors = res.response?.data?.errors;
      if(_errors)
        setErrors(_errors);

      config.onError && config.onError(res.response.data, res);
    }
    const onSuccess = (response: AxiosResponse<TResponse>) => {
      setRecentlySuccessful(true);
      setWasSuccessful(true);
      setTimeout(() => setRecentlySuccessful(false), 2000);
      config.onSuccess(response.data, response);
    }
    setProcessing(true);
    switch(method) {
      case "put":
        AxiosClient.put(url, data, {signal: controller.current?.signal}).then(onSuccess).catch(onError).finally(onFinally); break;
      case "delete":
        AxiosClient.delete(url, {signal: controller.current?.signal}).then(onSuccess).catch(onError).finally(onFinally); break;
      case "patch":
        AxiosClient.patch(url, data, {signal: controller.current?.signal}).then(onSuccess).catch(onError).finally(onFinally); break;
      case "post":
        AxiosClient.post(url, data, {signal: controller.current?.signal}).then(onSuccess).catch(onError).finally(onFinally); break;
      case "get":
        AxiosClient.get(url, {params: data, signal: controller.current?.signal}).then(onSuccess).catch(onError).finally(onFinally); break;
    }
  }

  return {
    data,
    // @ts-ignore
    setData: (name, value) => {
      if(typeof name == "function") _setData(name)
      else if(typeof name == "string") setDataByKeyValue(name, value)
      else if(typeof name == "object") _setData(name)
    },
    processing,
    get: (url, config) => sendForm('get', url, config),
    post: (url, config) => sendForm('post', url, config),
    patch: (url, config) => sendForm('patch', url, config),
    put: (url, config) => sendForm('put', url, config),
    delete: (url, config) => sendForm('delete', url, config),
    errors,
    clearErrors,
    recentlySuccessful,
    wasSuccessful,
    hasErrors,
    reset,
    cancel
  };
}
