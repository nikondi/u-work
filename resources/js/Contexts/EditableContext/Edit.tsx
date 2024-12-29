import {PropsWithChildren} from "react";
import useEditable from "./EditableContext";

export default function Edit({children}: PropsWithChildren) {
  const {isEdit} = useEditable();
  return isEdit && children;
}
