import React from "react";
import {useMemo} from "react";

export default function LoadingArea({show = false}) {
    const classes = useMemo(() => {
        const classes = "loading-area";
        if(show)
            return classes+' loading-area--loading';
        return classes;
    }, [show]);

    return (
        <div className={classes}></div>
    )
}
