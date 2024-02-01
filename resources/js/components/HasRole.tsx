import React, {PropsWithChildren} from "react";
import {useAuth} from "@/lib/auth";
import {Role} from "@/features/auth";

type HasRoleProps = {
    roles: Role[] | Role,
    showAdmin?: boolean,
}

export default function HasRole({roles = [], showAdmin = true, children}: PropsWithChildren<HasRoleProps>) {
    const {user} = useAuth();

    if(typeof roles === 'string')
        roles = [roles];

    return <>{(user.hasRole(...roles) || (showAdmin && user.hasRole('admin'))) && children}</>;
}
