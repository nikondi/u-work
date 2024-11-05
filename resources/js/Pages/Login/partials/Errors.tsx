import React from "react";
import {useFormContext} from "@/Components/Form";
import {ILoginForm} from "../types";

export default function Errors() {
  const {errors} = useFormContext<ILoginForm>();

  return Object.keys(errors).length > 0 &&
    <div className="bg-red-50 border-l-8 border-red-900 p-4 max-w-4xl mx-auto dark:bg-gray-900">
      <div className="pl-5 pr-4 text-red-400">
        {Object.keys(errors).map(key => (
          // @ts-ignore
          <li key={key} className="text-md text-sm">{errors[key]}</li>
        ))}
      </div>
    </div>
}
