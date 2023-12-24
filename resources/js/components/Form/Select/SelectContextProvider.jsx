import {createContext, useContext, useState} from "react";

const SelectContext = createContext({
    selectedOption: {},
    setSelectedOption: (v) => {},
    opened: false,
    setOpened: (v) => {},
    selectedValue: '',
    setSelectedValue: (v) => {},
});


export default function SelectContextProvider({children}) {
    const [selectedOption, setSelectedOption] = useState({});
    const [opened, setOpened] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    return (
        <SelectContext.Provider value={{
            selectedOption,
            setSelectedOption,
            opened,
            setOpened,
            selectedValue,
            setSelectedValue,
        }}>
            {children}
        </SelectContext.Provider>
    );
}

export const useSelectContext = () => useContext(SelectContext);
