import React, {PropsWithChildren} from "react";

export default function PopupContent({children}: PropsWithChildren) {
  return <div className="sidepopup__content">
    <div className="overflow-auto py-4 px-6 h-full">
      {children}
    </div>
  </div>;
}
