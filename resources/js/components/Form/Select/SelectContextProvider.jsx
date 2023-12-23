import {createContext, useContext, useState} from "react";

const SelectContext = createContext({
    selectedOption: {},
    setSelectedOption: () => {},
    opened: false,
    setOpened: () => {},
    selectedValue: '',
    setSelectedValue: () => {},
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
