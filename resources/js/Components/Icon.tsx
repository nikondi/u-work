import React, {SVGProps} from "react"

type IconProps = {
    icon: 'phone' | 'phone-o' | 'envelope' | 'locate' | 'pencil' | 'check' | 'times' | 'plus' | 'objects' | string,
    size?: string,
} & SVGProps<any>;

export default function Icon({width = null, height = null, size = '1em', icon, ...props}: IconProps) {
    return <svg className="icon" width={width || size} height={height || size} {...props}>
        <use xlinkHref={`/assets/images/icons.svg?ver=1.1#${icon}`} />
    </svg>
}
