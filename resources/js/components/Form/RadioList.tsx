import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {stateFunction} from "@/types";

type RadioContext = {
    _value: any,
    setValue: (v: any) => void,
    name: string,
    selectedRadio: SelectedRadio,
    setSelectedRadio: stateFunction<SelectedRadio>,
}
type RadioListProps = {
    value: any,
    onChange: (value: any) => void,
    name: string
}

type SelectedRadio = {
    dispatch: boolean,
    value: any
}


const RadioContext = createContext<RadioContext>(null);

export function RadioList({value = null, onChange = null, name, children}: PropsWithChildren<RadioListProps>) {
    return (
        <RadioContextProvider value={value} name={name}>
            <RadioListInner name={name} value={value} onChange={onChange}>{children}</RadioListInner>
        </RadioContextProvider>
    )
}

function RadioListInner({value, onChange, children}: PropsWithChildren<RadioListProps>) {
    const {setValue, setSelectedRadio, selectedRadio} = useContext(RadioContext)

    useEffect(() => {
        setSelectedRadio({value, dispatch: false});
    }, [value]);

    useEffect(() => {
        if(!selectedRadio)
            return;

        setValue(selectedRadio.value);

        if(selectedRadio.dispatch)
            onChange(selectedRadio.value);
    }, [selectedRadio]);

    return <div>
        {children}
    </div>;
}

type RadioProps = {
    value: any,
    className?: string
}

export function Radio({value, className = '', children}: PropsWithChildren<RadioProps>) {
    const {_value, setSelectedRadio, selectedRadio, name} = useContext(RadioContext)

    const checked = useMemo(() => {
        return value == selectedRadio?.value;
    }, [selectedRadio?.value, value]);

    useEffect(() => {
        if(_value == value)
            setSelectedRadio({value, dispatch: false});
    }, [_value]);

    const onChange = useCallback(() => {
        setSelectedRadio({value, dispatch: true});
    }, [value, setSelectedRadio]);

    return <>
        <label className={'radio '+className}>
            <input type="radio" name={name} onChange={onChange} checked={checked}/>
            <span className="radio-mark"></span>
            {children}
        </label>
    </>;
}


function RadioContextProvider({value, name, children}: PropsWithChildren<{value: any, name: string}>) {
    const [_value, setValue] = useState(value);
    const [selectedRadio, setSelectedRadio] = useState(null);

    return <RadioContext.Provider value={{
        name,
        _value, setValue,
        selectedRadio, setSelectedRadio
    }}>
        {children}
    </RadioContext.Provider>;
}
