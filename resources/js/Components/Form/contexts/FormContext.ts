import {createContext, useContext} from "react";
import {FormContextType} from "@/Components/Form/types";

export const FormContext = createContext<FormContextType>(null);
const useFormContext = <T extends object>() => useContext<FormContextType<T>>(FormContext);
export default useFormContext;
