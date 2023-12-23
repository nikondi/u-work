export default function Textarea({name, item, setItem, label, ...attributes}) {
    if(attributes.value == null)
        attributes.value = '';

    return (
        <label>
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            <textarea type="text" placeholder={label} {...attributes} className={'form-input-textarea'+(attributes.disabled?' opacity-70':'')} />
        </label>
    )
}
