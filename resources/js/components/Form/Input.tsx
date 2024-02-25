import React, {InputHTMLAttributes} from "react";
import {stateFunction} from "@/types";
import {useFormRowContext} from "@/components/Form/FormRow";

type Props = {
    inputRef?: React.Ref<HTMLInputElement>,
    label?: string,
    setValue?: ((v:string) => void)
}

export function Input({className = '', inputRef=null, label='', setValue = null, required = null, ...attributes}: InputHTMLAttributes<any> & Props) {
    const rowContext = useFormRowContext();
    label = (label || (label == '' && label)) || rowContext?.label;
    required = (required == null)?rowContext?.required:required;

    return <input ref={inputRef}
                  placeholder={label}
                  onChange={(e) => setValue && setValue(e.target.value)}
                  required={required}
                  {...attributes}
                  className={'form-input-text '+className+(attributes.disabled?' opacity-70':'')} />
}
