import React, {useRef, useEffect, PropsWithChildren, HTMLAttributes} from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {OptionsType} from "@fancyapps/ui/types/Fancybox/options";

type Props = {
  selector?: string,
  options?: Partial<OptionsType>
} & HTMLAttributes<HTMLDivElement>

function Fancybox({selector = '[data-fancybox]', options = {}, children, ...attributes}: PropsWithChildren<Props>) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    NativeFancybox.bind(container, selector, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef} {...attributes}>{children}</div>;
}

export default Fancybox;
