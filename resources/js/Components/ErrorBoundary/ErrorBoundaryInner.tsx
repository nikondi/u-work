import {Debug} from "./components";
import {BoundaryInnerProps} from "./types";

export default function ErrorBoundaryInner(props: BoundaryInnerProps) {
  return Debug(props);
}
