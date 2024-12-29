import React, {PropsWithChildren} from "react";

type Props = PropsWithChildren<{
  name: string
  contentClassName?: string
  required?: boolean
}>

export default function SubBlock({name, contentClassName = "", required = false, children}: Props) {
  return <div>
    <div className="text-xs text-gray-500 dark:text-gray-300">{name} {required && <span className="text-red-500 text-2xl" style={{lineHeight: '7px'}}>•</span>}</div>
    <div className={"text-base dark:text-white "+contentClassName}>{children || <span className="text-gray-400">Пусто</span>}</div>
  </div>
}
