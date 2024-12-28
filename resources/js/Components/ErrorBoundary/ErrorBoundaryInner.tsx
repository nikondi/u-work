import {Debug, Guest} from "./components";
import {BoundaryInnerProps} from "./types";
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

export default function ErrorBoundaryInner(props: BoundaryInnerProps) {
  const {is_admin} = usePage<PageProps>().props;
  return is_admin
    ? Debug(props)
    : Guest(props)
}
