import {useMemo, useState} from "react";
import StackLine from "./StackLine";
import {parseStack} from "../helpers";
import {BoundaryInnerProps} from "../types";


export default function Debug({error, debugInfo}: BoundaryInnerProps) {
  const [opened, setOpened] = useState(false);
  const stack = useMemo(() => parseStack(error.stack), [error.stack]);

  return <div className="fallback">
    <div className="fallback__title">Произошла ошибка{debugInfo?.componentName && `: ${debugInfo?.componentName}`}</div>
    {error && <>
      <div className="fallback__inner">
        {stack && <div className="fallback-stack-line fallback-stack-line--first"><StackLine line={stack[0]}/></div>}
        <div className="fallback__message">{error.message}</div>
      </div>
      {stack && <>
        <button onClick={() => setOpened((prev) => !prev)} className="fallback__button">{opened ? 'Закрыть' : 'Открыть'} стек</button>
        {opened && <div className="fallback__stack">
            {stack.map((line, i) => <StackLine line={line} key={i}/>)}
        </div>}
      </>}
    </>}
  </div>
}
