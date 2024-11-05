import React, {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

type Props = PropsWithChildren<{
  className?: string
  label?: string
  required?: boolean
}>

export default function Row({className, label, required, children}: Props) {
  return <div className={twMerge('form-row', className)}>
    {label && <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label} {required && <span className="text-red-600 dark:text-red-400">*</span>}</div>}
    {children}
  </div>
}
