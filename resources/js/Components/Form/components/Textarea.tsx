import React, {ChangeEventHandler, HTMLProps} from "react"
import useFormContext from "../contexts/FormContext";
import {twMerge} from "tailwind-merge";

type InputProps = Omit<HTMLProps<HTMLTextAreaElement>, 'name'> & {
  name: string
}

export default function Input({name, value: _value, className, onChange: _onChange, ...props}: InputProps) {
  const {data, setData} = useFormContext<any>();
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => setData(name, e.target.value)
  return <textarea onChange={onChange} className={twMerge('form-input-text', className, props.disabled && 'opacity-70')} value={data[name] || ''} {...props} />;
}
