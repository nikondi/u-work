import {useMemo} from "react";

export default function LoadingArea({show}) {

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
