import React from "react";

type Props = {
  error: string
}

export default function FormError({error}: Props) {
  return error && <div className="contacts-form__column w-full mt-2">
    <div className="mt-2 px-4 py-2 rounded-md bg-red-500 w-full text-white">
      {error}
    </div>
  </div>
}
