import {createContext, useContext, useState} from "react";

const SelectContext = createContext({
    selectedOption: {}, setSelectedOption: (v, d) => {},
    opened: false, setOpened: (v) => {},
    selectedValue: '', setSelectedValue: (v) => {},
    initialValue: '', setInitialValue: (v) => {},
});


export default function SelectContextProvider({children}) {
    const [selectedOption, _setSelectedOption] = useState({});
    const [opened, setOpened] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [initialValue, setInitialValue] = useState(null);

    const setSelectedOption = (v, dispatch = true) => {
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
