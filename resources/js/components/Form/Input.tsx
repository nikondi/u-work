import React, {InputHTMLAttributes} from "react";
import {uniqName} from "../../helpers.js";
import {useMemo} from "react";

type Props = {
    inputRef?: React.Ref<HTMLInputElement>,
    label?: string,
    setValue?: ((v:string) => void) | stateFunction
}

export default function Input({inputRef=null, type = "text", name=null, label=null, value, setValue = null, required = false, className = '', ...attributes}: InputHTMLAttributes<any> & Props) {
    const inputName = useMemo(() => {
        return name || uniqName();
    }, [name]);

    return <input ref={inputRef} name={inputName} type={type} placeholder={label}
                  onChange={(e) => setValue && setValue(e.target.value)}
                  value={value} required={required}
                  {...attributes}
                  className={'form-input-text '+className+(attributes.disabled?' opacity-70':'')} />
}
