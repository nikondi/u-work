import React, {createContext, PropsWithChildren, useContext} from "react";

type Props = {
    label?: string,
    className?: string,
    required?: boolean|undefined
};

type FormRowContext = {
    label: string,
    required: boolean
}

function FormRowInner({className, children}) {
    const {label, required} = useFormRowContext();
    return <div className={'form-row '+className}>
        {label && <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{label} {required && <span className="text-red-600 dark:text-red-400">*</span>}</div>}
        {children}
    </div>
}

const FormRowContext = createContext<FormRowContext>(null);
export const useFormRowContext = () => useContext(FormRowContext);

export function FormRow({children, label, className = '', required = null}: PropsWithChildren<Props>) {
    return <FormRowContext.Provider value={{
        label: label || '',
        required: required !== null && required
    }}>
        <FormRowInner className={className}>
            {children}
        </FormRowInner>
    </FormRowContext.Provider>
}
