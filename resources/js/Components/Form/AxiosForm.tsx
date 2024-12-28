import {FormEvent, FormHTMLAttributes, PropsWithChildren, ReactNode} from "react";
import {IAxiosForm, useAxios} from "@/hooks/useAxios";
import {FormContext} from "./contexts/FormContext";
import {FormHandler} from "./types";

type Props = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onSubmit: FormHandler
  initialData: object
}

const AxiosForm = ({onSubmit, initialData, children, ...props}: PropsWithChildren<Props> & {children: (<T extends object = any>(form: IAxiosForm<T>) => ReactNode) | ReactNode}) => {
  const form = useAxios<any>(initialData);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    if(onSubmit) {
      e.preventDefault()
      onSubmit(form, e);
    }
  }
  return (
    <FormContext.Provider value={form}>
      <form {...props} onSubmit={submit}>
        {typeof children == 'function'
          ? children(form)
          : children
        }
      </form>
    </FormContext.Provider>
  );
};

export default AxiosForm;
