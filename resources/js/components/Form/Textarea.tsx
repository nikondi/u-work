import React, {ChangeEventHandler, TextareaHTMLAttributes} from "react";
import {useFormRowContext} from "@/components/Form/FormRow";

type Props = {
  setValue?: (v: string) => void,
  label?: string,
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({setValue, label = '', ...props}: Props) {
  const rowContext = useFormRowContext();
  label = (label || (label == '' && label)) || rowContext?.label;

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (props.onChange)
      props.onChange(e);
    setValue(e.target.value);
  }

  return <textarea {...props} placeholder={label} onChange={onChange} className={'form-input-textarea ' + props.className + (props.disabled ? ' opacity-70' : '')}/>;

}
