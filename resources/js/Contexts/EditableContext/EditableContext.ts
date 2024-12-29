import {createContext, useContext} from "react";
import {IEditableContext} from "./types";

export const EditableContext = createContext<IEditableContext>(null);
const useEditable = () => useContext(EditableContext);

export default useEditable;
