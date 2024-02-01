import React, {createContext, useContext, useState} from "react";

export type OptionValue = string | number | null | any;

type setSelectedOption = (value: OptionValue, dispatch?: boolean) => void;
type selectedOption = {value: OptionValue, dispatch: boolean, label: (React.JSX.Element | string)}

type SelectContext = {
    selectedOption: selectedOption, setSelectedOption: setSelectedOption,
    opened: boolean, setOpened: (state: boolean) => void,
    selectedValue: OptionValue, setSelectedValue: (v: OptionValue) => void,
    initialValue: OptionValue, setInitialValue: (v: OptionValue) => void,
}


const SelectContext = createContext<SelectContext>(null);

export default function SelectContextProvider({children}) {
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
