import React, {InputHTMLAttributes} from "react";
import {uniqName} from "../../helpers.js";
import {useMemo} from "react";

type Props = {
    inputRef?: React.Ref<HTMLInputElement>,
    label?: string,
    setValue?: ((v:string) => void) | stateFunction
}

export default function Input({name, className, inputRef=null, label=null, setValue = null, ...attributes}: InputHTMLAttributes<any> & Props) {
    const inputName = useMemo(() => {
        return name || uniqName();
    }, [name]);

    return <input ref={inputRef} name={inputName} placeholder={label}
                  onChange={(e) => setValue && setValue(e.target.value)}
                  {...attributes}
                  className={'form-input-text '+className+(attributes.disabled?' opacity-70':'')} />
}
