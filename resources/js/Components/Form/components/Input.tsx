import React, {ChangeEventHandler, HTMLProps} from "react"
import useFormContext from "../contexts/FormContext";

type InputProps = Omit<HTMLProps<HTMLInputElement>, 'name'> & {
  name: string
}

export default function Input({name, value: _value, onChange: _onChange, ...props}: InputProps) {
  const {data, setData} = useFormContext<any>();
  // @ts-ignore
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => setData(name, e.target.value)
  return <input onChange={onChange} value={data[name]} {...props} />;
}
