import {twMerge} from "tailwind-merge";
import React, {PropsWithChildren, useEffect} from "react";

type Props = {
    className?: string,
    show: boolean,
    setShow: stateFunction<boolean>
};

export default function Popup({children, className = '', show, setShow = null}: PropsWithChildren<Props>) {
    const classes = twMerge('popup'+(show?'':' hidden'), className);

    const handleEscape = (e: KeyboardEvent) => {
        if(e.key === 'Escape')
            setShow(false);
    }

    useEffect(() => {
        document.addEventListener('keyup', handleEscape)
        return () => document.removeEventListener('keyup', handleEscape);
    }, []);

    const close = () => {
      if(setShow)
        setShow(false);
    }

    return (
        <div className={classes} onClick={close}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-close" onClick={close}>
                    <svg width="15" height="15" viewBox="0 0 329.269 329"><g><path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" fill="currentColor"></path></g></svg>
                </div>
                <div className="popup-content__inner">
                    {children}
                </div>
            </div>
        </div>
    )
}
