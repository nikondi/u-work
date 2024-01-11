import React, {PropsWithChildren} from "react";
import {useStateContext} from "../contexts/ContextProvider";

type HasRoleProps = {
    roles: Role[] | Role,
    showAdmin?: boolean,
}

export default function HasRole({roles = [], showAdmin = true, children}: PropsWithChildren<HasRoleProps>) {
    const {user} = useStateContext();

    if(typeof roles === 'string')
        roles = [roles];

    return <>{(user.hasRole(...roles) || (showAdmin && user.hasRole('admin'))) && children}</>;
}
