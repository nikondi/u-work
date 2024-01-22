import React, {SVGProps} from "react"

type IconProps = {
    icon: 'arrow-right' | 'check' | string,
} & SVGProps<any>;

export default function Icon({width = '1em', height = '1em', icon, ...props}: IconProps) {
    return <svg className="icon" width={width} height={height} {...props}>
        <use xlinkHref={`/assets/images/icons.svg#${icon}`} />
    </svg>
}
