import {useMemo, useState} from "react";
import StackLine from "./StackLine";
import {parseStack} from "../helpers";
import {BoundaryInnerProps} from "../types";


export default function Debug({error, debugInfo}: BoundaryInnerProps) {
  const [opened, setOpened] = useState(false);
  const stack = useMemo(() => parseStack(error.stack), [error.stack]);

  return <div className="bg-red-500 p-3 rounded-md text-white">
    <div className="text-lg font-bold mb-2">Произошла ошибка{debugInfo?.componentName && `: ${debugInfo?.componentName}`}</div>
    {error && <>
      <div className="bg-gray-700 p-1 px-2 rounded">
        {stack && <div className="mb-1"><StackLine line={stack[0]}/></div>}
        <div className="fallback__message">{error.message}</div>
      </div>
      {stack && <>
        <button onClick={() => setOpened((prev) => !prev)} className="my-2 underline">{opened ? 'Закрыть' : 'Открыть'} стек</button>
        {opened && <div className="fallback__stack">
            {stack.map((line, i) => <StackLine line={line} key={i}/>)}
        </div>}
      </>}
    </>}
  </div>
}
