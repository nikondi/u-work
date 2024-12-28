import {mergeClass} from "@/helpers";
import {ParsedLine} from "../types";

type Props = {
  line: ParsedLine,
  className?: string
}
export default function StackLine({line, className}: Props) {
  if(typeof line == 'string')
    return <div className={mergeClass('fallback-stack-line', className)}>{line}</div>;
  const is_app = line.file.includes('resources/js') && !line.function.includes('__require') && !line.function.includes('node_modules') && !line.file.includes('node_modules');

  return <div className={mergeClass('fallback-stack-line', !is_app && 'text-gray-400', className)}>
    <b>{line.function}</b> {line.file.replace(new RegExp(`(http|https):\/\/${location.hostname}(:[0-9]*)?`), '')} {line.line}:{line.char}
  </div>
}
