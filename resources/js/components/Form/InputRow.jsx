export default function InputRow({inputRef, name, label, ...attributes}) {
    if(attributes.value == null)
        attributes.value = '';

    return (
        <label>
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            <input ref={inputRef} type="text" placeholder={label} {...attributes} className={'form-input-text'+(attributes.disabled?' opacity-70':'')} />
        </label>
    )
}
