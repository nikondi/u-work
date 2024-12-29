import {PropsWithChildren, ReactNode} from "react";
import {twMerge} from "tailwind-merge";

type Props = PropsWithChildren<{
  className?: string
  placeholder?: ReactNode
}>

export default function Empty({className, placeholder, children}: Props) {
  return children || placeholder || <span className={twMerge("text-gray-400", className)}>Пусто...</span>
}
