import React, {ReactElement} from "react";
import {useStateContext} from "../contexts/ContextProvider";

type Role = 'admin' | 'manager' | 'tomoru' | 'worker';

type HasRoleProps = {
    roles: Role[] | Role,
    showAdmin?: boolean,
    children?: ReactElement[] | ReactElement
}

export default function HasRole({roles = [], showAdmin = true, children}: HasRoleProps) {
    const {user} = useStateContext();

    if(typeof roles === 'string')
        roles = [roles];

    return <>{(user.hasRole(...roles) || (showAdmin && user.hasRole('admin'))) && children}</>;
}
