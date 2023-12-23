import {mergeClasses} from "../../helpers.jsx";
import {useEffect, useMemo, useState} from "react";
import SelectContextProvider, {useSelectContext} from "../../contexts/SelectContextProvider.jsx";
import useOutsideClick from "../../hooks/useOutsideClick.js";

export default function Select({children, onChange=(v)=>{}, value, label, ...props}) {
    return (
        <SelectContextProvider>
            <SelectInner onChange={onChange} value={value} label={label} {...props}>
                {children}
            </SelectInner>
        </SelectContextProvider>
    )
}

function SelectInner({className, children, onChange=(v)=>{}, value, label}) {
    const [defaultClasses, setDefaultClasses] = useState('form-select-heading');
    const {setSelectedValue, selectedOption, setOpened, opened} = useSelectContext();
    const headerRef = useOutsideClick(() => setOpened(false));

    useEffect(() => {
        onChange(selectedOption.value);
    }, [selectedOption.value]);

    const classes = useMemo(() => {
        return mergeClasses(defaultClasses, className);
    }, [defaultClasses]);

    useEffect(() => {
        if(value)
            setSelectedValue(value);
    }, []);


    useEffect(() => {
        if(opened)
            setDefaultClasses('form-select-heading form-select-heading--opened');
        else
            setDefaultClasses('form-select-heading');
    }, [opened]);


    return (<>
        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        <div className="relative">
            <div className={classes} onClick={() => setOpened(!opened)} ref={headerRef}>
                {selectedOption.label || label}
                <svg width="18" height="18" viewBox="0 0 451.847 451.847"><path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" fill="currentColor"></path></svg>
            </div>
            <div className="form-select-options">
                {children}
            </div>
        </div>
    </>)
}


export function Option({value, children, className, index}) {
    const classes = mergeClasses("form-select-option", className);
    const {setSelectedOption, selectedValue} = useSelectContext();
    const option = {value: value ?? index, label: children};

    useEffect(() => {
        if(selectedValue == value)
            setSelectedOption(option);
    }, [selectedValue]);

    return (<div onClick={() => {setSelectedOption(option)}} className={classes}>{children}</div>);
}
