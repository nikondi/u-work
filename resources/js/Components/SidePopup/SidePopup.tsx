import React, {PropsWithChildren} from "react";

type Props = {
  onClose?: () => void,
}

export default function SidePopup({children, onClose}: PropsWithChildren<Props>) {
  return <div className="sidepopup">
      <div className="sidepopup__background" onClick={() => onClose && onClose()}></div>
      {children}
    </div>;
}
