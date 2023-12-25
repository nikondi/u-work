export default function Textarea({name='', item={}, setItem=(item)=>{}, label='', ...attributes}) {
    if(attributes.value == null)
        attributes.value = '';

    return (
        <textarea name={name} placeholder={label} {...attributes} className={'form-input-textarea'+(attributes.disabled?' opacity-70':'')} />
    )
}
