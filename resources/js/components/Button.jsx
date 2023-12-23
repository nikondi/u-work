import {twMerge} from "tailwind-merge";

export default function Button({color = 'primary', className, children, onClick = null, ...attributes}) {
    let classNames = twMerge(`btn btn-${color} px-4 py-2`, className);

    return (
        <button className={classNames} onClick={onClick} {...attributes}>
            {children}
        </button>
    )
}
