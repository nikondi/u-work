import {mergeClasses} from "../../../helpers.js";
import React, {PropsWithChildren, useEffect, useMemo, useState} from "react";
import SelectContextProvider, {useSelectContext} from "./SelectContextProvider.jsx";
import useOutsideClick from "../../../hooks/useOutsideClick.js";

type SelectProps = {
    onChange?: (v:OptionValue) => void,
    value?: OptionValue,
    label?: string|number,
    className?: string,
}

export default function Select({children, className = '', onChange=()=>{}, value, label, ...props}:PropsWithChildren<SelectProps>) {
    return (
        <SelectContextProvider>
            <SelectInner className={className} onChange={onChange} value={value} label={label} {...props}>
                {children}
            </SelectInner>
        </SelectContextProvider>
    )
}

type SelectInnerProps = {
    className?: string,
    onChange?: (value:OptionValue) => void,
    value?: OptionValue,
    label: string|number,
}

function SelectInner({className, children, onChange=()=>{}, value, label}: PropsWithChildren<SelectInnerProps>) {
    const {setSelectedValue, selectedOption, setOpened, opened} = useSelectContext();
    const headerRef = useOutsideClick(() => setOpened(false));

    useEffect(() => {
        onChange(selectedOption.value);
    }, [selectedOption]);

    useEffect(() => {
        if(value)
            setSelectedValue(value);
    }, []);

    return (<div className={'relative '+className}>
        <div className={`form-select-heading ${opened?'form-select-heading--opened':''}`}  onClick={() => setOpened(!opened)} ref={headerRef}>
            {selectedOption.label || label}
            <svg width="18" height="18" viewBox="0 0 451.847 451.847"><path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" fill="currentColor"></path></svg>
        </div>
        <div className="form-select-options">
            {children}
        </div>
    </div>)
}

type OptionValue = string | number;
type OptionProps = {
    value?: OptionValue,
    className?: string,
    index: number
}

export function Option({value, children, className = '', index}:PropsWithChildren<OptionProps>) {
    const classes = mergeClasses("form-select-option", className);
    const {setSelectedOption, selectedValue} = useSelectContext();
    const option = {value: value ?? index, label: children};

    useEffect(() => {
        if(selectedValue === value)
            setSelectedOption(option);
    }, [selectedValue]);

    return (<div onClick={() => {setSelectedOption(option)}} className={classes}>{children}</div>);
}
