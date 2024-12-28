import React, {ChangeEventHandler, InputHTMLAttributes, PropsWithChildren} from "react";
import Icon from "@/Components/Icon";
import './checkbox.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  setValue?: ((v: boolean) => void),
  markClass?: string,
  wrapClass?: string
}

export function Checkbox({children, setValue, markClass = '', wrapClass = '', ...props}: PropsWithChildren<Props>) {
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if(props.onChange)
      props.onChange(e);
    setValue(e.target.checked);
  }
  return <label className={`checkbox-wrap pb-2 pt-2 ${wrapClass}`}>
    <input type="checkbox" name={props.name} {...props} onChange={onChange} />
    <span className={`checkbox-mark ${markClass}`}>
      <Icon icon="check" width=".61em" height=".61em" />
    </span>
    <span>{children}</span>
  </label>
}
