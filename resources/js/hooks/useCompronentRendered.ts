import {useRef} from "react";

type callback = (count: number) => void

const useComponentRendered = (callback: callback = console.log) => {
  const count = useRef(0);

  count.current++;

  if(callback)
    callback(count.current);
  return count.current;
}

export default useComponentRendered;
