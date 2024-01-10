export default function Textarea({name='', value='', setValue = null, onChange = null, label='', ...attributes}) {
    if(onChange == null) {
        onChange = (e) => {
            if(setValue)
                setValue(e.target.value);
        }
    }

    return (
        <textarea name={name} placeholder={label} onChange={onChange} {...attributes} className={'form-input-textarea'+(attributes.disabled?' opacity-70':'')} />
    )
}
