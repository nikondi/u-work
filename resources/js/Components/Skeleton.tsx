import {mergeClass} from "@/helpers";
import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export default function Skeleton({className, ...attrs}: Props) {
  return <div className={mergeClass("skeleton", className)} {...attrs}/>
}
