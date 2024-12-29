import {IEditableContext} from "@/Contexts/EditableContext/types";
import {ReactNode} from "react";
import useEditable from "@/Contexts/EditableContext/EditableContext";

type Props = {
  component: (setIsEdit: IEditableContext['setIsEdit'], isEdit: boolean) => ReactNode
}

export default function EditToggle({component}: Props) {
  const {setIsEdit, isEdit} = useEditable();
  return component(setIsEdit, isEdit);
}
