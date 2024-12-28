import {Input as FormInput, Row} from "@/Components/Form";
import {HTMLProps} from "react";
import {IUserForm} from "../types";

type Props = {
  label: string
  name: keyof IUserForm
  required?: boolean
} & HTMLProps<HTMLInputElement>

export default function Input({label, name, className, required = false, ...attributes}: Props) {
  return <Row label={label} required={required} className={className}>
    <FormInput name={name} required={required} placeholder={label} {...attributes}/>
  </Row>
}
