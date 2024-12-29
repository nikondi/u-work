import React, {PropsWithChildren} from "react";

type Props = PropsWithChildren<{
  name: string
}>

export default function Block({name, children}: Props) {
  return <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4">
    <div className="text-gray-700 dark:text-gray-300 uppercase text-xs pb-2 mb-2 border-b border-gray-300">{name}</div>
    <div className="flex flex-col gap-y-2 dark:text-white">{children}</div>
  </div>
}

