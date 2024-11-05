import {AuthContext} from "./AuthContext";
import {PropsWithChildren} from "react";
import {router, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {TAuthContext} from "@/Contexts/AuthContext/types";

export default function AuthProvider({children}: PropsWithChildren) {
  const {user} = usePage<PageProps>().props.auth;
  console.log(user)

  const logout = () => {
    return router.get(route('logout'));
  }
  const hasRole: TAuthContext['hasRole'] = (roles) => {
    let find = false;
    if(Array.isArray(roles)) {
      roles.forEach((role) => {
        if(user.roles.includes(role)) {
          find = true;
          return false;
        }
      })
    }
    else
      find = user.roles.includes(roles);
    return find;
  }

  return <AuthContext.Provider value={{
    user, logout, hasRole
  }}>
    {children}
  </AuthContext.Provider>
}
