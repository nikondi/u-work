import React, {createContext, ReactElement, useContext, useState} from "react";

type SidePopupContext = {
  openPopup: (inner: ReactElement) => void,
  closePopup: () => void
}
const SidePopupContext = createContext<SidePopupContext>(null);
export const useSidePopupContext = () => useContext(SidePopupContext);

export default function SidePopup({children}) {
  const [popups, setPopups] = useState<ReactElement[]>([]);

  const openPopup = (inner: ReactElement) => setPopups([...popups, inner]);
  const closePopup = () => {
    if(popups.length > 0)
      setPopups([...popups.slice(0, -1)]);
  }

  return <SidePopupContext.Provider value={{openPopup, closePopup}}>
    {popups.length > 0 && <div className="sidepopup">
      <div className="sidepopup__background" onClick={() => closePopup()}></div>
      {popups.map((el, i) => <div className="sidepopup__content" key={i}>
        <div className="sidepopup__close" onClick={() => closePopup()}>
          <svg width="1em" height="1em" viewBox="0 0 329.269 329"><path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" fill="currentColor"/></svg>
        </div>
        <div className="overflow-auto py-4 px-6 h-full">
          {el}
        </div>
      </div>)}
    </div>}
    {children}
  </SidePopupContext.Provider>
}
