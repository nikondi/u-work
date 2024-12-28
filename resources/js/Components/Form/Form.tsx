import {FormEvent, FormHTMLAttributes, PropsWithChildren, ReactNode} from "react";
import {useForm} from "@inertiajs/react";
import {FormHandler, InertiaFormProps} from "./types";
import {FormContext} from "./contexts/FormContext";

type Props = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onSubmit: FormHandler
  initialData: object
}

const Form = ({onSubmit, initialData, children, ...props}: PropsWithChildren<Props> & {children: (<T extends object = any>(form: InertiaFormProps<T>) => ReactNode) | ReactNode}) => {
  const form = useForm<any>(initialData);
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

export default Form;
