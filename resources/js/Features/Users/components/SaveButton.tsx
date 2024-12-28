import {useFormContext} from "@/Components/Form";
import React, {PropsWithChildren} from "react";

export default function SaveButton({children}: PropsWithChildren) {
  const {processing} = useFormContext();
  return <button type="submit" className="btn btn-primary py-3 px-7" disabled={processing}>{processing?'Загрузка...':children}</button>
}
