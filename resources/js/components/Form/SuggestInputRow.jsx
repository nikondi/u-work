import {AddressSuggestions} from "react-dadata";
import {useMapContext} from "../../contexts/MapContextProvider.jsx";

const token = "237e4802390a7189bd43b4c069e44fae28b5c58d";

export default function SuggestInputRow({name, suggestRef, defaultQuery, label, query, onSelected=(data)=>{}, onChangeInput = (ev)=>{}, ...attributes}) {
    if(attributes.value == null)
        attributes.value = '';

    return (
        <label>
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            <AddressSuggestions
                ref={suggestRef}
                token={token}
                defaultQuery={defaultQuery}
                query={query}
                onChange={onSelected}
                delay={300}
                minChars={3}
                inputProps={{
                    ...attributes,
                    className: 'form-input-text'+(attributes.disabled?' opacity-70':''),
                    placeholder: label,
                    onChange: onChangeInput,
                }}
                containerClassName="relative"
                suggestionClassName="suggestion"
                suggestionsClassName="suggestions"
            />

        </label>
    )
}
