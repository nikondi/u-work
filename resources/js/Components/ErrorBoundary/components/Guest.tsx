import {Skeleton} from "@/Components";
import {BoundaryInnerProps} from "../types";
import {mergeClass} from "@/helpers";

export default function Guest({className}: BoundaryInnerProps) {
  return <Skeleton className={mergeClass("fallback-guest", className)} style={{height: 40, margin: "10px 0"}}/>
}
