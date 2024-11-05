import {PropsWithChildren} from "react";
import {Role} from "@/features/auth";
import {useAuth} from "@/Contexts/AuthContext";

type Props = {
  roles: Role[] | Role,
  showAdmin?: boolean,
}

export default function HasRole({roles = [], showAdmin = true, children}: PropsWithChildren<Props>) {
  const {hasRole, user} = useAuth();

  if (typeof roles === 'string')
    roles = [roles];

  return user && ((hasRole(roles) || (showAdmin && hasRole('admin')))) && children;
}
