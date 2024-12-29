import React, {PropsWithChildren} from "react";

const defaultClasses = 'h-20';

type Props = {
  className?: ((defaultClass: string) => string) | string,
  sticky?: boolean
}

export default function Save({children, className = '', sticky = false}: PropsWithChildren<Props>) {
  const classes = typeof className == 'function'?className(defaultClasses):`${defaultClasses} ${className}`;
  return <div className={classes}>
    <div className={"shadow-md bottom-0 left-0 right-0 p-3 bg-white dark:bg-gray-800 flex justify-end gap-x-3 z-50"+(sticky?' sticky':' absolute')}>
      {children}
    </div>
  </div>
}
