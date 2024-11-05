import {twMerge} from "tailwind-merge";
import React, {PropsWithChildren} from "react";
import {InertiaLinkProps, Link} from "@inertiajs/react";

type Props = PropsWithChildren<{
  active?: boolean
} & InertiaLinkProps>

export default function SidebarNavLink({className = '', active, children, ...attributes}: Props) {
  return (
    <Link className={twMerge('sidebar-link', className, active && 'active')} {...attributes}>
      {children}
    </Link>
  )
}
