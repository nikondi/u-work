import {PropsWithChildren, useState} from "react";
import {EditableContext} from "./EditableContext";

type Props = PropsWithChildren<{
  onChange?: (isEdit: boolean) => void
  initial?: boolean
}>

export default function EditableProvider({onChange, initial = false, children}: Props) {
  const [isEdit, _setIsEdit] = useState(initial);
  const setIsEdit = (state: boolean) => {
    onChange && onChange(state);

    _setIsEdit(state);
  }
  return <EditableContext.Provider value={{
    isEdit, setIsEdit
  }}>
    {children}
  </EditableContext.Provider>;
}
