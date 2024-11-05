import React from "react";
import {LoadingArea as LoadingAreaComponent} from "@/Components";
import useFormContext from "@/Components/Form/contexts/FormContext";

export function LoadingArea() {
  const {processing} = useFormContext();
  return <LoadingAreaComponent show={processing}/>
}
