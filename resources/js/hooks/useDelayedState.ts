import {useRef, useState} from "react";
import {stateFunction} from "@/types";

export function useDelayedState<T = any>(setter: stateFunction<T> , timeout = 100, defaultValue: T = null) {
    const timeoutRef = useRef<number|null>(null);
    const [_value, setValue] = useState<T>(defaultValue);

    return [
        _value,
        (value: T) => {
            setValue(value);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setter(value), timeout);
        }
    ] as [T, stateFunction<T>]
}
