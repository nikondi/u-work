import React, {PropsWithChildren} from "react";

export default function Form() {
    return (
        <></>
    )
}

type FormRowProps = {
    label?: string|number,
    className?: string,
};

export function FormRow({label = '', className = '', children}: PropsWithChildren<FormRowProps>) {
    return <label className={'form-row '+className}>
        {label && <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</div>}
        {children}
    </label>
}
