import React from "react";

export default function Save({children, sticky = false}) {
  return <div className="h-20">
    <div className={"shadow-md bottom-0 left-0 right-0 p-3 bg-white dark:bg-gray-800 flex justify-end gap-x-3 z-50"+(sticky?' sticky':' absolute')}>
      {children}
    </div>
  </div>
}
