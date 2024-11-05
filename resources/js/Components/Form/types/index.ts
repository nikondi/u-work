import {FormDataConvertible, Method, Progress, VisitOptions} from "@inertiajs/core";
import {IAxiosForm} from "@/hooks/useAxios";
import {FormEvent} from "react";

type setDataByObject<TForm> = (data: TForm) => void;
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void;
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void;
type FormDataType = object;
export interface InertiaFormProps<TForm extends FormDataType> {
  data: TForm;
  isDirty: boolean;
  errors: Partial<Record<keyof TForm, string>>;
  hasErrors: boolean;
  processing: boolean;
  progress: Progress | null;
  wasSuccessful: boolean;
  recentlySuccessful: boolean;
  setData: setDataByObject<TForm> & setDataByMethod<TForm> & setDataByKeyValuePair<TForm>;
  transform: (callback: (data: TForm) => TForm) => void;
  setDefaults(): void;
  setDefaults(field: keyof TForm, value: FormDataConvertible): void;
  setDefaults(fields: Partial<TForm>): void;
  reset: (...fields: (keyof TForm)[]) => void;
  clearErrors: (...fields: (keyof TForm)[]) => void;
  setError(field: keyof TForm, value: string): void;
  setError(errors: Record<keyof TForm, string>): void;
  submit: (method: Method, url: string, options?: VisitOptions) => void;
  get: (url: string, options?: VisitOptions) => void;
  patch: (url: string, options?: VisitOptions) => void;
  post: (url: string, options?: VisitOptions) => void;
  put: (url: string, options?: VisitOptions) => void;
  delete: (url: string, options?: VisitOptions) => void;
  cancel: () => void;
}


export type FormContextType<T extends object = any> = InertiaFormProps<T> | IAxiosForm<T>
export type FormHandler<TForm extends object = any> = (e: FormEvent<HTMLFormElement>, form: FormContextType<TForm>) => void;
