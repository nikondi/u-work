export default function Input({inputRef=null, type = "text", name='', label=null, value, setValue = null, required = false, className = '', ...attributes}) {
    return <input ref={inputRef} name={name} type={type} placeholder={label}
                  onChange={(e) => setValue && setValue(e.target.value)}
                  value={value} required={required}
                  {...attributes}
                  className={'form-input-text '+className+(attributes.disabled?' opacity-70':'')} />
}
