import React, {createContext, ReactNode, useContext, useState} from "react";

export type OptionValue = string | number | null | any;

type selectedOption = {value: OptionValue, dispatch: boolean, label: (ReactNode)}
type setSelectedOption = (value: Partial<selectedOption>, dispatch?: boolean) => void;

type SelectContext = {
    selectedOption: selectedOption, setSelectedOption: setSelectedOption,
    opened: boolean, setOpened: (state: boolean) => void,
    selectedValue: OptionValue, setSelectedValue: (v: OptionValue) => void,
    initialValue: OptionValue, setInitialValue: (v: OptionValue) => void,
}


const SelectContext = createContext<SelectContext>(null);

export function SelectContextProvider({children}) {
    const [selectedOption, _setSelectedOption] = useState(null);
    const [opened, setOpened] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [initialValue, setInitialValue] = useState(null);

    const setSelectedOption: setSelectedOption = (v, dispatch = true) => {
        v.dispatch = dispatch;
        _setSelectedOption(v);
    }

    return (
        <SelectContext.Provider value={{
            selectedOption, setSelectedOption,
            opened, setOpened,
            selectedValue, setSelectedValue,
            initialValue, setInitialValue
        }}>
            {children}
        </SelectContext.Provider>
    );
}

export const useSelectContext = () => useContext(SelectContext);
