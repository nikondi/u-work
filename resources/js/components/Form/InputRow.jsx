import {uniqName} from "../../helpers.js";
import {useMemo} from "react";

export default function Input({inputRef=null, type = "text", name=null, label=null, value, setValue = null, required = false, className = '', ...attributes}) {
    const inputName = useMemo(() => {
        return name || uniqName();
    }, [name]);

    return <input ref={inputRef} name={inputName} type={type} placeholder={label}
                  onChange={(e) => setValue && setValue(e.target.value)}
                  value={value} required={required}
                  {...attributes}
                  className={'form-input-text '+className+(attributes.disabled?' opacity-70':'')} />
}
