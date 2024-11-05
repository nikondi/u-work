import {ILoginForm} from "../types";
import {HTMLProps} from "react";
import {twMerge} from "tailwind-merge";
import {useFormContext} from "@/Components/Form";

type Props = Omit<HTMLProps<HTMLInputElement>, "name"> & {
  name: keyof ILoginForm
  label?: string
}

export default function Input({name, label, className, ...attributes}: Props) {
  const {data, setData} = useFormContext<ILoginForm>();

  return <div>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label || name}</label>
    <input type="text" name={name} id={name}
           className={twMerge("bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500", className)}
           placeholder={label}
           value={data[name] as string}
           onChange={(e) => setData(name, e.target.value)}
           {...attributes}/>
  </div>
}
