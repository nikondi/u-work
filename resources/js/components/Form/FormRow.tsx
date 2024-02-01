import React, {PropsWithChildren} from "react";

type Props = {
    label?: string|number,
    className?: string,
    required?: boolean|undefined
};
export function FormRow({label = '', className = '', required = null, children}: PropsWithChildren<Props>) {
    return <div className={'form-row '+className}>
        {label && <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label} {required !== null && <span className="text-red-600 dark:text-red-400">*</span>}</div>}
        {children}
    </div>
}
